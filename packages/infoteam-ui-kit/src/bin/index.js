#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fetchComponent_1 = __importDefault(require("../fetchComponent")); // Adjust path as necessary
// Get the component name from the command line arguments
const [, , command, componentName] = process.argv;
// Ensure the "add" command and component name are provided
if (command === "add" && componentName) {
    (0, fetchComponent_1.default)(componentName);
}
else {
    console.error("Usage: npx ui-kit add <ComponentName>");
    process.exit(1);
}
