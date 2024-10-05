import fs from "fs";
import { NextResponse } from "next/server";
import path from "path";

interface ComponentData {
  name: string;
  path: string;
  imports: string[];
  code: string;
}

const COMPONENTS_JSON_PATH = path.join(
  process.cwd(),
  "app",
  "public",
  "components.json"
);

export async function GET(
  request: Request,
  { params }: { params: { component: string } }
) {
  const componentName = params.component;

  try {
    const componentData: ComponentData[] = JSON.parse(
      fs.readFileSync(COMPONENTS_JSON_PATH, "utf-8")
    );

    const component = componentData.find((comp) => comp.name === componentName);

    if (!component) {
      return NextResponse.json(
        { error: "Component not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(component);
  } catch (error) {
    console.error("Error reading component data:", error);
    return NextResponse.json(
      { error: "Unable to read component data" },
      { status: 500 }
    );
  }
}
