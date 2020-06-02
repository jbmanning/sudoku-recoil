# Sudoku
This project is an algorithm based solver for sudoku puzzles. In it's current state 
it will solve many simple-hard puzzles, but begins to struggle with some puzzles requiring more complex techniques. My motivation for implementation has been simply as a learning project to get better at studying and implementing various algorithms.

## Techniques
Throughout development I have studied through various sources to find some of the most common techniques to solving puzzles, with my primary source of ideas being [SudokuWiki](https://www.sudokuwiki.org/sudoku.htm). Currently I employ no brute force or trial-and-error methods so if this codebase does not have a technique to surpass a step the puzzle will simply stop being solved at that point, leaving the user with a partially solved puzzle with the available numbers filtered down. 

### List of techniques
#### Naked Single 
A cell with only one candidate

#### Hidden Single
A cell who within one of its containing groups (row, column, box) only has one possible value.

#### Naked Sets
A set of two, three, or four cells within a group which contain an intersection of the same two, three, or four candidates. This means those candidates must be eventually placed in that set of cells and can be removed from all other cells in said group. 

#### Hidden Sets
A set of two, three, or four cells within a group which are the only cells within said group that contain an intersection of two, three, or four candidates. This means that those candidates must be eventually placed within that set of cells, and all non-intersection candidates can be removed from each cell within the set.

#### Pointing Pairs
TODO: Documentation

#### X-Wing
TODO: Documentation

#### Y-Wing
TODO: Implementation

#### Swordfish
TODO: Implementation

#### Trial-and-error
TODO: Implementation
In the circumstance that all other algorithms fail to generate new leads, find the cell with the fewest possible candidates and make a guess. Proceed with solving the puzzle with standard algorithms until the puzzle is invalid OR solved. If invalid, backtrack to the guessed cell and eliminate the guessed value from its candidates. This technique may need to be recursed, so sufficient state recording will be required. 


## Future goals
* Finish documentation
* Introduce a game history to show users the reasons certain candidates were eliminated, and the list of actions that were performed
* improve UI to indicate candidates have been eliminated
* re-introduce a user friendly way to actually play the game. Currently it is only for solving automatically
* Introduce way to import amd save boards/games
* Add unit testing to techniques
* Move to Mobx-State-Tree to streamline backtracking using snapshots
