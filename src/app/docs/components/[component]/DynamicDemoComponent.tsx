"use client";

import dynamic from "next/dynamic";

const DynamicDemoComponent = ({ componentName }: { componentName: string }) => {
  const Demo = dynamic(
    () =>
      import(`@/components/${componentName}/Demo`).then((mod) => mod.default),
    {
      ssr: true,
      loading: () => (
        <div className="flex w-full h-56 rounded bg-greyLight animate-pulse"></div>
      ),
    }
  );

  return (
    <div className="flex p-8 w-full flex-col gap-8 items-center rounded-lg border border-greyBorder">
      <Demo />
    </div>
  );
};

export default DynamicDemoComponent;
