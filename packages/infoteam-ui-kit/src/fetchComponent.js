#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const createDirectory = (dirPath) => {
    if (!fs_1.default.existsSync(dirPath)) {
        fs_1.default.mkdirSync(dirPath, { recursive: true });
        console.log(`Created directory: ${dirPath}`);
    }
};
const installPackages = (packages) => {
    console.log("Checking for missing packages...");
    packages.forEach((pkg) => {
        try {
            require.resolve(pkg);
        }
        catch (error) {
            console.log(`Installing missing package: ${pkg}`);
            (0, child_process_1.execSync)(`npm install ${pkg}`, { stdio: "inherit" });
        }
    });
};
// Function to fetch the component and its imports recursively
const fetchComponent = async (componentName) => {
    try {
        const response = await fetch(`https://infoteam-ui-kit.vercel.app/api/fetch-component/${componentName}`);
        // Ensure the response is OK (status code 200-299)
        if (!response.ok) {
            throw new Error(`Error fetching component: ${response.statusText}`);
        }
        const component = await response.json();
        if (!component || component.error) {
            console.error(`Component "${componentName}" not found.`);
            process.exit(1);
        }
        const componentDir = path_1.default.join(process.cwd(), "src/app/components/ui-kit", componentName);
        createDirectory(componentDir);
        // Write the main component file
        const componentFilePath = path_1.default.join(componentDir, `${componentName}.tsx`);
        fs_1.default.writeFileSync(componentFilePath, component.code, "utf-8");
        console.log(`Created component file: ${componentFilePath}`);
        // Process dependencies and imports recursively
        const imports = component.imports || [];
        for (const importPath of imports) {
            const sanitizedPath = importPath.replace(/['"]/g, "");
            await handleImport(sanitizedPath, componentDir);
        }
        if (component.dependencies && component.dependencies.length > 0) {
            installPackages(component.dependencies);
        }
        console.log(`Component "${componentName}" successfully added!`);
    }
    catch (error) {
        console.error(`Error fetching component`);
        process.exit(1);
    }
};
// Function to handle importing of other modules
const handleImport = async (importPath, componentDir) => {
    try {
        // Make a request to fetch the imported component
        const response = await fetch(`https://infoteam-ui-kit.vercel.app/api/fetch-component/${importPath}`);
        // Ensure the response is OK
        if (!response.ok) {
            throw new Error(`Error fetching imported component: ${response.statusText}`);
        }
        const importedComponent = await response.json();
        if (!importedComponent || importedComponent.error) {
            console.error(`Imported component "${importPath}" not found.`);
            return; // If not found, we just skip
        }
        // Determine the appropriate file name and path
        const fileName = path_1.default.basename(importPath);
        const importedFilePath = path_1.default.join(componentDir, fileName.endsWith(".tsx") || fileName.endsWith(".ts")
            ? fileName
            : `${fileName}.ts`);
        // Write the imported component file
        fs_1.default.writeFileSync(importedFilePath, importedComponent.code, "utf-8");
        console.log(`Created imported component file: ${importedFilePath}`);
        // Recursively handle the imports of the imported component
        const importedImports = importedComponent.imports || [];
        for (const innerImport of importedImports) {
            const sanitizedInnerImport = innerImport.replace(/['"]/g, "");
            await handleImport(sanitizedInnerImport, componentDir);
        }
    }
    catch (error) {
        console.error(`Error processing import "${importPath}"`);
    }
};
exports.default = fetchComponent;
