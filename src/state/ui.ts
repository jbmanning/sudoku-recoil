import { action, computed, observable } from "mobx";
import { createContext } from "react";
import packageJson from "src/../package.json";

class UIStore {
  private _appName = "Sudoku";
  @observable private _title: string = "";

  @action setTitle(title: string) {
    if (!title) this._title = "";
    else this._title = title;
  }

  @computed get title() {
    if (!this._title) return this._appName;
    else return `${this._title} | ${this._appName}`;
  }
}

const uiStore = new UIStore();
export const UIContext = createContext(uiStore);
