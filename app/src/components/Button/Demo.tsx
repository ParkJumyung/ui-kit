import DefaultDemo from "../DefaultDemo";
import Button, { variantsConfig } from "./Button";

const Demo = () => {
  return (
    <DefaultDemo variantsConfig={variantsConfig}>
      <Button>Button</Button>
    </DefaultDemo>
  );
};

export default Demo;
