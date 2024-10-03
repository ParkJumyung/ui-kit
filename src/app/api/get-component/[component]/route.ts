import fs from "fs";
import { NextResponse } from "next/server";
import path from "path";
import ts from "typescript";

export const COMPONENTS_DIRECTORY_PATH = "./src/components";

const extractImports = (filePath: string): string[] => {
  const sourceCode = fs.readFileSync(filePath, "utf-8");

  const sourceFile = ts.createSourceFile(
    filePath,
    sourceCode,
    ts.ScriptTarget.Latest,
    true
  );

  const imports: string[] = [];

  ts.forEachChild(sourceFile, function visit(node) {
    if (ts.isImportDeclaration(node) && node.moduleSpecifier) {
      const importPath = node.moduleSpecifier
        .getText(sourceFile)
        .replace(/['"]/g, "");
      imports.push(importPath);
    }
    ts.forEachChild(node, visit);
  });

  return imports;
};

export async function GET(
  request: Request,
  { params }: { params: { component: string } }
) {
  const componentName = params.component;
  const componentPath = path.join(
    process.cwd(),
    COMPONENTS_DIRECTORY_PATH,
    componentName,
    componentName + ".tsx"
  );

  try {
    const stat = fs.statSync(componentPath);

    if (stat.isDirectory()) {
      const files = fs.readdirSync(componentPath, { withFileTypes: true });
      const fileStructure = files.map((file) => ({
        name: file.name,
        isDirectory: file.isDirectory(),
      }));

      return NextResponse.json(fileStructure);
    } else if (stat.isFile()) {
      const fileContents = fs.readFileSync(componentPath, "utf-8");
      const imports = extractImports(componentPath);

      return NextResponse.json({
        name: componentName,
        path: componentPath,
        imports: imports,
        content: fileContents,
      });
    } else {
      return NextResponse.json(
        { error: "Path is neither a file nor a directory" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error reading file or directory:", error);
    return NextResponse.json(
      { error: "Unable to read the file or directory" },
      { status: 500 }
    );
  }
}
