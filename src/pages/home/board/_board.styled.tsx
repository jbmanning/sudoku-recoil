import styled from "styled-components";
import { Cell as CellObj, SudokuStore } from "src/state/sudoku";

const getBorderColor = ({ game }: { game?: SudokuStore }) =>
  game?.isSolved ? "var(--green-6)" : !game?.isValid ? "var(--red-6)" : "var(--grey-9)";

export const Board = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
  grid-template-areas: ". . . . . . . . ." ". . . . . . . . ." ". . . . . . . . ." ". . . . . . . . ." ". . . . . . . . ." ". . . . . . . . ." ". . . . . . . . ." ". . . . . . . . .";

  font-size: 3em;
`;

type IBoardCellProps = {
  game?: SudokuStore;
};

export const BoardCell = styled.div<IBoardCellProps>`
  width: 75px;
  height: 75px;
  display: flex;

  border: 2px solid var(--grey-6);
  &:not(:nth-child(9n - 8)) {
    border-left: 0;
  }

  &:not(:nth-last-child(-n + 9)) {
    border-bottom: 0;
  }

  &:nth-child(3n - 0) {
    border-right: 3px solid ${getBorderColor};
  }
  &:nth-child(9n - 8) {
    border-left: 3px solid ${getBorderColor};
  }

  &:nth-last-child(-n + 9) {
    border-bottom: 3px solid ${getBorderColor};
  }
  &:nth-child(-n + 9),
  &:nth-child(n + 28):nth-child(-n + 36),
  &:nth-child(n + 55):nth-child(-n + 63) {
    border-top: 3px solid ${getBorderColor};
  }
`;

type CellProps = {
  cell: CellObj;
  isFocused: boolean;
};

export const GameCell = styled.div<CellProps>`
  padding: 2px;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: ${({ cell }) => cell && cell.value && "center"};
  align-items: ${({ cell }) => cell && cell.value && "center"};

  color: ${({ cell }) => {
    if (cell && !cell.isValid) return "red";
    else if (cell && cell.isStatic) return "var(--grey-4)";
    return;
  }};
  font-size: ${({ cell }) => cell && cell.value === undefined && ".25em"};
  background: ${({ isFocused }) => isFocused && "var(--blue-3)"};
`;
