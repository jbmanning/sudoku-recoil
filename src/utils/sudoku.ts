export function findCoveredUnions<T, G>(
  getUnionValue: (c: G) => T[],
  list: G[],
  union = new Set<T>(),
  covered: G[] = []
): [Set<T>, G[]] | [undefined, undefined] {
  if (union.size > 0 && union.size === covered.length) return [union, covered];
  else if (list.length === 0) return [undefined, undefined];
  else {
    for (let i = 1; i < list.length; i += 1) {
      const [u2, c2] = findCoveredUnions(
        getUnionValue,
        list.slice(i),
        new Set([...union, ...getUnionValue(list[i - 1])]),
        [...covered, list[i - 1]]
      );
      if (u2 && c2) return [u2, c2];
    }
    return [undefined, undefined];
  }
}
