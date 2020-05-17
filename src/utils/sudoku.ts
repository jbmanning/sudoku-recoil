export function findCoveredUnions<T, G>(
  getUnionValue: (c: G) => T[],
  list: G[],
  union = new Set<T>(),
  covered: G[] = []
): [Set<T>, G[]][] {
  if (union.size > 0 && union.size === covered.length) return [[union, covered]];
  else if (list.length === 0) return [];
  else {
    const out = [];
    for (let i = 1; i < list.length; i += 1) {
      const coveredUnions = findCoveredUnions(
        getUnionValue,
        list.slice(i),
        new Set([...union, ...getUnionValue(list[i - 1])]),
        [...covered, list[i - 1]]
      );
      out.push(...coveredUnions);
    }
    return out;
  }
}
