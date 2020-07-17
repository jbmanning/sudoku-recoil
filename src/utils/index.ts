import { v4 as uuidv4 } from "uuid";
import { RecoilValue } from "recoil";
import { default as lodashDeepclone } from "lodash.clonedeep";

export const exists = (e: any | unknown): boolean => e !== null && e !== undefined && e !== "";
export const deepclone = lodashDeepclone;

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

export const readBoardFile = (rawData: unknown): number[] => {
  let arrData;
  if (Array.isArray(rawData)) {
    arrData = deepclone(rawData);
  } else if (typeof rawData === "string") {
    let strData = rawData.replace(/[\n ]/, "").replace(/[^0-9]/, "0");
    arrData = Array.from(strData);
  } else {
    throw new Error(`Unknown file type: ${typeof rawData}`);
  }

  const out = arrData.map<number>((c: any) => parseInt(c, 10));

  if (Math.sqrt(Math.sqrt(out.length)) % 1 !== 0) {
    throw new Error(`Invalid board length: ${out.length}`);
  }

  return out;
};

export const range = (start: number, end?: number) =>
  end === undefined
    ? Array.from({ length: start }, (v, k) => k)
    : Array.from({ length: end - start }, (v, k) => k + start);

export function objectMap<TSource, TResult>(
  obj: { [key: string]: TSource },
  mapFn: (v: TSource, k: string) => TResult
): { [key: string]: TResult } {
  return Object.keys(obj).reduce<{ [key: string]: TResult }>(function (prev, key) {
    prev[key] = mapFn(obj[key], key);
    return prev;
  }, {});
}

export function objectFilter<TSource>(
  obj: { [key: string]: TSource },
  filterFn: (v: TSource, k: string) => boolean
): { [key: string]: TSource } {
  return Object.keys(obj).reduce<{ [key: string]: TSource }>(function (prev, key) {
    if (filterFn(obj[key], key)) prev[key] = obj[key];
    return prev;
  }, {});
}

export const arraysLooslyEqual = <T>(a: T[], b: T[]) =>
  a.length === b.length && a.every((e) => b.includes(e));

export const arraysExactlyEqual = <T>(a: T[], b: T[]) =>
  a.length === b.length && a.every((e, i) => b[i] === e);

export const flattenArray = (args: any[]): any[] =>
  args.reduce((prev, curr) => [...prev, ...(Array.isArray(curr) ? curr : [curr])], []);

export function slugify(string: string | number) {
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

export const uuid = uuidv4;
