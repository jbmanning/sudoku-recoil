import * as fs from "fs";
import * as path from "path";

export const exists = (e: any | unknown): boolean => e !== null && e !== undefined && e !== "";
export { default as deepclone } from "lodash.clonedeep";

export const gcn = (...classNames: (string | undefined | null | false)[]) =>
  classNames.filter((cn) => !!cn).join(" ");

export const getEnumEntries = (inp: { [k: string]: string | number }) => {
  const entries: any = {};
  for (const [k, v] of Object.entries(inp)) {
    if (isNaN(k as any)) entries[v] = k;
  }

  const sorted = Object.keys(entries).sort();

  return sorted.map((s) => [entries[s], s]);
};

export const readBoardFile = (data: any): number[] => {
  if (Array.isArray(data)) {
    let out = JSON.parse(JSON.stringify(data));
    if (data.length === 9) {
      out = out.reduce((prev: number[], curr: number[]) => {
        prev.push(...curr);
        return prev;
      }, []);
    }

    if (out.length !== 81) throw new Error(`Invalid board length: ${out.length}`);
    return out;
  } else if (typeof data === "string") {
    let out = data.replace(/[\n ]/, "").replace(/[^0-9]/, "0");
    if (out.length !== 81) throw new Error(`Invalid board length: ${out.length}`);

    return Array.from(out).map((c) => parseInt(c, 10));
  } else {
    throw new Error(`Unknown file type: ${typeof data}`);
  }
};
