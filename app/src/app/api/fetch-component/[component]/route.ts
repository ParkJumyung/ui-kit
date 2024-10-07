import { NextResponse } from "next/server";

import fetchComponent from "@/app/docs/components/[component]/fetchComponent";

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
    return NextResponse.json(fetchComponent(componentName));
  } catch (error) {
    console.error("Error reading component data:", error);
    return NextResponse.json(
      { error: "Unable to read component data" },
      { status: 500 }
    );
  }
}
