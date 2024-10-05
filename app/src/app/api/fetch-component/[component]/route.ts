import { NextResponse } from "next/server";
import path from "path";

import componentsData from "@/public/components.json";
import kebabToPascal from "@/app/docs/components/[component]/kebabToPascal";

export interface ComponentDataType {
  name: string;
  path: string;
  imports: string[];
  dependencies: string[];
  code: string;
}

export async function GET(
  request: Request,
  { params }: { params: { component: string } }
) {
  const componentName = params.component;

  try {
    const componentData: ComponentDataType[] = componentsData;

    const component = componentData.find(
      (comp) => comp.name === kebabToPascal(componentName)
    );

    console.log(component?.imports);

    const dependentFiles =
      component?.imports.map((importPath) =>
        componentData.find(
          (comp) =>
            comp.path.replace(/\.[^/.]+$/, "") ===
            path.join(component.path, "..", importPath)
        )
      ) ?? [];

    if (!component) {
      return NextResponse.json(
        { error: "Component not found" },
        { status: 404 }
      );
    }

    return NextResponse.json([component, ...dependentFiles]);
  } catch (error) {
    console.error("Error reading component data:", error);
    return NextResponse.json(
      { error: "Unable to read component data" },
      { status: 500 }
    );
  }
}
