import { action, computed, observable } from "mobx";
import { createContext } from "react";
import packageJson from "src/../package.json";

class UIStore {
  private _appName = packageJson.name;
  @observable private _title: string | null = null;

  @action setTitle(title: string | null) {
    if (title === "") title = null;
    this._title = title;
  }

  @computed get title() {
    if (this._title === null) return this._appName;
    else return `${this._title} | ${this._appName}`;
  }
}

const uiStore = new UIStore();
export const UIContext = createContext(uiStore);
