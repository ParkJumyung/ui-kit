import fs from 'fs';
import path from 'path';
import ts from 'typescript';

/**
 * @param {string} filePath - Path to the TypeScript file.
 * @returns {string[]} List of import paths.
 */
const extractImports = (filePath) => {
  const sourceCode = fs.readFileSync(filePath, 'utf-8');

  const sourceFile = ts.createSourceFile(
    filePath,
    sourceCode,
    ts.ScriptTarget.Latest,
    true
  );

  const imports = [];

  ts.forEachChild(sourceFile, function visit(node) {
    if (ts.isImportDeclaration(node) && node.moduleSpecifier) {
      const importPath = node.moduleSpecifier.getText(sourceFile).replace(/['"]/g, '');
      imports.push(importPath);
    }
    ts.forEachChild(node, visit);
  });

  return imports;
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
          const imports = extractImports(componentFilePath);

          return {
            name: component,
            path: componentFilePath,
            imports: imports,
            code: fileContents,
          };
        }
      }
      return null;
    })
    .filter(Boolean);

  const outputPath = path.join('./public', 'components.json');
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
