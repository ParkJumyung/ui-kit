"use client";

import React, { Children, PropsWithChildren, useState } from "react";

import { extractDefaultVariants } from "@/lib/utils";
import Tabs from "@/components/Select/Select";

interface DefaultDemo extends PropsWithChildren {
  variantsConfig: {
    [key: string]: {
      [key: string]: string;
    };
  };
}

const DefaultDemo = ({ children, variantsConfig }: DefaultDemo) => {
  const [variants, setVariants] = useState(
    extractDefaultVariants(variantsConfig)
  );

  return (
    <div className="flex w-full flex-col items-center">
      {Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { ...variants });
        }
        return child;
      })}
      <div className="flex w-full h-[1px] bg-greyBorder rounded my-6"></div>
      <ol className="flex flex-col gap-4">
        {Object.keys(variants).map((variant) => (
          <li key={variant}>
            {
              <div className="gap-2 flex flex-col">
                <label className="text-lg">{variant}</label>
                <Tabs
                  value={String(variants[variant])}
                  options={Object.keys(variantsConfig[variant])}
                  onChange={(value) =>
                    setVariants((x) => ({
                      ...x,
                      [variant]: value,
                    }))
                  }
                />
              </div>
            }
          </li>
        ))}
      </ol>
    </div>
  );
};

export default DefaultDemo;
