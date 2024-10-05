#!/usr/bin/env node

import { execSync } from "child_process";
import fs from "fs";
import path from "path";

const createDirectory = (dirPath: string) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`Created directory: ${dirPath}`);
  }
};

const installPackages = (packages: string[]) => {
  console.log("Checking for missing packages...");

  packages.forEach((pkg) => {
    try {
      require.resolve(pkg);
    } catch (error) {
      console.log(`Installing missing package: ${pkg}`);
      execSync(`npm install ${pkg}`, { stdio: "inherit" });
    }
  });
};

// Function to fetch the component and its imports recursively
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

    if (
      componentsData.component.dependencies &&
      componentsData.component.dependencies.length > 0
    ) {
      installPackages(componentsData.component.dependencies);
    }

    console.log(`Component "${componentName}" successfully added!`);
  } catch (error) {
    console.error(`Error fetching component`);
    process.exit(1);
  }
};

export default fetchComponent;
