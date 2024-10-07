import path from "path";

import { ComponentDataType } from "@/app/api/fetch-component/[component]/route";
import componentsData from "@/public/components.json";

import kebabToPascal from "./kebabToPascal";

const fetchComponent = (componentName: string) => {
  const componentData: ComponentDataType[] = componentsData;

  const component = componentData.find(
    (comp) => comp.name === kebabToPascal(componentName)
  );

  if (!component) {
    throw new Error("Component not found");
  }

  const dependentFiles: ComponentDataType[] =
    component?.imports
      .map((importPath) =>
        componentData.find(
          (comp) =>
            comp.path.replace(/\.[^/.]+$/, "") ===
            path.join(component.path, "..", importPath)
        )
      )
      .filter((comp): comp is ComponentDataType => comp !== undefined) ?? [];

  return {
    component,
    dependentFiles,
  };
};

export default fetchComponent;
