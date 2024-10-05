import fs from "fs";
import path from "path";

interface ComponentData {
  name: string;
  path: string;
  imports: string[];
  code: string;
}

const COMPONENTS_JSON_PATH = path.join(
  process.cwd(),
  "public",
  "components.json"
);

export async function fetchComponentData(
  componentName: string
): Promise<ComponentData> {
  const componentData: ComponentData[] = JSON.parse(
    fs.readFileSync(COMPONENTS_JSON_PATH, "utf-8")
  );

  const component = componentData.find((comp) => comp.name === componentName);

  if (!component) {
    throw new Error("Component not found");
  }

  return component;
}
