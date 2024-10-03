import { Suspense } from "react";

import Select from "@/components/Select/Select";

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
    `http://localhost:3000/api/get-component/${componentName}`
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
        <div className="flex overflow-y-scroll max-h-80 rounded-lg">
          <Suspense
            fallback={
              <div className="w-full h-80 bg-greyLight animate-pulse"></div>
            }
          >
            <code className="block text-sm w-fit h-fit whitespace-pre-wrap bg-greyLight p-8">
              {code.content}
            </code>
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default ComponentPage;
