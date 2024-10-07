import { NextResponse } from "next/server";

import stylesData from "@/public/styles.json";

export interface StylesDataType {
  name: string;
  path: string;
  code: string;
}

export async function GET() {
  return NextResponse.json({
    stylesData,
  });
}
