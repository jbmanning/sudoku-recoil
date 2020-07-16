import {
  CallbackInterface,
  CallbackInterface as RecoilCallbackInterface,
  RecoilValue,
  useRecoilCallback,
} from "recoil";
import { slugify } from "src/utils/index";

// https://github.com/facebookexperimental/Recoil/issues/231#issuecomment-643575622

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

interface MyCallbackInterface extends RecoilCallbackInterface {
  readonly get: <T>(p: RecoilValue<T>) => T;
}

function addGetToCallbackInterface(p: CallbackInterface): MyCallbackInterface {
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

export type RecoilCallbackGetter = () => MyCallbackInterface;

export function useRecoilCallbackProps(): RecoilCallbackGetter {
  return useRecoilCallback((p) => () => addGetToCallbackInterface(p));
}

export type RecoilAction<TArgs extends any[], TReturn> = (
  getCallbackInterface: RecoilCallbackGetter,
  ...args: TArgs
) => TReturn;

type ExtractTArgs<T extends RecoilAction<any, any>> = T extends RecoilAction<infer TArgs, any>
  ? TArgs
  : never;

type ExtractTReturn<T extends RecoilAction<any, any>> = T extends RecoilAction<
  any,
  infer TReturn
>
  ? TReturn
  : never;

export function useRecoilAction<T extends RecoilAction<any[], any>>(
  fn: T
): (...usrArgs: ExtractTArgs<T>) => ExtractTReturn<T> {
  const getCallbackInterface = useRecoilCallbackProps();
  return (...args) => fn(getCallbackInterface, ...args);
}
