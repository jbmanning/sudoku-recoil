import React, { useCallback } from "react";

import * as S from "./_home.styled";
import {
  DefaultValue,
  useRecoilState,
  useRecoilValue,
  useResetRecoilState,
} from "recoil/dist";
import { gameManager } from "src/state/sudoku";
import { useRecoilAction } from "src/utils/recoil";
import { uiStore } from "src/state/ui";
import { uuid } from "src/utils";

const Home = () => {
  const stack = useRecoilValue(uiStore.modalManager.stack);
  const pushModal = useRecoilAction(uiStore.modalManager.openModal);
  const gameBoards = useRecoilValue(gameManager.gameBoards);
  const activeGames = useRecoilValue(gameManager._activeGames);
  const setCurrentGame = useRecoilAction(gameManager.setCurrentGame);

  /*
  const importBoard = useCallback(() => {
    const data = prompt("Enter the board: ");
    if (data) {
      setGame(new Game(uuid(), gameManager, data));
    }
  }, [setGame]);*/

  return (
    <S.Wrapper>
      <div className={"w-3/12 h-full p-4"}>
        <button className={"btn btn-blue"}>Clear Board</button>
        <button className={"btn btn-blue mt-4"} onClick={() => {}}>
          Import Board
        </button>

        <div className={"mt-4"}>
          <h3 className={"font-bold text-lg"}>Sample games</h3>
          <div className={"pl-2"}>
            {Object.entries(gameBoards).map(([name, board]) => (
              <a
                className={"table cursor-pointer"}
                key={name}
                onClick={() => setCurrentGame(uuid(), board)}
              >
                {name}
              </a>
            ))}
          </div>
          <h3 className={"font-bold text-lg"}>Stack</h3>
          <div className={"pl-2"}>
            {stack.map((c, i) => (
              <div key={i}>{JSON.stringify(c)}</div>
            ))}
          </div>
          <h3 className={"font-bold text-lg"}>Active games</h3>
          <div className={"pl-2"}>
            {Object.entries(activeGames).map(([name, game], i) => (
              <a className={"table cursor-pointer"} key={i}>
                {name}
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className={"w-9/12 h-full flex flex-col"}>
        <div className={" p-4 flex"}>
          <button className={"btn btn-blue "} onClick={() => 5}>
            Reset to start
          </button>
          <button className={"btn btn-blue ml-4"} onClick={() => 5}>
            Step solve game
          </button>
          <button className={"btn btn-blue ml-4"} onClick={() => 5}>
            Solve game
          </button>
          <button className={"btn btn-blue ml-4"} onClick={() => 5}>
            Copy board
          </button>
        </div>
        <div className={"flex-1"}></div>
      </div>
    </S.Wrapper>
  );
};

export default Home;
