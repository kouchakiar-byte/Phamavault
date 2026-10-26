// Chapter order. --preview builds only the first chapters.
const all = ["ch00", "ch01", "ch02", "ch03", "ch04", "ch05", "ch06", "ch07", "ch08", "ch09", "ch10", "appA", "appB", "appC", "appD"];
const preview = ["ch00", "ch01", "ch02"];
import { existsSync } from "node:fs";
export default (only) => (only ? preview : all).filter((f) => existsSync(new URL(`./ch/${f}.mjs`, import.meta.url)));
