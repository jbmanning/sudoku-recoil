import React from "react";
import styled from "styled-components";
import tailwindConfig, { tailwindTheme } from "src/styles/tailwind";
import { Cell as CellObj, Game, ValueSource } from "src/state/sudoku";

const getBorderColor = ({ game }: { game: Game }) =>
  game.isSolved
    ? tailwindTheme.colors.green["600"]
    : !game.isValid
    ? tailwindTheme.colors.red["600"]
    : tailwindTheme.colors.gray["900"];

type BoardProps = {
  game: Game;
};

export const Board = styled.div<BoardProps>`
  display: grid;
  grid-template-rows: repeat(${({ game }) => game.size + 1}, 1fr);
  grid-template-columns: repeat(${({ game }) => game.size + 1}, 1fr);
`;

export const CellSquare = styled.div`
  width: 75px;
  height: 75px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

type GameCellProps = {
  game: Game;
  cell: CellObj;
  isFocused: boolean;
};

const StyledGameCell = styled.div<GameCellProps>`
  padding: 2px;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: ${({ cell }) => cell.value && "center"};
  align-items: ${({ cell }) => cell.value && "center"};

  color: ${({ cell }) => {
    if (!cell.isValid) return tailwindConfig.theme.colors.red[700];
    else if (cell.source === ValueSource.InitialGame)
      return tailwindConfig.theme.colors.gray[500];
    return;
  }};

  font-size: ${({ cell }) => (cell.value !== undefined ? "3em" : ".75em")};
  background: ${({ isFocused }) => isFocused && "var(--blue-3)"};

  ${({ cell, game }) => {
    const out: string[] = [];

    const standardBorder = `2px solid ${tailwindTheme.colors.gray[600]};`;
    const solidBorder = `3px solid ${getBorderColor({ game })};`;

    let squareColNumber = cell.colNumber % game.squareSize;
    if (squareColNumber === 0) {
      out.push(`border-left: ${solidBorder}`);
    }
    if (cell.colNumber === game.size - 1) {
      out.push(`border-right: ${solidBorder}`);
    }
    if (squareColNumber > 0 && squareColNumber < game.squareSize) {
      out.push(`border-left: ${standardBorder}`);
    }

    const squareRowNumber = cell.rowNumber % game.squareSize;
    if (squareRowNumber === 0) {
      out.push(`border-top: ${solidBorder}`);
    }
    if (cell.rowNumber === game.size - 1) {
      out.push(`border-bottom: ${solidBorder}`);
    }
    if (squareRowNumber > 0 && squareRowNumber < game.squareSize) {
      out.push(`border-top: ${standardBorder}`);
    }

    return out;
  }};
`;

export const GameCell = ({ game, cell, isFocused }: GameCellProps) => {
  return (
    <StyledGameCell game={game} cell={cell} isFocused={isFocused}>
      {cell.value !== undefined
        ? cell.value
        : game.isEmptyGame
        ? undefined
        : cell.availableNumbers.join("")}
    </StyledGameCell>
  );
};
