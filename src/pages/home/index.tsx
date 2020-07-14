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

const Home = () => {
  const stack = useRecoilValue(uiStore.modalManager.stack);
  const pushModal = useRecoilAction(uiStore.modalManager.pushModal);

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
        <button className={"btn btn-blue"} onClick={() => pushModal({ name: "Halp" })}>
          Clear Board
        </button>
        <button className={"btn btn-blue mt-4"} onClick={() => {}}>
          Import Board
        </button>

        <div className={"mt-4"}>
          <h3 className={"font-bold text-lg"}>Sample games</h3>
          <div className={"pl-2"}>
            {stack.map((c, i) => (
              <div key={i}>{JSON.stringify(c)}</div>
            ))}
            {/*{Object.entries(gameBoards).map(([name, board]) => (
              <a
                className={"table cursor-pointer"}
                key={name}
                onClick={() => setGame(new Game(name, gameManager, board))}
              >
                {name}
              </a>
            ))}*/}
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
