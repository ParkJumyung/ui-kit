import { ComponentDataType } from "@/app/api/fetch-component/[component]/route";

import Code from "./Code";
import DynamicDemoComponent from "./DynamicDemoComponent";
import fetchComponent from "./fetchComponent";
import kebabToPascal from "./kebabToPascal";

interface ComponentPageProps {
  params: {
    component: string;
  };
}

const ComponentPage = async ({ params }: ComponentPageProps) => {
  const componentName = kebabToPascal(params.component);

  let componentsData: {
    component: ComponentDataType;
    dependentFiles: ComponentDataType[];
  };

  try {
    componentsData = fetchComponent(componentName);
  } catch (error) {
    console.error("Error fetching component data:", error);
    return (
      <div className="text-red-500">
        <p>Error fetching component data</p>
      </div>
    );
  }

  const { component, dependentFiles } = componentsData;

  return (
    <div className="flex flex-col gap-8 w-full">
      <div className="flex text-3xl font-bold flex-col border-b-2 border-b-greyBorder py-2">
        <code>{componentName}</code>
      </div>
      <div className="w-full flex-col">
        <div className="flex text-xl font-semibold mb-4">Demo</div>
        <DynamicDemoComponent componentName={componentName} />
      </div>
      <div className="flex flex-col gap-4">
        <div className="text-xl font-semibold">Installation</div>
        <div className="flex flex-col gap-2">
          <div className="text-lg font-semibold">With Command</div>
          <Code>{`npx infoteam-ui-kit@latest add ${componentName}`}</Code>
        </div>
        <div className="flex flex-col gap-2">
          <div className="text-lg font-semibold">Manually</div>
          <div className="text-base font-semibold">1. Add component file</div>
          <Code compact filename={component.path}>
            {component.code}
          </Code>
          <div className="text-base font-semibold">2. Add imported files</div>
          {dependentFiles.map(({ code, path }) => (
            <Code key={path} compact filename={path}>
              {code}
            </Code>
          ))}
          <div className="text-base font-semibold">3. Install dependencies</div>
          {component.dependencies.map((dependency) => (
            <Code key={dependency} filename={"npm"}>
              {`npm install ${dependency}`}
            </Code>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ComponentPage;
