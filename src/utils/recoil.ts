import {
  waitForAll,
  CallbackInterface as RecoilCallbackInterface,
  RecoilValue,
  useRecoilCallback,
} from "recoil/dist";

// https://github.com/facebookexperimental/Recoil/issues/231#issuecomment-643575622

export class StateManager {
  keys;
  tree: StateManager[];
  identifier;
  constructor(tree: StateManager[] | StateManager, instance: string | number) {
    const base = this;
    this.tree = Array.isArray(tree) ? tree : [tree];
    this.identifier = [base.constructor.name, instance].join(".");

    // const childIdentifier = [...base.tree.map((t) => t.identifier), base.identifier].join(
    //   "::"
    // );
    // console.log(childIdentifier);
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
  get: <T>(p: RecoilValue<T>) => T;
}

function addGetToCallbackInterface(p: RecoilCallbackInterface): MyCallbackInterface {
  return {
    ...p,
    get: <T>(inVal: RecoilValue<T>) => {
      const valLoadable = p.snapshot.getLoadable(inVal);
      if (valLoadable.state !== "hasValue") {
        console.log(valLoadable);
        // @ts-ignore
        console.log(valLoadable.errorMaybe());
        throw new Error(`callbackInterface: Invalid loadable state - [${valLoadable.state}]`);
      }
      return valLoadable.contents;
    },
  };
}

export type CallbackInterfaceGetter = () => MyCallbackInterface;

export function useCallbackInterface(): CallbackInterfaceGetter {
  return useRecoilCallback((p) => () => addGetToCallbackInterface(p));
}

export type RecoilAction<TArgs extends any[], TReturn> = (
  getCallbackInterface: CallbackInterfaceGetter,
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
  const getCallbackInterface = useCallbackInterface();
  return (...args) => fn(getCallbackInterface, ...args);
}
