import { atom, selector } from "recoil";
import { StateManager, RecoilAction, CallbackInterfaceGetter } from "src/utils/recoil";
import { ModalType } from "src/components/modalManager";

export type IModal = {
  type: ModalType;
  title?: string;
  message: string;
  actions: { text: string; cb: RecoilAction<void[], void>; classNames?: string }[];
};

class ModalManager extends StateManager {
  stack = atom<IModal[]>({
    key: this.keys.Stack,
    default: [],
  });

  openModal = (getCallbackInterface: CallbackInterfaceGetter, m: IModal) => {
    const { get, set } = getCallbackInterface();
    const stack = get(this.stack);
    if (stack.includes(m)) {
      console.error("pushModal: Attempted to push duplicate modal to stack, exiting.");
    } else set(this.stack, [...stack, m]);
  };

  closeModal = (getCallbackInterface: CallbackInterfaceGetter, m: IModal) => {
    const { get, set } = getCallbackInterface();
    const stack = get(this.stack);
    const si = stack.findIndex((e) => e === m);
    if (si === -1) console.error("Did not find modal...");
    else
      set(
        this.stack,
        stack.filter((e) => e !== m)
      );
  };
}

export class UIStore extends StateManager {
  private _appName = "Sudoku";
  private _title = atom<string>({
    key: this.keys._Title,
    default: "",
  });

  title = selector<string>({
    key: this.keys.Title,
    get: ({ get }) => {
      const title = get(this._title);
      if (!title) return this._appName;
      else return `${title} | ${this._appName}`;
    },
    set: ({ set }, newValue) => {
      set(this._title, newValue);
    },
  });

  modalManager = new ModalManager(this, "root");
}

export const uiStore = new UIStore([], "root");
