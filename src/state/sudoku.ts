import rawGameData from "src/__data";
import {
  arraysExactlyEqual,
  flattenArray,
  objectFilter,
  objectMap,
  range,
  readBoardFile,
} from "src/utils";
import { atom, selector, waitForAll } from "recoil/dist";
import { UIStore, uiStore as rootUIStore } from "src/state/ui";
import { ModalType } from "src/components/modalManager";
import { CallbackInterfaceGetter, StateManager } from "src/utils/recoil";
import copy from "copy-to-clipboard";

/*export class Cell {

  /!*
        For every group, every cell within that group can not equal this.value
   *!/
  @computed get isValid() {
    return (
      this.value === undefined ||
      this.groups.every((g) => g.cells.every((c) => c === this || c.value !== this.value))
    );
  }

  @computed get rowNumber() {
    return Math.floor(this.index / this._game.size);
  }

  @computed get rowName() {
    return String.fromCharCode(65 + this.rowNumber);
  }

  @computed get colNumber() {
    return this.index % this._game.size;
  }

  @computed get colName() {
    return `${this.colNumber + 1}`;
  }
}

export class Group {
  @observable private readonly _game: Game;
  @observable type: string;
  @observable cells: Cell[];

  constructor(game: Game, type: string, cells: Cell[]) {
    this.type = type;
    this._game = game;
    if (cells.length !== 9) console.warn(`Invalid group size, should be 9... ${type}`);
    this.cells = cells;
  }

  @computed get availableNumbers() {
    return this._game.possibleValues.filter((possible) =>
      this.cells.every((c) => c.value !== possible)
    );
  }

  @computed get possibleToCellsMap() {
    let cells = this.cells.filter((c) => !c.value);

    let possibleToCellsMap = cells.reduce<{ [key: number]: Cell[] }>((prev, curr) => {
      for (const avail of curr.availableNumbers) {
        if (!prev[avail]) prev[avail] = [];
        prev[avail].push(curr);
      }
      return prev;
    }, {});

    return possibleToCellsMap;
  }

  @computed get possibleToCellsArray() {
    let possibleToCellsArray = Object.entries(this.possibleToCellsMap).map(
      ([n, matching]) => ({
        // Since dictionaries transform keys to strings
        n: parseInt(n, 10),
        matching,
      })
    );
    possibleToCellsArray.sort((a, b) => a.matching.length - b.matching.length);

    return possibleToCellsArray;
  }
}

export class Game {
  @observable name: string;
  @observable readonly: boolean;
  @observable actions: string[] = [];
  @observable cells: Cell[] = new Array(81);

  @computed get size() {
    return Math.sqrt(this.cells.length);
  }

  @computed get squareSize() {
    return Math.sqrt(this.size);
  }

  @computed get possibleValues() {
    return range(1, this.size + 1);
  }

  @computed get groups() {
    return [...this.boxes, ...this.cols, ...this.rows];
  }

  @computed get isSolved() {
    return this.cells.every((c) => c.value && c.isValid);
  }

  @computed get isValid() {
    return this.isPossible && this.cells.every((c) => c.isValid);
  }

  @computed get isPossible() {
    return this.cells.every((c) => c.value || c.availableNumbers.length > 0);
  }

  @computed get isValidGame() {
    return this.size % 1 === 0;
  }

  @computed get isEmptyGame() {
    return this.cells.filter((c) => c.value !== undefined).length === 0;
  }

  @action

  @action hiddenSingle(): boolean {
    for (const origGroup of this.groups) {
      for (const possible of this.possibleValues) {
        const possibleCells = origGroup.cells.filter((c) =>
          c.availableNumbers.includes(possible)
        );
        if (possibleCells.length === 1) {
          possibleCells[0].setValue(possible, ValueSource.ComputerSolved);
          return true;
        }
      }
    }
    return false;
  }

  @action nakedSets(): boolean {
    for (const origGroup of this.groups) {
      let cells = origGroup.cells.filter((c) => !c.value);
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
    for (const origGroup of this.groups) {
      const coveredUnions = findCoveredUnions(
        (cl) => cl.matching,
        origGroup.possibleToCellsArray
      );
      for (const [union, covered] of coveredUnions) {
        const removals = this.possibleValues.filter(
          (p) => !covered.find((cov) => cov.n === p)
        );
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
    for (const origGroup of this.groups) {
      for (const mc of origGroup.possibleToCellsArray) {
        const matchingGroups = mc.matching[0].groups.filter(
          (mcg) => mcg !== origGroup && mc.matching.every((mcc) => mcc.groups.includes(mcg))
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
    for (const origPossible of this.possibleValues) {
      const candidates = this.groups.filter(
        (g) => g.possibleToCellsMap[origPossible]?.length === 2
      );

      if (candidates.length >= 2) {
        const typeToCandidatesMap = candidates.reduce<{ [key: string]: Group[] }>(
          (prev, curr) => {
            if (!prev[curr.type]) prev[curr.type] = [];
            prev[curr.type].push(curr);
            return prev;
          },
          {}
        );
        for (const [type, candidateList] of Object.entries(typeToCandidatesMap)) {
          if (candidateList.length >= 2) {
            for (let i = 0; i < candidateList.length; i += 1) {
              const groupCandidateI = candidateList[i];
              const candidateIPossibleCells = groupCandidateI.possibleToCellsMap[origPossible];

              for (let j = i + 1; j < candidateList.length; j += 1) {
                const groupCandidateJ = candidateList[j];
                const candidateJPossibleCells =
                  groupCandidateJ.possibleToCellsMap[origPossible];

                let zeroMatchIndex: number | undefined;
                let zeroMatch: Group | undefined;
                for (let matchIndex = 0; matchIndex < 2; matchIndex += 1) {
                  const match = candidateIPossibleCells[0].groups.find(
                    (g) =>
                      g !== groupCandidateI &&
                      g !== groupCandidateJ &&
                      g.type !== type &&
                      candidateJPossibleCells[matchIndex].groups.includes(g)
                  );

                  if (match) {
                    zeroMatchIndex = matchIndex;
                    zeroMatch = match;
                    break;
                  }
                }

                if (!exists(zeroMatch) || !exists(zeroMatchIndex)) continue;
                const oneMatch = candidateIPossibleCells[1].groups.find(
                  (g) =>
                    g !== groupCandidateI &&
                    g !== groupCandidateJ &&
                    g.type !== type &&
                    candidateJPossibleCells[zeroMatchIndex === 0 ? 1 : 0].groups.includes(g)
                );
                if (zeroMatch && oneMatch) {
                  const matchedCells = [...zeroMatch.cells, ...oneMatch.cells];
                  let performedAction;
                  for (const c of matchedCells) {
                    if (
                      !groupCandidateI.cells.includes(c) &&
                      !groupCandidateJ.cells.includes(c) &&
                      c.availableNumbers.includes(origPossible)
                    ) {
                      if (c.addNotPossibleNumbers(origPossible)) {
                        performedAction = true;
                      }
                    }
                  }

                  if (performedAction) return true;
                }
              }
            }
          }
        }
      }
    }
    return false;
  }

  @action yWing(): boolean {
    const openCells = this.cells.filter((c) => !c.value);
    for (const abCell of openCells) {
      if (abCell.availableNumbers.length === 2) {
        for (const bcGroup of abCell.groups) {
          const bcPossibles = bcGroup.cells.filter(
            (c) =>
              c !== abCell &&
              c.availableNumbers.length === 2 &&
              abCell.groups.filter((g) => c.groups.includes(g)).length === 1
          );

          for (const bcCell of bcPossibles) {
            let abbcIntersection = abCell.availableNumbers.filter((c) =>
              bcCell.availableNumbers.includes(c)
            );
            if (abbcIntersection.length !== 1) continue;
            let bCandidate = abbcIntersection[0];
            let aCandidate = abCell.availableNumbers.find((c) => c !== bCandidate) ?? -1;
            let cCandidate = bcCell.availableNumbers.find((c) => c !== bCandidate) ?? -1;
            if (aCandidate === -1) throw new Error("A undefined in yWing");
            if (cCandidate === -1) throw new Error("C undefined in yWing");

            for (const acGroup of abCell.groups.filter((g) => g !== bcGroup)) {
              const acPossibles = acGroup.cells.filter(
                (c) =>
                  c !== abCell &&
                  c.availableNumbers.length === 2 &&
                  abCell.groups.filter((g) => c.groups.includes(g)).length === 1 &&
                  c.availableNumbers.includes(aCandidate) &&
                  c.availableNumbers.includes(cCandidate)
              );

              for (const acCell of acPossibles) {
                const cGroups = [...acCell.groups, ...abCell.groups].filter(
                  (g) => g !== acGroup && g !== bcGroup && !abCell.groups.includes(g)
                );
                for (const cGroup of cGroups) {
                  for (const cCell of cGroup.cells) {
                    if (
                      cCell.availableNumbers.includes(cCandidate) &&
                      acCell.groups.find((abCellGroup) => abCellGroup.cells.includes(cCell)) &&
                      bcCell.groups.find((bcCellGroup) => bcCellGroup.cells.includes(cCell))
                    ) {
                      cCell.addNotPossibleNumbers(cCandidate);
                      return true;
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    return false;
  }

  @action swordfish(): boolean {
    return false;
  }

*/

export enum ValueSource {
  InitialGame,
  ComputerSolved,
  UserEntry,
}

export type IReadonlyGame = Readonly<{
  cells: Cell[];
  size: number;
  squareSize: number;
  isValidGame: boolean;
  isEmptyGame: boolean;
  isPossible: boolean;
  isValid: boolean;
  isSolved: boolean;
}>;

export type IReadonlyCell = Readonly<{
  colNumber: number;
  rowNumber: number;
  colName: string;
  rowName: string;
  groups: Group[];
  index: number;
  value: number | undefined;
  source: ValueSource | undefined;
  availableNumbers: number[];
  isValid: boolean;
}>;

export class Cell extends StateManager {
  private _game;
  readonly colNumber;
  readonly rowNumber;
  readonly colName;
  readonly rowName;
  readonly index;

  groups: Group[] = [];
  private readonly _blockedNumbers;
  readonly source;
  readonly value;
  readonly availableNumbers;
  readonly isValid;
  readonly readonlyCell;
  constructor(game: Game, index: number, value: number | undefined) {
    super([...game.tree, game], index);
    this._game = game;
    this.index = index;
    this.colNumber = this.index % game.size;
    this.colName = `${this.colNumber + 1}`;
    this.rowNumber = Math.floor(this.index / game.size);
    this.rowName = String.fromCharCode(65 + this.rowNumber);

    if (value !== undefined && (value < 1 || value > game.size)) {
      console.log("JSON");
      console.log([value]);
      throw new Error("Invalid starting value");
    }
    this.value = atom<number | undefined>({
      key: this.keys.Value,
      default: value,
    });

    this.source = atom<ValueSource | undefined>({
      key: this.keys.Source,
      default: value !== undefined ? ValueSource.InitialGame : undefined,
    });

    this._blockedNumbers = atom<Set<number>>({
      key: this.keys._blockedNumbers,
      default: new Set(),
    });

    this.availableNumbers = selector<number[]>({
      key: this.keys.availableNumbers,
      get: ({ get }) => {
        if (get(this.value) !== undefined) return [];
        return this._game.possibleValues.filter(
          (possible) =>
            !get(this._blockedNumbers).has(possible) &&
            this.groups.every((g) => get(g.availableNumbers).includes(possible))
        );
      },
    });

    this.isValid = selector<boolean>({
      key: this.keys.IsValid,
      get: ({ get }) =>
        get(this.value) === undefined ||
        this.groups.every((g) =>
          g.cells.every((c) => c === this || get(c.value) !== get(this.value))
        ),
    });

    this.readonlyCell = selector<IReadonlyCell>({
      key: this.keys.ReadonlyCell,
      get: ({ get }) => ({
        colNumber: this.colNumber,
        rowNumber: this.rowNumber,
        colName: this.colName,
        rowName: this.rowName,
        groups: this.groups,
        index: this.index,
        value: get(this.value),
        source: get(this.source),
        availableNumbers: get(this.availableNumbers),
        isValid: get(this.isValid),
      }),
    });
  }

  addGroup = (group: Group) => {
    this.groups.push(group);
  };

  setValue(
    gci: CallbackInterfaceGetter,
    newValue: number | undefined,
    newSource: ValueSource
  ): boolean {
    const { get, set } = gci();

    const source = get(this.source);
    if (source === ValueSource.InitialGame) {
      throw new Error("Can not set value of static cell.");
    } else {
      if (newValue === 0 || newValue === undefined) {
        set(this.value, undefined);
        set(this.source, undefined);
      } else {
        set(this.value, newValue);
        set(this.source, newSource);
      }
    }
    return true;
  }

  reset(gci: CallbackInterfaceGetter) {
    const { get, set } = gci();
    const source = get(this.source);
    if (source !== ValueSource.InitialGame) {
      this.setValue(gci, undefined, ValueSource.ComputerSolved);
      const blockedNumbers = get(this._blockedNumbers);
      blockedNumbers.clear();
      set(this._blockedNumbers, blockedNumbers);
    }
  }

  addNotPossibleNumbers(gci: CallbackInterfaceGetter, ...nums: number[]): boolean {
    const { get, set } = gci();
    if (this.value !== undefined) return false;
    let modified = false;
    const blockedNumbers = get(this._blockedNumbers);
    const availableNumbers = get(this.availableNumbers);
    for (const n of nums) {
      if (!blockedNumbers.has(n) && availableNumbers.includes(n)) {
        blockedNumbers.add(n);
        modified = true;
      }
    }
    set(this._blockedNumbers, blockedNumbers);
    return modified;
  }
}

export class Group extends StateManager {
  private _game;
  readonly cells;

  availableNumbers;
  constructor(tree: StateManager[], game: Game, type: string, index: number, cells: Cell[]) {
    super(tree, `${type}_${index}`);
    this._game = game;
    this.cells = cells;

    this.availableNumbers = selector<number[]>({
      key: this.keys.availableNumbers,
      get: ({ get }) => {
        return this._game.possibleValues.filter((possible) =>
          this.cells.every((c) => get(c.value) !== possible)
        );
      },
    });
  }
}

export class Game extends StateManager {
  readonly name;
  readonly cells;
  readonly size;
  readonly squareSize;
  readonly isValidGame;
  readonly possibleValues;
  readonly rows: Group[];
  readonly cols: Group[];
  readonly boxes: Group[];
  readonly groups: Group[];

  readonly isEmptyGame;
  readonly isPossible;
  readonly isValid;
  readonly isSolved;
  readonly readonlyGame;
  constructor(
    tree: StateManager[] | StateManager,
    name: string,
    recoilVersion: number,
    data: any
  ) {
    super(tree, [name, recoilVersion].join("."));
    this.name = name;
    let _data = readBoardFile(data);
    this.size = Math.sqrt(_data.length);
    this.squareSize = Math.sqrt(this.size);
    this.isValidGame = this.squareSize % 1 === 0;
    this.possibleValues = range(1, this.size + 1);

    // Cell references the static values of `Game`. This must be run after those properties are set.
    this.cells = _data.map<Cell>((v, i) => new Cell(this, i, v === 0 ? undefined : v));

    this.rows = new Array(this.size);
    this.cols = new Array(this.size);
    this.boxes = new Array(this.size);

    for (let i = 0; i < this.size; i += 1) {
      const colCells = this.cells.filter((cell, j) => j % this.size === i);
      this.cols[i] = new Group([...this.tree, this], this, "column", i, colCells);
      colCells.forEach((c) => c.addGroup(this.cols[i]));

      const rowCells = this.cells.slice(i * this.size, i * this.size + this.size);
      this.rows[i] = new Group([...this.tree, this], this, "row", i, rowCells);
      rowCells.forEach((c) => c.addGroup(this.rows[i]));
    }

    let boxN = 0;
    for (let i = 0; i < this.squareSize; i += 1) {
      for (let j = 0; j < this.squareSize; j += 1) {
        let topLeftY = i * this.squareSize;
        let topLeftX = j * this.squareSize;

        const boxCells = [];
        for (let boxY = topLeftY; boxY < topLeftY + this.squareSize; boxY += 1) {
          for (let boxX = topLeftX; boxX < topLeftX + this.squareSize; boxX += 1) {
            boxCells.push(this.cells[boxY * this.size + boxX]);
          }
        }
        const box = new Group([...this.tree, this], this, "box", boxN, boxCells);
        this.boxes[boxN] = box;
        boxCells.forEach((c) => c.addGroup(box));
        boxN += 1;
      }
    }
    this.groups = [...this.boxes, ...this.rows, ...this.cols];

    this.isEmptyGame = selector<boolean>({
      key: this.keys.IsEmptyGame,
      get: ({ get }) => {
        return this.cells.filter((c) => get(c.value) !== undefined).length === 0;
      },
    });

    this.isPossible = selector<boolean>({
      key: this.keys.IsPossible,
      get: ({ get }) => {
        return this.cells.every((c) => get(c.value) || get(c.availableNumbers).length > 0);
      },
    });

    this.isValid = selector<boolean>({
      key: this.keys.IsValid,
      get: ({ get }) => {
        const isPossible = get(this.isPossible);
        return isPossible && this.cells.every((c) => get(c.isValid));
      },
    });

    this.isSolved = selector<boolean>({
      key: this.keys.IsSolved,
      get: ({ get }) => {
        return this.cells.every((c) => get(c.value) !== undefined && c.isValid);
      },
    });

    // Yes. This will trigger re-renders on everything. Address with individual getters if it becomes an issue
    this.readonlyGame = selector<IReadonlyGame>({
      key: this.keys.ReadonlyGame,
      get: ({ get }) => ({
        cells: this.cells,
        size: this.size,
        squareSize: this.squareSize,
        isValidGame: this.isValidGame,
        isEmptyGame: get(this.isEmptyGame),
        isPossible: get(this.isPossible),
        isValid: get(this.isValid),
        isSolved: get(this.isSolved),
      }),
    });
  }

  solvedSquare(gci: CallbackInterfaceGetter): boolean {
    const { get } = gci();
    for (const origCell of this.cells) {
      const avail = get(origCell.availableNumbers);
      if (avail.length === 1) {
        origCell.setValue(gci, avail[0], ValueSource.ComputerSolved);
        return true;
      }
    }
    return false;
  }

  async stepSolveGame(gci: CallbackInterfaceGetter): Promise<boolean> {
    const { get } = gci();
    /*
        TODO:
          Figure out how to wait for batched updates. Calling this function in a loop will
          cause future iterations to repeat the same logic. Changing the tree of calls to be
          async seems to resolve the issue. This may be due to the updates not being stored in
          render loop? (<-- I don't know if this even is a thing. Just rambling idea.)
     */
    // @ts-ignore
    // snapshot._store.fireNodeSubscriptions();
    /*get(
      waitForAll(
        flattenArray([
          // game atoms
          this.isEmptyGame,
          this.isPossible,
          this.isValid,
          this.isSolved,
          // @ts-ignore
          this.readonlyGame,
          // group atoms
          ...this.groups.map((g) => [g.availableNumbers]),
          // cell atoms
          ...this.cells.map((c) => [
            c.source,
            c.value,
            c.availableNumbers,
            c.isValid,
            c.readonlyCell,
          ]),
        ])
      )
    );*/
    if (!get(this.isValid) || get(this.isSolved)) return false;

    // Solved square
    if (this.solvedSquare(gci)) return true;

    // Hidden singles
    // if (this.hiddenSingle(gci)) return true;
    //
    // // Naked pairs/triples/quads
    // if (this.nakedSets(gci)) return true;
    //
    // // Hidden pairs/triples
    // if (this.hiddenSets(gci)) return true;
    //
    // // Pointing pairs
    // if (this.pointingPairs(gci)) return true;
    //
    // // X-Wing (Superset of box line reduction/intersection removal)
    // if (this.xWing(gci)) return true;
    //
    // // Y-Wing
    // if (this.yWing(gci)) return true;

    // TODO: Swordfish
    // if (this.swordfish(gci)) return true;

    console.log("RETURNING FALSE v2");
    return false;
  }

  async solveGame(gci: CallbackInterfaceGetter) {
    while (true) {
      const madeChanges = await this.stepSolveGame(gci);
      if (!madeChanges) break;
    }
  }

  toString = (gci: CallbackInterfaceGetter) => {
    const { get } = gci();
    return this.cells.map((c) => get(c.value) || 0).join("");
  };

  copyToClipboard = (gci: CallbackInterfaceGetter) => {
    copy(this.toString(gci));
  };

  resetToStart = (gci: CallbackInterfaceGetter) => {
    this.cells.forEach((c) => {
      c.reset(gci);
    });
  };
}

class GameManager extends StateManager {
  private static _defaultGameBoards = objectMap(rawGameData, (v) => readBoardFile(v));
  static defaultGameName = "default";
  static blankReadonlyGame = new Game(
    [],
    "empty game",
    1,
    Array.from(Array(81), () => 0)
  );

  uiStore;
  constructor(tree: StateManager | StateManager[], identifier: string, uiStore: UIStore) {
    super(tree, identifier);
    this.uiStore = uiStore;
  }

  gameBoards = atom<{ [name: string]: number[] }>({
    key: this.keys.GameBoards,
    default: GameManager._defaultGameBoards,
  });

  private _activeGames = atom<{ [name: string]: Game }>({
    key: this.keys.ActiveGames,
    default: { [GameManager.defaultGameName]: GameManager.blankReadonlyGame },
  });

  private _currentGameName = atom<string>({
    key: this.keys._CurrentGameName,
    default: GameManager.defaultGameName,
  });

  private _gameNameMap = atom<{ [name: string]: number }>({
    key: this.keys._gameNameMap,
    default: {},
  });

  currentGame = selector<Game>({
    key: this.keys.CurrentGame,
    get: ({ get }) => {
      const gameName = get(this._currentGameName);
      const currentGame = get(this._activeGames)[gameName];

      if (!currentGame.isValidGame) {
        alert("Current game does not seem to be valid");
        return GameManager.blankReadonlyGame;
      }
      return currentGame;
    },
  });

  setCurrentGame<T extends Function>(
    getCallbackInterface: CallbackInterfaceGetter,
    name: string,
    gameBoard: number[]
  ) {
    const callback = (gci: CallbackInterfaceGetter) => {
      const { get, set } = gci();
      const gameNameMap = get(this._gameNameMap);

      let recoilVersion;
      if ((recoilVersion = gameNameMap[name])) recoilVersion += 1;
      else recoilVersion = 1;
      // @ts-ignore https://github.com/microsoft/TypeScript/issues/13948
      set(this._gameNameMap, { ...gameNameMap, [name]: recoilVersion });

      const newGame = new Game([...this.tree, this], name, recoilVersion, gameBoard);

      if (process.env.NODE_ENV === "development") {
        newGame.solveGame(gci);
      }

      const activeGames = get(this._activeGames);
      // @ts-ignore https://github.com/microsoft/TypeScript/issues/13948
      set(this._activeGames, {
        ...activeGames,
        [name]: newGame,
      });
      set(this._currentGameName, name);
    };

    const modal = {
      type: ModalType.Confirmation,
      message:
        "It appears that you have already started a game with this board, would you like to overwrite?",
      actions: [
        {
          text: "Confirm",
          cb: (gci: CallbackInterfaceGetter) => {
            callback(gci);
            this.uiStore.modalManager.closeModal(gci, modal);
          },
        },
        {
          text: "Cancel",
          cb: (gci: CallbackInterfaceGetter) =>
            this.uiStore.modalManager.closeModal(gci, modal),
          classNames: "btn btn-tertiary ml-2",
        },
      ],
    };

    const { get, set } = getCallbackInterface();

    const activeGames = get(this._activeGames);

    const matching = objectFilter(activeGames, (gb) => {
      return arraysExactlyEqual(
        gb.cells.map((cellRaw) => {
          const cell = get(cellRaw.readonlyCell);
          return cell.source === ValueSource.InitialGame ? cell.value : 0;
        }),
        gameBoard
      );
    });

    Object.keys(matching).length === 0
      ? callback(getCallbackInterface)
      : this.uiStore.modalManager.openModal(getCallbackInterface, modal);
  }
}

export const gameManager = new GameManager([], "root", rootUIStore);
