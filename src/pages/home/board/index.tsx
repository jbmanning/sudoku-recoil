import React, { useCallback, useRef, useState } from "react";
import { Game } from "src/state/sudoku";
import * as S from "./_board.styled";
import { useKeyDown, useOutsideClick } from "src/utils/hooks";
import { useRecoilValue } from "recoil";

type IBoardProps = {
  game: Game;
};

const Board = ({ game }: IBoardProps) => {
  const cells = useRecoilValue(game.cells);
  const readonlyGame = useRecoilValue(game.readonlyGame);

  const boardRef = useRef<HTMLDivElement>(null);
  const [x, setX] = useState(-1);
  const [y, setY] = useState(-1);

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

  // const cells = useRecoilValue(game.cells);

  return (
    <S.Board ref={boardRef} game={readonlyGame}>
      {cells.slice(0, readonlyGame.size).map((c) => (
        <S.CellSquare key={`column_${c.colName}`} isColLabel>
          {c.colName}
        </S.CellSquare>
      ))}
      {cells.map((c, i) => (
        <React.Fragment key={`invisGroup_${i}`}>
          {c.colNumber % readonlyGame.size === 0 ? (
            <S.CellSquare key={`row_${c.rowName}`} isRowLabel>
              {c.rowName}
            </S.CellSquare>
          ) : undefined}

          <S.CellSquare key={`cell_${i}`}>
            <S.GameCell
              game={game}
              cell={c}
              isFocused={false}
              // onClick={cellClick(colJ, rowI)}
            />
          </S.CellSquare>
        </React.Fragment>
      ))}
    </S.Board>
  );
};

export default Board;
