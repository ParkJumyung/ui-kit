#!/usr/bin/env ts-node

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

const fetchComponent = async (componentName: string) => {
  try {
    const response = await fetch(
      `https://infoteam-ui-kit.vercel.app/api/fetch-component/${componentName}`
    );

    // Ensure the response is OK (status code 200-299)
    if (!response.ok) {
      throw new Error(`Error fetching component: ${response.statusText}`);
    }

    const component = await response.json();

    if (!component || component.error) {
      console.error(`Component "${componentName}" not found.`);
      process.exit(1);
    }

    const componentDir = path.join(
      process.cwd(),
      "src/app/components/ui-kit",
      componentName
    );
    createDirectory(componentDir);

    const componentFilePath = path.join(componentDir, `${componentName}.tsx`);
    fs.writeFileSync(componentFilePath, component.code, "utf-8");
    console.log(`Created component file: ${componentFilePath}`);

    if (component.imports && component.imports.length > 0) {
      installPackages(component.imports);
    }

    console.log(`Component "${componentName}" successfully added!`);
  } catch (error) {
    console.error(`Error fetching component`);
    process.exit(1);
  }
};

export default fetchComponent;
