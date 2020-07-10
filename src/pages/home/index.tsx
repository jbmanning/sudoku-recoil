import React from "react";

import * as S from "./_home.styled";

const Home = () => {
  // const [_game, setGame] = useRecoilState(gameManagerRecoil.currentGame);
  return (
    <S.Wrapper>
      <S.LeftSidebar>
        {/*<S.Button onClick={() => setGame(new Game("", [1]))}>New Board</S.Button>*/}
        {/*<S.Button>Import Board</S.Button>*/}
        {/*<S.GamesListWrapper>
          <h3>Sample Games</h3>
          <hr />
          <S.GamesList>
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
          </S.GamesList>
        </S.GamesListWrapper>
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
        </div>*/}
      </S.LeftSidebar>
      <S.BoardWrapper>
        {/*<S.BoardActions>
          <S.Button onClick={() => game.resetToStart()}>Reset to start</S.Button>
          <S.Button onClick={() => game.solveGame()}>Solve game</S.Button>
          <S.Button onClick={() => game.stepSolveGame()}>Step solve game</S.Button>
          <S.Button onClick={() => game.copyToClipboard()}>Copy board</S.Button>
        </S.BoardActions>*/}
        <div>
          Known issues with observability on border colors when performing actions. Working to
          move to Recoil.js for state management which should resolve issues.
        </div>
        {/*<Board game={game} />*/}
      </S.BoardWrapper>
    </S.Wrapper>
  );
};

export default Home;
