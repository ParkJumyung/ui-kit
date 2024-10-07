"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const getStylingFiles = async () => {
    try {
        const response = await fetch(`https://infoteam-ui-kit.vercel.app/api/get-styling-files`);
        // Ensure the response is OK (status code 200-299)
        if (!response.ok) {
            throw new Error(`Error fetching styling files`);
        }
        const stylingFiles = await response.json();
        if (!stylingFiles || stylingFiles.error) {
            console.error(`styling files not found.`);
            process.exit(1);
        }
        for (const styleData of stylingFiles.stylesData) {
            fs_1.default.writeFileSync(path_1.default.join(process.cwd(), styleData.path), styleData.code, "utf-8");
        }
        console.log(`Styling files successfully added!`);
    }
    catch (error) {
        console.error(`Error fetching styling files`);
        process.exit(1);
    }
};
exports.default = getStylingFiles;
