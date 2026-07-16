import { writeFileSync } from "node:fs";
import path from "node:path";
import { DEFAULT_CONTENT } from "../lib/seed.ts";

const out = path.join(process.cwd(), "data", "content.json");
writeFileSync(out, JSON.stringify(DEFAULT_CONTENT, null, 2), "utf-8");
console.log("Wrote", out);
