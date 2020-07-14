import { atom, CallbackInterface, selector } from "recoil/dist";
import { StateManager } from "src/utils";

type IModal = {
  name: string;
};

class ModalManager extends StateManager {
  stack = atom<IModal[]>({
    key: this.keys.Stack,
    default: [],
  });

  pushModal = ({ snapshot: { getLoadable }, set }: CallbackInterface) => (m: IModal) => {
    const stackLoadable = getLoadable(this.stack);
    if (stackLoadable.state !== "hasValue") throw new Error("pushModal: Invalid state");
    const stack = stackLoadable.contents;
    set(this.stack, [...stack, m]);
  };
}

class UIStore extends StateManager {
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

  modalManager = new ModalManager("root", this);
}

export const uiStore = new UIStore("root", []);
