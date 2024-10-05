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
  const code = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/get-component/${componentName}`
  ).then((data) => data.json());

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
        <Code code={code.content} />
      </div>
    </div>
  );
};

export default ComponentPage;
