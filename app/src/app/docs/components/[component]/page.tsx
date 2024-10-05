import Code from "./Code";
import DynamicDemoComponent from "./DynamicDemoComponent";
import kebabToPascal from "./kebabToPascal";

interface ComponentPageProps {
  params: {
    component: string;
  };
}

const ComponentPage = async ({ params }: ComponentPageProps) => {
  const componentName = kebabToPascal(params.component);

  let componentData;
  try {
    const response = await fetch(
      `http://localhost:3000/api/fetch-component/${componentName}`
    );

    if (!response.ok) {
      throw new Error("Component not found");
    }

    componentData = await response.json();
  } catch (error) {
    console.error("Error fetching component data:", error);
    return (
      <div className="text-red-500">
        <p>Error fetching component data</p>
      </div>
    );
  }

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
        <Code code={componentData.code} />
      </div>
    </div>
  );
};

export default ComponentPage;
