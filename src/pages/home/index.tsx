import React, { useCallback, useContext, useEffect, useRef, useState } from "react";

import * as S from "./_home.styled";
import { Cell, GameContext } from "src/state/sudoku";
import { observer } from "mobx-react-lite";
import Board from "./board";

const Home = observer(() => {
  const gameStore = useContext(GameContext);

  const hasCurrentGame = !!gameStore.currentGame;

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
                  board.name === gameStore.currentGame?.name
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
          <S.Button
            disabled={!hasCurrentGame}
            onClick={() => gameStore.currentGame?.resetToStart()}
          >
            Reset to start
          </S.Button>
          <S.Button
            disabled={!hasCurrentGame}
            onClick={() => gameStore.currentGame?.solveGame()}
          >
            Solve game
          </S.Button>
          <S.Button
            disabled={!hasCurrentGame}
            onClick={() => gameStore.currentGame?.stepSolveGame()}
          >
            Step solve game
          </S.Button>
          <S.Button
            disabled={!hasCurrentGame}
            onClick={() => gameStore.currentGame?.copyToClipboard()}
          >
            Copy board
          </S.Button>
        </S.BoardActions>
        <Board game={gameStore.currentGame} />
      </S.BoardWrapper>
    </S.Wrapper>
  );
});

export default Home;
