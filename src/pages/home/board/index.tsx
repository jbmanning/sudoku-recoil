import { observer } from "mobx-react-lite";
import React, { useCallback, useContext, useRef, useState } from "react";
import { GameContext, SudokuStore } from "src/state/sudoku";
import * as S from "./_board.styled";
import { useKeyDown, useOutsideClick } from "src/utils/hooks";

type IBoardProps = {
  game?: SudokuStore;
};

const Board = observer<IBoardProps>(({ game }) => {
  const boardRef = useRef<HTMLDivElement>(null);
  const [x, setX] = useState(-1);
  const [y, setY] = useState(-1);
  const [rawBoard, _] = useState([...new Array(81)]);

  const cellClick = (x: number, y: number) => () => {
    setX(x);
    setY(y);
  };

  useOutsideClick(boardRef, () => {
    setX(-1);
    setY(-1);
  });

  const leftHandler = useCallback(() => {
    if (x > 0) setX(x - 1);
  }, [x, setX]);
  const rightHandler = useCallback(() => {
    if (x < 8) setX(x + 1);
  }, [x, setX]);
  const upHandler = useCallback(() => {
    if (y > 0) setY(y - 1);
  }, [y, setY]);
  const downHandler = useCallback(() => {
    if (y < 8) setY(y + 1);
  }, [y, setY]);

  const escapeHandler = useCallback(() => {
    setX(-1);
    setY(-1);
  }, [setX, setY]);

  useKeyDown([
    { targetKey: "Escape", handler: escapeHandler },
    { targetKey: "ArrowLeft", handler: leftHandler },
    { targetKey: "ArrowRight", handler: rightHandler },
    { targetKey: "ArrowUp", handler: upHandler },
    { targetKey: "ArrowDown", handler: downHandler },
  ]);

  return (
    <S.Board ref={boardRef}>
      {rawBoard.map((_, i) => (
        <S.BoardCell key={`${i}`} game={game}>
          {game && (
            <S.GameCell
              cell={game.board[i]}
              isFocused={false}
              // onClick={cellClick(colJ, rowI)}
            >
              {game.board[i].value !== undefined
                ? game.board[i].value
                : game.board[i].availableNumbers.join("")}
            </S.GameCell>
          )}
        </S.BoardCell>
      ))}
    </S.Board>
  );
});

export default Board;
