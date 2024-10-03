"use client";

import { useState } from "react";

import DefaultDemo from "../DefaultDemo";
import Select, { variantsConfig } from "./Select";

const Demo = () => {
  const options = ["option1", "option2", "option3"];
  const [selectedOption, setSelectedOption] = useState<string>(options[0]);

  return (
    <DefaultDemo variantsConfig={variantsConfig}>
      <Select
        options={["option1", "option2", "option3"]}
        value={selectedOption}
        onChange={(value) => setSelectedOption(value)}
      ></Select>
    </DefaultDemo>
  );
};

export default Demo;
