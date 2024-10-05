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
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/fetch-component/${componentName}`
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
        <div className="flex flex-col gap-2">
          <div className="text-base font-semibold">Command</div>
          <Code>{`npx infoteam-ui-kit@latest add ${componentName}`}</Code>
        </div>
        <div className="flex flex-col gap-2">
          <div className="text-base font-semibold">Manual</div>
          <Code compact filename={`app/components/ui-kit/${componentName}.tsx`}>
            {componentData.code}
          </Code>
        </div>
      </div>
    </div>
  );
};

export default ComponentPage;
