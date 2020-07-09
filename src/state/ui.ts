import { action, computed, observable } from "mobx";
import { createContext } from "react";
import packageJson from "src/../package.json";
import { atom, RecoilState, selector } from "recoil/dist";

enum UIStoreKeys {
  _Title = "UIStore__Title",
  Title = "UIStore_Title",
}

class UIStore {
  private _appName = packageJson.name;
  private _title = atom<string | null>({
    key: UIStoreKeys._Title,
    default: null,
  });

  title = selector<string>({
    key: UIStoreKeys.Title,
    get: ({ get }) => {
      const title = get(this._title);
      if (title === null) return this._appName;
      else return `${title} | ${this._appName}`;
    },
    set: ({ set, get }, newValue) => {
      let title: string | null = typeof newValue === "string" ? newValue : null;
      if (newValue === "") title = null;
      set(this._title, title);
    },
  });
}

export const uiStore = new UIStore();
