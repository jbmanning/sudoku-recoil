import * as fs from "fs";
import * as path from "path";
import { v4 as uuidv4 } from "uuid";

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

export const readBoardFile = (data: unknown): number[] => {
  if (Array.isArray(data)) {
    let out = JSON.parse(JSON.stringify(data));
    out = out.map((c: any) => parseInt(c, 10));

    if (Math.sqrt(Math.sqrt(out.length)) % 1 !== 0) {
      throw new Error(`Invalid board length: ${out.length}`);
    }
    return out;
  } else if (typeof data === "string") {
    let out = data.replace(/[\n ]/, "").replace(/[^0-9]/, "0");
    if (out.length !== 81) throw new Error(`Invalid board length: ${out.length}`);

    return Array.from(out).map((c) => parseInt(c, 10));
  } else {
    throw new Error(`Unknown file type: ${typeof data}`);
  }
};

export const range = (start: number, end?: number) =>
  end === undefined
    ? Array.from({ length: start }, (v, k) => k)
    : Array.from({ length: end - start }, (v, k) => k + start);

export function mapObject<TSource, TResult>(
  obj: { [key: string]: TSource },
  mapFn: (v: TSource, k: string) => TResult
): { [key: string]: TResult } {
  return Object.keys(obj).reduce<{ [key: string]: TResult }>(function (prev, key) {
    prev[key] = mapFn(obj[key], key);
    return prev;
  }, {});
}

export function slugify(string: string) {
  const a = "àáâäæãåāăąçćčđďèéêëēėęěğǵḧîïíīįìłḿñńǹňôöòóœøōõőṕŕřßśšşșťțûüùúūǘůűųẃẍÿýžźż·/_,:;";
  const b = "aaaaaaaaaacccddeeeeeeeegghiiiiiilmnnnnoooooooooprrsssssttuuuuuuuuuwxyyzzz------";
  const p = new RegExp(a.split("").join("|"), "g");

  return string
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(p, (c) => b.charAt(a.indexOf(c))) // Replace special characters
    .replace(/&/g, "-and-") // Replace & with 'and'
    .replace(/[^\w-]+/g, "") // Remove all non-word characters
    .replace(/--+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from start of text
    .replace(/-+$/, ""); // Trim - from end of text
}

export class StateManager {
  keys;
  tree: StateManager[];
  identifier;
  constructor(instance: string, tree: StateManager[] | StateManager) {
    const base = this;
    this.tree = Array.isArray(tree) ? tree : [tree];
    this.identifier = [base.constructor.name, slugify(instance)].filter((c) => c).join(".");

    const childIdentifier = [...base.tree.map((t) => t.identifier), base.identifier].join(
      "::"
    );
    console.log(childIdentifier);
    this.keys = new Proxy<{ [key: string]: string }>(
      {},
      {
        get(obj, prop, value) {
          return [...base.tree.map((t) => t.identifier), base.identifier, prop].join("::");
        },
      }
    );
  }
}

export const uuid = uuidv4;
