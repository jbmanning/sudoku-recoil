// https://github.com/facebookexperimental/Recoil/issues/231#issuecomment-643575622

import {
  atom,
  atomFamily,
  AtomOptions,
  CallbackInterface as RecoilCallbackInterface,
  DefaultValue,
  RecoilState,
  RecoilValue,
  selectorFamily,
  SerializableParam,
  useRecoilCallback,
} from "recoil/dist";

/*type EvaluatingAtomOptions<T, StoredType, P> = AtomOptions<StoredType> & {
  key: string;
  get: () => (t: T, s: P) => P;
  set: () => (t: T, s: P) => P;
};

export function evaluatingAtom<T, StoredType, P extends SerializableParam>({
  get = () => (_, value) => value,
  set = () => (_, value) => value,
  // cacheImplementation_UNSTABLE: cacheImplementation,
  ...opt
}: EvaluatingAtomOptions<T, StoredType, P>): (n: P) => RecoilState<T> {
  const myAtom = atom<StoredType>(opt);
  const mySelector = selectorFamily<T, P>({
    key: `${opt.key}__evaluation`,
    get: (evaluationParams) => ({ get: getRecoilValue }) =>
      get(evaluationParams)({ get: getRecoilValue }, getRecoilValue(myAtom)),
    set: (evaluationParams) => ({ set: setRecoilValue, get: getRecoilValue }, newValue) =>
      setRecoilValue<StoredType>(
        myAtom,
        newValue instanceof DefaultValue
          ? newValue
          : (oldValue) => set(evaluationParams)({ get: getRecoilValue }, newValue, oldValue)
      ),
    // cacheImplementation_UNSTABLE: cacheImplementation && (() => cacheImplementation),
    dangerouslyAllowMutability: opt.dangerouslyAllowMutability,
  });
  return (evaluationParams) => mySelector(evaluationParams);
}*/

type GetRecoilValue = <T>(recoilVal: RecoilValue<T>) => T;

type EvaluatingAtomFamilyOptions<
  T,
  StoredType,
  ScopeParameter extends SerializableParam,
  EvaluationParameter extends SerializableParam
> = AtomOptions<StoredType> & {
  get: (
    _: ScopeParameter,
    value: EvaluationParameter
  ) => (d: { get: GetRecoilValue }, s: StoredType) => T;
  set: (
    _: ScopeParameter,
    value: EvaluationParameter
  ) => (d: { get: GetRecoilValue }, t: T, st: StoredType) => T;
};

export function evaluatingAtomFamily<
  T,
  StoredType,
  ScopeParameter extends SerializableParam,
  EvaluationParameter extends SerializableParam
>({
  get,
  set,
  // cacheImplementationForEvaluation_UNSTABLE: cacheImplementationForEvaluation,
  ...options
}: EvaluatingAtomFamilyOptions<T, StoredType, ScopeParameter, EvaluationParameter>): (
  scopeParam: ScopeParameter,
  evalParam: EvaluationParameter
) => RecoilState<T> {
  const baseAtom: (s: ScopeParameter) => RecoilState<StoredType> = atomFamily(options);

  // If there are get/set accessors associated with this atomFamily,
  // then construct a wrapping selector to perform those evaluations whenever
  // the atom is read or written.
  const evaluationSelector = selectorFamily<
    T,
    { scopeParam: ScopeParameter; evalParam: EvaluationParameter }
  >({
    key: `${options.key}__evaluation`,
    get: ({ scopeParam, evalParam }) => ({ get: getRecoilValue }) =>
      get(scopeParam, evalParam)(
        { get: getRecoilValue },
        getRecoilValue(baseAtom(scopeParam))
      ),
    set: ({ evalParam, scopeParam }) => (
      { set: setRecoilValue, get: getRecoilValue },
      newValue
    ) =>
      setRecoilValue(
        baseAtom(scopeParam),
        newValue instanceof DefaultValue
          ? newValue
          : (oldValue) =>
              set(scopeParam, evalParam)({ get: getRecoilValue }, newValue, oldValue)
      ),
    // cacheImplementation_UNSTABLE: cacheImplementationForEvaluation,
  });

  return (scopeParam, evalParam) => evaluationSelector({ scopeParam, evalParam });
}

export interface MyCallbackInterface extends RecoilCallbackInterface {
  get: <T>(p: RecoilValue<T>) => T;
}

function addGetToCallbackInterface(p: MyCallbackInterface): MyCallbackInterface {
  return {
    ...p,
    get: <T>(inVal: RecoilValue<T>) => {
      const valLoadable = p.snapshot.getLoadable(inVal);
      if (valLoadable.state !== "hasValue")
        throw new Error("callbackInterface: Invalid loadable state");
      return valLoadable.contents;
    },
  };
}

export function useRecoilAction<T extends Function>(fn: (p: MyCallbackInterface) => T): T {
  // @ts-ignore
  return useRecoilCallback((p) => fn(addGetToCallbackInterface(p)));
}
