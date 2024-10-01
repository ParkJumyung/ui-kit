"use client";

import { NextPage } from "next";
import { useEffect, useState } from "react";

interface Props {
  params: {
    component: string;
  };
}

const DynamicComponent: NextPage<Props> = ({ params }) => {
  const { component } = params;

  const [Component, setComponent] = useState<React.FC | null>(null);

  useEffect(() => {
    const loadComponent = async () => {
      try {
        const componentName = component.replace(
          /(\w)(\w*)/g,
          function (g0, g1, g2) {
            return g1.toUpperCase() + g2.toLowerCase();
          }
        );
        const { default: importedComponent } = await import(
          `@/components/${componentName}/${componentName}`
        );
        setComponent(() => importedComponent);
      } catch (error) {
        console.error("Error loading component:", error);
        setComponent(() => () => <div>Component not found</div>);
      }
    };

    loadComponent();
  }, [component]);

  return Component ? <Component /> : <div>Loading...</div>;
};

export default DynamicComponent;
