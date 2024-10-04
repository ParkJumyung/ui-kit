"use client";

import { Suspense, useState } from "react";

import Button from "@/components/Button/Button";

interface CodeProps {
  code: string;
}

const Code = ({ code }: CodeProps) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  return (
    <div
      className={`
        flex flex-col overflow-y-scroll bg-greyLight rounded-lg 
        ${!isExpanded && "max-h-80"} 
        `}
    >
      <Suspense
        fallback={
          <div className="w-full h-80 bg-greyLight animate-pulse"></div>
        }
      >
        <code className="block text-sm w-fit h-fit whitespace-pre-wrap p-8">
          {code}
        </code>
      </Suspense>
      <div
        className={`sticky inset-0 backdrop-blur-lg ${!isExpanded && "py-16"}`}
        style={{
          maskImage: "linear-gradient(to bottom, transparent, black)",
        }}
      ></div>
      <Button
        variant={"sub"}
        size={"small"}
        className="sticky bottom-4 mx-auto left-0 right-0"
        onClick={() => setIsExpanded((x) => !x)}
      >
        {isExpanded ? "Collapse" : "Expand"}
      </Button>
    </div>
  );
};

export default Code;
