import copy from "copy-to-clipboard";
import * as fs from "fs";
import { createContext } from "react";
import { action, computed, observable, when } from "mobx";
import { clearLine } from "readline";
import * as rawGameData from "src/__data";
import { readBoardFile } from "src/utils";
import { findCoveredUnions } from "src/utils/sudoku";

const POSSIBLE_VALUES = [1, 2, 3, 4, 5, 6, 7, 8, 9];

export class Cell {
  @observable readonly game: SudokuStore;
  @observable readonly i: number;
  @observable private _value: number | undefined;
  @observable readonly isStatic: boolean;
  @observable groups: Group[] = [];
  @observable notPossibleValues: Set<number> = new Set();
  constructor(game: SudokuStore, value: number, i: number) {
    this.game = game;
    this.i = i;
    if (value === 0) {
      this.value = undefined;
      this.isStatic = false;
    } else {
      this.value = value;
      this.isStatic = true;
    }
  }

  get value() {
    return this._value;
  }
  set value(v: number | undefined) {
    if (this.isStatic) throw new Error("Can not set value of static cell.");
    else {
      this.game.hasUserInput = true;
      if (v === 0) this._value = undefined;
      else this._value = v;
    }
  }
  @action addGroup(group: Group) {
    this.groups.push(group);
  }
  @action addNotPossibleNumbers(...nums: number[]) {
    if (this.isStatic) return false;
    let modified = false;
    for (const n of nums) {
      if (!this.notPossibleValues.has(n) && this.availableNumbers.includes(n)) {
        this.notPossibleValues.add(n);
        modified = true;
      }
    }
    return modified;
  }
  @action reset() {
    if (!this.isStatic) {
      this.value = undefined;
      this.notPossibleValues = new Set();
    }
  }

  /*
        Every group must have that number available
   */
  @computed get availableNumbers() {
    if (this.value !== undefined) return [];
    return POSSIBLE_VALUES.filter(
      (possible) =>
        !this.notPossibleValues.has(possible) &&
        this.groups.every((g) => g.availableNumbers.includes(possible))
    );
  }

  /*
        For every group, every cell within that group can not equal this.value
   */
  @computed get isValid() {
    return (
      this.value === undefined ||
      this.groups.every((g) => g.cells.every((c) => c === this || c.value !== this.value))
    );
  }
}

export class Group {
  @observable game: SudokuStore;
  @observable type: string;

  @observable cells: Cell[];
  constructor(game: SudokuStore, type: string, cells: Cell[]) {
    this.type = type;
    this.game = game;
    if (cells.length !== 9) console.warn(`Invalid group size, should be 9... ${type}`);
    this.cells = cells;
  }

  @computed get availableNumbers() {
    return POSSIBLE_VALUES.filter((possible) => this.cells.every((c) => c.value !== possible));
  }
  @computed get mappedCells() {
    let cells = this.cells.filter((c) => !c.value);

    let mappedAvailable = cells.reduce<{ [key: number]: Cell[] }>((prev, curr) => {
      for (const avail of curr.availableNumbers) {
        if (!prev[avail]) prev[avail] = [];
        prev[avail].push(curr);
      }
      return prev;
    }, {});
    let mappedCells = Object.entries(mappedAvailable).map(([n, matching]) => ({
      // Since dictionaries transform keys to strings
      n: parseInt(n, 10),
      matching,
    }));
    mappedCells.sort((a, b) => a.matching.length - b.matching.length);

    return mappedCells;
  }
}

export class SudokuStore {
  @observable name: string;
  @observable hasUserInput: boolean = false;
  @observable actions: string[] = [];
  @observable board: Cell[] = new Array(81);
  @observable rows: Group[] = new Array(9);
  @observable cols: Group[] = new Array(9);
  @observable boxes: Group[] = new Array(9);

  constructor(name: string, initial: number[]) {
    this.name = name;
    if (initial.length !== 81) {
      console.warn("Invalid board size, should be 9x9");
    }

    for (let i = 0; i < initial.length; i += 1) {
      this.board[i] = new Cell(this, initial[i], i);
    }

    for (let i = 0; i < 9; i += 1) {
      const colCells = this.board.filter((cell, j) => j % 9 === i);
      this.cols[i] = new Group(this, "column", colCells);
      colCells.forEach((c) => c.addGroup(this.cols[i]));

      const rowCells = this.board.slice(i * 9, i * 9 + 9);
      this.rows[i] = new Group(this, "row", rowCells);
      rowCells.forEach((c) => c.addGroup(this.rows[i]));
    }

    let boxN = 0;
    for (let i = 0; i < 3; i += 1) {
      for (let j = 0; j < 3; j += 1) {
        let topLeftY = i * 3;
        let topLeftX = j * 3;

        const cells = [];
        for (let boxY = topLeftY; boxY < topLeftY + 3; boxY += 1) {
          for (let boxX = topLeftX; boxX < topLeftX + 3; boxX += 1) {
            cells.push(this.board[boxY * 9 + boxX]);
          }
        }

        const box = new Group(this, "box", cells);
        this.boxes[boxN] = box;
        cells.forEach((c) => c.addGroup(box));
        boxN += 1;
      }
    }
  }

  @computed get groups() {
    return [...this.boxes, ...this.cols, ...this.rows];
  }

  @computed get isSolved() {
    return this.board.every((c) => c.value && c.isValid);
  }

  @computed get isValid() {
    return this.board.every((c) => c.isValid);
  }

  @action solvedSquare(): boolean {
    for (const c of this.board) {
      if (c.availableNumbers.length === 1) {
        c.value = c.availableNumbers[0];
        return true;
      }
    }
    return false;
  }

  @action hiddenSingle(): boolean {
    for (const g of this.groups) {
      for (const possible of POSSIBLE_VALUES) {
        const possibleCells = g.cells.filter((c) => c.availableNumbers.includes(possible));
        if (possibleCells.length === 1) {
          possibleCells[0].value = possible;
          return true;
        }
      }
    }
    return false;
  }

  @action nakedSets(): boolean {
    for (const g of this.groups) {
      let cells = g.cells.filter((c) => !c.value);
      cells.sort((a, b) => a.availableNumbers.length - b.availableNumbers.length);

      const coveredUnions = findCoveredUnions((c) => c.availableNumbers, cells);
      for (const [union, covered] of coveredUnions) {
        let performedAction = false;
        for (const c of cells) {
          if (!covered.includes(c)) {
            if (c.addNotPossibleNumbers(...union)) {
              performedAction = true;
            }
          }
        }
        if (performedAction) return performedAction;
      }
    }
    return false;
  }

  @action hiddenSets(): boolean {
    for (const g of this.groups) {
      const coveredUnions = findCoveredUnions((cl) => cl.matching, g.mappedCells);
      for (const [union, covered] of coveredUnions) {
        const removals = POSSIBLE_VALUES.filter((p) => !covered.find((cov) => cov.n === p));
        let performedAction = false;
        for (const c of union) {
          if (c.addNotPossibleNumbers(...removals)) {
            performedAction = true;
          }
        }
        if (performedAction) return performedAction;
      }
    }
    return false;
  }

  @action pointingPairs(): boolean {
    for (const g of this.groups) {
      for (const mc of g.mappedCells) {
        const matchingGroups = mc.matching[0].groups.filter(
          (mcg) => mcg !== g && mc.matching.every((mcc) => mcc.groups.includes(mcg))
        );
        if (matchingGroups.length > 0) {
          for (const mcg of matchingGroups) {
            let cells = mcg.cells.filter((c) => !c.value && !mc.matching.includes(c));
            let performedAction = false;
            for (const c of cells) {
              if (c.addNotPossibleNumbers(mc.n)) {
                performedAction = true;
              }
            }
            if (performedAction) return true;
          }
        }
      }
    }
    return false;
  }

  @action xWing(): boolean {
    return false;
  }

  @action stepSolveGame(): boolean {
    return false;
  }

  @action solveGame() {
    while (!this.isSolved) {
      // Solved square
      if (this.solvedSquare()) continue;

      // Hidden singles
      if (this.hiddenSingle()) continue;

      // Naked pairs/triples/quads
      if (this.nakedSets()) continue;

      // Hidden pairs/triples
      if (this.hiddenSets()) continue;

      // Pointing pairs
      if (this.pointingPairs()) continue;

      // X-Wing
      if (this.xWing()) continue;

      break;
    }
  }

  copyToClipboard() {
    copy(this.board.map((c) => c.value || 0).join(""));
  }

  @action resetToStart() {
    this.board.forEach((c) => {
      c.reset();
    });
  }
}

class GameStore {
  @observable currentGame?: SudokuStore;
  constructor() {
    const game = this.knownGames.find((kg) => kg.name === "pointingPairs");
    if (game) this.startGame(game.name, game.val);
  }

  @action startGame(name: string, data: number[]) {
    this.currentGame = new SudokuStore(name, data);
    this.currentGame.solveGame();
  }

  @computed get knownGames() {
    return Object.entries(rawGameData).map(([k, v]) => ({ name: k, val: readBoardFile(v) }));
  }
}

const gameStore = new GameStore();

export const GameContext = createContext(gameStore);
