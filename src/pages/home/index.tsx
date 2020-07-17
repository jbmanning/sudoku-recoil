import React, { useCallback, useEffect } from "react";

import * as S from "./_home.styled";
import {
  DefaultValue,
  useRecoilState,
  useRecoilValue,
  useResetRecoilState,
} from "recoil/dist";
import { gameManager } from "src/state/sudoku";
import { useCallbackInterface, useRecoilAction } from "src/utils/recoil";
import { uiStore } from "src/state/ui";
import { gcn, uuid } from "src/utils";
import Board from "src/pages/home/board";

const Home = () => {
  const gameBoards = useRecoilValue(gameManager.gameBoards);
  const currentGame = useRecoilValue(gameManager.currentGame);
  const gci = useCallbackInterface();

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      let gameName = "underUsed";
      const game = gameBoards[gameName];
      // if (game) setCurrentGame(gameName, game);
    }
  }, []);
  /* eslint-enable react-hooks/exhaustive-deps */

  /*
  const importBoard = useCallback(() => {
    const data = prompt("Enter the board: ");
    if (data) {
      setGame(new Game(uuid(), gameManager, data));
    }
  }, [setGame]);*/

  return (
    <S.Wrapper>
      <div className={"w-64 h-full p-4 flex flex-col items-start"}>
        <button className={"btn btn-blue"} onClick={() => alert("Not implemented...")}>
          Clear Board
        </button>
        <button className={"btn btn-blue mt-4"} onClick={() => alert("Not implemented...")}>
          Import Board
        </button>

        <div className={"mt-4 flex-1 overflow-auto"}>
          <h3 className={"font-bold text-lg"}>Sample games</h3>
          <div className={"pl-2"}>
            {Object.entries(gameBoards).map(([name, board]) => (
              <a
                className={gcn(
                  "table",
                  "cursor-pointer",
                  currentGame.name === name && "font-bold underline"
                )}
                key={name}
                onClick={() => gameManager.setCurrentGame(gci, name, board)}
              >
                {name}
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className={"w-9/12 h-full flex flex-col justify-start items-start"}>
        <div className={" p-4 flex"}>
          <button className={"btn btn-blue "} onClick={() => currentGame.resetToStart(gci)}>
            Reset to start
          </button>
          <button className={"btn btn-blue ml-4"} onClick={() => currentGame.solveGame(gci)}>
            Solve game
          </button>
          <button
            className={"btn btn-blue ml-4"}
            onClick={() => currentGame.stepSolveGame(gci)}
          >
            Step solve game
          </button>
          <button
            className={"btn btn-blue ml-4"}
            onClick={() => currentGame.copyToClipboard(gci)}
          >
            Copy board
          </button>
        </div>
        <div className={""}>
          <Board game={currentGame} />
        </div>
      </div>
    </S.Wrapper>
  );
};

export default Home;
