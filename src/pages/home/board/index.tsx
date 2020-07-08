import { observer } from "mobx-react-lite";
import React, { useCallback, useContext, useMemo, useRef, useState } from "react";
import { Cell, GameContext, Game } from "src/state/sudoku";
import * as S from "./_board.styled";
import { useKeyDown, useOutsideClick } from "src/utils/hooks";
import { gcn } from "src/utils";

type IBoardProps = {
  game: Game;
};

const Board = observer<IBoardProps>(({ game }) => {
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
    <S.Board ref={boardRef} game={game}>
      {Array.from(Array(game.size + 1).keys()).map((i) => (
        <S.CellSquare key={`column_${i}`}>{i === 0 ? undefined : i}</S.CellSquare>
      ))}
      {game.cells.map((c, i) => (
        <React.Fragment key={`invisGroup_${i}`}>
          {c.colNumber % game.size === 0 ? (
            <S.CellSquare key={`row_${c.rowNumber}`}>
              {String.fromCharCode(65 + c.rowNumber)}
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
});

export default Board;
