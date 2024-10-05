import fs from 'fs';
import path from 'path';
import ts from 'typescript';

/**
 * @param {string} filePath - Path to the TypeScript file.
 * @returns {string[]} List of import paths.
 */
const extractDependencies = (filePath) => {
  const sourceCode = fs.readFileSync(filePath, 'utf-8');

  const sourceFile = ts.createSourceFile(
    filePath,
    sourceCode,
    ts.ScriptTarget.Latest,
    true
  );

  const dependencies = [];
  const imports = [];

  ts.forEachChild(sourceFile, function visit(node) {
    if (ts.isImportDeclaration(node) && node.moduleSpecifier) {
      const importPath = node.moduleSpecifier.getText(sourceFile).replace(/['"]/g, '');
      if (!importPath.includes('/')) {
        dependencies.push(importPath);
      } else {
        imports.push(importPath);
      }
    }
    ts.forEachChild(node, visit);
  });

  return {
    dependencies,
    imports
  };
};

const generateComponentList = () => {
  const COMPONENTS_DIRECTORY_PATH = './src/components';

  if (!fs.existsSync(COMPONENTS_DIRECTORY_PATH)) {
    console.warn('Components directory does not exist. Skipping generation.');
    return;
  }

  const components = fs.readdirSync(COMPONENTS_DIRECTORY_PATH);

  const componentData = components
    .map((component) => {
      const componentDirPath = path.join(COMPONENTS_DIRECTORY_PATH, component);

      if (fs.statSync(componentDirPath).isDirectory()) {
        const componentFilePath = path.join(componentDirPath, `${component}.tsx`);

        if (fs.existsSync(componentFilePath)) {
          const fileContents = fs.readFileSync(componentFilePath, 'utf-8');
          const { imports, dependencies } = extractDependencies(componentFilePath);

          return {
            name: component,
            path: componentFilePath,
            imports: imports,
            dependencies: dependencies,
            code: fileContents,
          };
        }
      }
      return null;
    })
    .filter(Boolean);

  const outputPath = path.join("src", './public', 'components.json');
  fs.writeFileSync(outputPath, JSON.stringify(componentData, null, 2));

  console.log('Component list generated:', outputPath);
};

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (isServer) {
      generateComponentList();
    }
    return config;
  },
};

export default nextConfig;
