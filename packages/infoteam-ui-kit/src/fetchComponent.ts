#!/usr/bin/env node

import { execSync } from "child_process";
import fs from "fs";
import path from "path";

// Function to create a directory if it doesn't exist
const createDirectory = (dirPath: string) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`Created directory: ${dirPath}`);
  }
};

// Function to install missing npm packages
const installPackages = (packages: string[]) => {
  console.log("Checking for missing packages...");

  packages.forEach((pkg) => {
    try {
      require.resolve(pkg);
      console.log(`Package ${pkg} is already installed.`);
    } catch (error) {
      console.log(`Installing missing package: ${pkg}`);
      execSync(`npm install ${pkg}`, { stdio: "inherit" });
    }
  });
};

// Recursive function to install all dependencies
const installDependenciesRecursively = (
  dependencies: string[],
  dependentFiles: any[]
) => {
  const packagesToInstall = new Set(dependencies);

  // Iterate through all dependent files to find more dependencies
  dependentFiles.forEach((file) => {
    if (file.dependencies && file.dependencies.length > 0) {
      file.dependencies.forEach((dep: any) => packagesToInstall.add(dep));
    }
  });

  // Install all gathered packages
  if (packagesToInstall.size > 0) {
    installPackages(Array.from(packagesToInstall));
  }
};

// Function to fetch the component and its dependencies recursively
const fetchComponent = async (componentName: string) => {
  try {
    const response = await fetch(
      `https://infoteam-ui-kit.vercel.app/api/fetch-component/${componentName}`
    );

    // Ensure the response is OK (status code 200-299)
    if (!response.ok) {
      throw new Error(`Error fetching component: ${response.statusText}`);
    }

    const componentsData = await response.json();

    if (!componentsData || componentsData.error) {
      console.error(`Component "${componentName}" not found.`);
      process.exit(1);
    }

    const componentDir = path.join(
      process.cwd(),
      "src/app/components/ui-kit",
      componentName
    );
    createDirectory(componentDir);

    // Write the main component file
    const componentFilePath = path.join(componentDir, `${componentName}.tsx`);
    fs.writeFileSync(componentFilePath, componentsData.component.code, "utf-8");
    console.log(`Created component file: ${componentFilePath}`);

    // Process dependencies and imports recursively
    const dependentFiles = componentsData.dependentFiles || [];
    for (const dependentFile of dependentFiles) {
      const sanitizedPath = path.join(
        process.cwd(),
        "src/app/components/ui-kit",
        dependentFile.path.replace("src/components/", "")
      );
      createDirectory(path.join(sanitizedPath, "../"));
      fs.writeFileSync(sanitizedPath, dependentFile.code, "utf-8");
      console.log(`Created component file: ${sanitizedPath}`);
    }

    // Install dependencies recursively
    if (
      componentsData.component.dependencies &&
      componentsData.component.dependencies.length > 0
    ) {
      installDependenciesRecursively(
        componentsData.component.dependencies,
        dependentFiles
      );
    }

    console.log(`Component "${componentName}" successfully added!`);
  } catch (error) {
    console.error(`Error fetching component: ${error}`);
    process.exit(1);
  }
};

export default fetchComponent;
