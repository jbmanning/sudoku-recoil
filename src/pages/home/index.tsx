import React, { useCallback, useContext, useEffect, useRef, useState } from "react";

import * as S from "./_home.styled";
import { Cell, GameContext } from "src/state/sudoku";
import { observer } from "mobx-react-lite";
import Board from "./board";
import { useRecoilState } from "recoil/dist";
import { uiStore } from "../../state/ui";

const Home = observer(() => {
  const gameStore = useContext(GameContext);

  const game = gameStore.currentGame;

  return (
    <S.Wrapper>
      <S.LeftSidebar>
        <S.Button>New Board</S.Button>
        <S.Button>Import Board</S.Button>
        <div>
          {gameStore.knownGames.map((board, i) => (
            <div key={i}>
              <a
                onClick={() => gameStore.startGame(board.name, board.val)}
                style={
                  board.name === game.name
                    ? {
                        textDecoration: "underline",
                        fontWeight: "bold",
                      }
                    : undefined
                }
              >
                {board.name}
              </a>
            </div>
          ))}
        </div>
      </S.LeftSidebar>
      <S.BoardWrapper>
        <S.BoardActions>
          <S.Button onClick={() => game.resetToStart()}>Reset to start</S.Button>
          <S.Button onClick={() => game.solveGame()}>Solve game</S.Button>
          <S.Button onClick={() => game.stepSolveGame()}>Step solve game</S.Button>
          <S.Button onClick={() => game.copyToClipboard()}>Copy board</S.Button>
        </S.BoardActions>
        <Board game={game} />
      </S.BoardWrapper>
    </S.Wrapper>
  );
});

export default Home;
