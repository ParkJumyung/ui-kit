import fs from 'fs';
import path from 'path';
import ts from 'typescript';

/**
 * @param {string} filePath - Path to the TypeScript file.
 * @returns {Object} An object containing lists of import paths and dependencies.
 */
const extractDependencies = (filePath) => {
  const sourceCode = fs.readFileSync(filePath, 'utf-8');

  const sourceFile = ts.createSourceFile(
    filePath,
    sourceCode,
    ts.ScriptTarget.Latest,
    true
  );

  const dependencies = []; // npm packages to install
  const imports = []; // local file imports

  ts.forEachChild(sourceFile, function visit(node) {
    if (ts.isImportDeclaration(node) && node.moduleSpecifier) {
      const importPath = node.moduleSpecifier.getText(sourceFile).replace(/['"]/g, '');

      // Check if the import path is a local file (not an npm package)
      if (!importPath.includes('/')) {
        dependencies.push(importPath); // Add to dependencies if it's an npm package
      } else {
        imports.push(importPath); // Add to imports if it's a local file
      }
    }
    ts.forEachChild(node, visit);
  });

  return {
    dependencies,
    imports
  };
};

/**
 * Recursively finds all .tsx and .ts files in the components directory,
 * ignoring files with 'Demo' in the name.
 * @param {string} dir - Directory to search in.
 * @returns {Object[]} - Array of component data objects.
 */
const findFilesInDirectory = (dir) => {
  const componentData = [];

  const items = fs.readdirSync(dir);

  for (const item of items) {
    const fullPath = path.join(dir, item);

    if (fs.statSync(fullPath).isDirectory()) {
      // Recursively search in subdirectories
      componentData.push(...findFilesInDirectory(fullPath));
    } else if ((item.endsWith('.tsx') || item.endsWith('.ts')) && !item.includes('Demo')) {
      const { imports, dependencies } = extractDependencies(fullPath);
      componentData.push({
        name: path.basename(fullPath, path.extname(fullPath)),
        path: fullPath,
        imports,
        dependencies,
        code: fs.readFileSync(fullPath, 'utf-8')
      });
    }
  }

  return componentData;
};

/**
 * Reads and generates a list of stylesheets (globals.css and variables.css).
 */
const generateStylesList = () => {
  const styles = [];
  const styleFiles = [
    { name: 'variables.css', path: './src/app/variables.css' },
    { name: 'globals.css', path: './src/app/globals.css' },
    { name: 'tailwind.config.ts', path: './tailwind.config.ts' }
  ];

  for (const styleFile of styleFiles) {
    const fullPath = path.resolve(styleFile.path);
    if (fs.existsSync(fullPath)) {
      const code = fs.readFileSync(fullPath, 'utf-8');
      styles.push({
        name: styleFile.name,
        path: styleFile.path,
        code
      });
    } else {
      console.warn(`Style file not found: ${styleFile.path}`);
    }
  }

  const outputPath = path.join('src', 'public', 'styles.json');
  fs.writeFileSync(outputPath, JSON.stringify(styles, null, 2));

  console.log('Styles list generated:', outputPath);
};

/**
 * Generates component list and styles list.
 */
const generateComponentList = () => {
  const COMPONENTS_DIRECTORY_PATH = './src/components';

  if (!fs.existsSync(COMPONENTS_DIRECTORY_PATH)) {
    console.warn('Components directory does not exist. Skipping component generation.');
    return;
  }

  // Gather all components from the components directory
  const componentData = findFilesInDirectory(COMPONENTS_DIRECTORY_PATH);

  const outputPath = path.join("src", './public', 'components.json');
  fs.writeFileSync(outputPath, JSON.stringify(componentData, null, 2));

  console.log('Component list generated:', outputPath);
};

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (isServer) {
      generateComponentList();
      generateStylesList();  // Also generate the styles list during build time
    }
    return config;
  },
};

export default nextConfig;
