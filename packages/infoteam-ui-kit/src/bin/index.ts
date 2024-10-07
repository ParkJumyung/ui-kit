#!/usr/bin/env node

import fetchComponent from "../fetchComponent"; // Adjust path as necessary
import getStylingFiles from "../getStylingFiles";

// Get the component name from the command line arguments
const [, , command, componentName] = process.argv;

// Ensure the "add" command and component name are provided
if (command === "add" && componentName) {
  fetchComponent(componentName);
  getStylingFiles();
} else {
  console.error("Usage: npx ui-kit add <ComponentName>");
  process.exit(1);
}
