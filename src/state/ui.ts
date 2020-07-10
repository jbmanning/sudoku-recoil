import { atom, selector } from "recoil/dist";

class UIStore {
  private static keys = {
    _Title: "UIStore__Title",
    Title: "UIStore_Title",
  };

  private _appName = "Sudoku";
  private _title = atom<string>({
    key: UIStore.keys._Title,
    default: "",
  });

  title = selector<string>({
    key: UIStore.keys.Title,
    get: ({ get }) => {
      const title = get(this._title);
      if (!title) return this._appName;
      else return `${title} | ${this._appName}`;
    },
    set: ({ set }, newValue) => {
      set(this._title, newValue);
    },
  });
}

export const uiStore = new UIStore();
