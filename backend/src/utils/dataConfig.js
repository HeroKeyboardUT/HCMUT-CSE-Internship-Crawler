import path from "path";
import { fileURLToPath } from "url";

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create a relative path from the current directory
export const dataPath = path.resolve(__dirname, "../data");
