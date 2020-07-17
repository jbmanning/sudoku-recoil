import React, { useCallback, useRef, useState } from "react";
import { Cell, Game, IReadonlyGame } from "src/state/sudoku";
import * as S from "./_board.styled";
import { useKeyDown, useOutsideClick } from "src/utils/hooks";
import { useRecoilValue } from "recoil";

type BoardProps = {
  game: Game;
};
type BoardCellProps = {
  i: number;
  game: IReadonlyGame;
  cell: Cell;
};

const BoardCell = ({ i, game, cell }: BoardCellProps) => {
  const readonlyCell = useRecoilValue(cell.readonlyCell);

  return (
    <React.Fragment>
      {readonlyCell.colNumber % game.size === 0 ? (
        <S.CellSquare isRowLabel>{readonlyCell.rowName}</S.CellSquare>
      ) : undefined}

      <S.CellSquare>
        <S.GameCell
          game={game}
          cell={readonlyCell}
          isFocused={false}
          // onClick={cellClick(colJ, rowI)}
        />
      </S.CellSquare>
    </React.Fragment>
  );
};

const Board = ({ game }: BoardProps) => {
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

  return (
    <S.Board ref={boardRef} game={readonlyGame}>
      <S.CellSquare />
      {game.cells.slice(0, readonlyGame.size).map((c) => (
        <S.CellSquare key={`column_${c.colName}`} isColLabel>
          {c.colName}
        </S.CellSquare>
      ))}
      {game.cells.map((c, i) => (
        <BoardCell key={`boardCell_${i}`} i={i} game={readonlyGame} cell={c} />
      ))}
    </S.Board>
  );
};

export default Board;
