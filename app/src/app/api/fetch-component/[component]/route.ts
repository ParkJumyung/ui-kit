import { NextResponse } from "next/server";

import componentsData from "@/public/components.json";

interface ComponentData {
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
    const componentData: ComponentData[] = componentsData;

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
