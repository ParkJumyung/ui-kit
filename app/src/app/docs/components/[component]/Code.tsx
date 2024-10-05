"use client";

import { Suspense, useState } from "react";

import Button from "@/components/Button/Button";

interface CodeProps {
  children: string;
  compact?: boolean;
  filename?: string;
}

const Code = ({ children, compact, filename }: CodeProps) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  return (
    <div className="flex flex-col items-end">
      {filename && <div className="text-greyDark text-sm">{filename}</div>}
      <div
        className={`
        flex flex-col bg-greyLight rounded-lg 
        ${compact && !isExpanded && "overflow-y-scroll"}
        ${!isExpanded && "max-h-80"} 
        `}
      >
        <Suspense
          fallback={
            <div className="w-full h-80 bg-greyLight animate-pulse"></div>
          }
        >
          <code className="block text-sm w-fit h-fit whitespace-pre-wrap p-8">
            {children}
          </code>
        </Suspense>
        {compact && (
          <>
            <div
              className={`sticky inset-0 backdrop-blur-lg ${
                !isExpanded && "py-16"
              }`}
              style={{
                maskImage: "linear-gradient(to bottom, transparent, black)",
              }}
            ></div>
            <Button
              variant={"sub"}
              size={"small"}
              className="sticky bottom-4 mx-auto left-0 right-0 mb-8"
              onClick={() => setIsExpanded((x) => !x)}
            >
              {isExpanded ? "Collapse" : "Expand"}
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default Code;
