function Gameboard() {
  board = [];

  const generateNewBoard = () => {
    for (let i = 0; i < 3; i++) {
      board[i] = [];
      for (let j = 0; j < 3; j++) {
      board[i].push(Cell());
      }  
    }
  }

  generateNewBoard();

  const getBoard = () => board;

  const placeToken = (row, column, player) => {
    if (board[row][column].getValue() === 0) {
      board[row][column].addToken(player);
      return true;
    } else {
      console.log("Invalid position. Choose another.")
      return false;
    }
  }; 

  const printBoard = () => {
    const boardWithCellValues = board.map((row) => row.map((cell) => cell.getValue()))
    console.log(boardWithCellValues);
  }

  const resetBoard = () => {
    board = [];
    generateNewBoard();
  }; 

  return {getBoard, placeToken, printBoard, resetBoard};
}

function Cell() {
  let value = 0;

  const addToken = (player) => {
    value = player;
  };

  const getValue = () => value;

  const removeToken = () => {
    value = 0;
  }

  return {
    addToken,
    getValue,
    removeToken
  };
}

function GameController(
  playerOneName = "Player 1",
  playerTwoName = "Player 2"
) {

  const board = Gameboard();

  const players = [
    {
      name: playerOneName,
      token: "x"
    },
    {
      name: playerTwoName,
      token: "o"
    }
  ];

  const renamePlayer = (playerNumber, newPlayerName) => {
    if (playerNumber === 1) {
      players[0].name = newPlayerName;
      return players[0].name;
    } else if (playerNumber === 2) {
      players[1].name = newPlayerName;
      return players[1].name;
    };
  };

  let activePlayer = players[0];

  let gameWinner = null;

  const switchPlayerTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };
  const getActivePlayer = () => activePlayer;

  const printNewRound = () => {
    board.printBoard();
    console.log(`${getActivePlayer().name}'s turn.`)
  }

  const winner = (valueBoard) => {
    const linesToCheck = [
      // Rows
      [ [0,0], [0,1], [0,2] ],
      [ [1,0], [1,1], [1,2] ],
      [ [2,0], [2,1], [2,2] ],
      // Columns
      [ [0,0], [1,0], [2,0] ],
      [ [0,1], [1,1], [2,1] ],
      [ [0,2], [1,2], [2,2] ],
      // Diagonals
      [ [0,0], [1,1], [2,2] ],
      [ [0,2], [1,1], [2,0] ]
    ];

    for (const line of linesToCheck) {
      const [a, b, c] = line;
      const valA = valueBoard[a[0]][a[1]];
      const valB = valueBoard[b[0]][b[1]];
      const valC = valueBoard[c[0]][c[1]];
      
      if (valA !== 0 && valA === valB && valB === valC) {
        return valA === players[0].token ? players[0].name : players[1].name;
      }
    }

    return null;
  };

  const playRound = (row, column) => {
    console.log(`Dropping ${getActivePlayer().name}'s token into column ${column}, row ${row}...`)
    let isValidMove = board.placeToken(row, column, getActivePlayer().token) ? true : false ;
    const boardWithCellValues = board.getBoard().map((row) => row.map((cell) => cell.getValue()))

    if (winner(boardWithCellValues)) {
      gameWinner = getActivePlayer().name;
      return;
    }    
    
    if (isValidMove) {
      switchPlayerTurn();
      printNewRound();
    }    
  };

  const resetGame = () => {
    board.resetBoard();
    gameWinner = null;
  };

  const getWinner = () => gameWinner;

  return {
    playRound,
    getActivePlayer,
    renamePlayer,
    switchPlayerTurn,
    resetGame,
    players,
    board,
    getWinner
  };
}

function ScreenController() {
  const game = GameController();

  const updateScreen = () => {
    let squares = document.querySelectorAll(".square");
    for (const square of squares) {
      square.textContent = "";
    }
    
    const board = game.board.getBoard();
    const activePlayer = game.getActivePlayer();

    let playerTurnDisplay = document.querySelector(".player-turn-display");
    playerTurnDisplay.textContent = `${activePlayer.name}'s turn...`

    const boardWithCellValues = board.map((row) => row.map((cell) => cell.getValue()))
    console.log("Rendered board:")
    console.log(boardWithCellValues);

    if (Array.isArray(boardWithCellValues) && Array.isArray(boardWithCellValues[0])) {
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          if (boardWithCellValues[i][j] === "x") {
            let squareToChange = document.querySelector(`._${i}-${j}`);
            squareToChange.textContent = "x";
          } else if (boardWithCellValues[i][j] === "o") {
            let squareToChange = document.querySelector(`._${i}-${j}`);
            squareToChange.textContent = "o";
          }
        }
      }
    }

    const winner = game.getWinner();
    const playerNamesRow = document.querySelector(".player-names-row");

    if (winner) {    
      playerNamesRow.textContent = `${winner} wins!`;
      playerNamesRow.classList.add('winner-display')
    }
  };
  
  const clickHandlerBoard = () => {
    const square_00 = document.querySelector("._0-0");
    const square_01 = document.querySelector("._0-1");
    const square_02 = document.querySelector("._0-2");
    const square_10 = document.querySelector("._1-0");
    const square_11 = document.querySelector("._1-1");
    const square_12 = document.querySelector("._1-2");
    const square_20 = document.querySelector("._2-0");
    const square_21 = document.querySelector("._2-1");
    const square_22 = document.querySelector("._2-2");

    const newGameButton = document.querySelector(".new-game-button");
    newGameButton.addEventListener("click", () => {
      game.resetGame();
      if (game.getActivePlayer() === game.players[1]) {
        game.switchPlayerTurn();
      };
      const playerNamesRow = document.querySelector(".player-names-row");
      playerNamesRow.classList.remove('winner-display');
      playerNamesRow.textContent = "";
      const player1Name = document.createElement("div");
      player1Name.classList.add("player-name", "player-1-name");
      player1Name.textContent = game.players[0].name;
      const vs = document.createElement("div");
      vs.classList.add("vs");
      vs.textContent = "vs";
      const player2Name = document.createElement("div");
      player2Name.classList.add("player-name", "player-2-name");
      player2Name.textContent = game.players[1].name;
      playerNamesRow.appendChild(player1Name);
      playerNamesRow.appendChild(vs);
      playerNamesRow.appendChild(player2Name);
    
      updateScreen();
    });

    const player1Name = document.querySelector(".player-1-name");
    const player2Name = document.querySelector(".player-2-name");
    player1Name.addEventListener("click", () => {
      let newName = prompt("Enter name: ", "Player 1");
      if (newName.length >= 1 && newName != player2Name.textContent) {
        player1Name.textContent = game.renamePlayer(1, newName);
      }
    });
    player2Name.addEventListener("click", () => {
      let newName = prompt("Enter name: ", "Player 2");
      if (newName.length >= 1 && newName != player1Name.textContent) {
        player2Name.textContent = game.renamePlayer(2, newName);
      }
    });

    square_00.addEventListener("click", () => {
      game.playRound(0,0);
      updateScreen();
    });
    square_01.addEventListener("click", () => {
      game.playRound(0,1);
      updateScreen();
    });
    square_02.addEventListener("click", () => {
      game.playRound(0,2);
      updateScreen();
    });
    square_10.addEventListener("click", () => {
      game.playRound(1,0);
      updateScreen();
    });
    square_11.addEventListener("click", () => {
      game.playRound(1,1);
      updateScreen();
    });
    square_12.addEventListener("click", () => {
      game.playRound(1,2);
      updateScreen();
    });
    square_20.addEventListener("click", () => {
      game.playRound(2,0);
      updateScreen();
    });
    square_21.addEventListener("click", () => {
      game.playRound(2,1);
      updateScreen();
    });
    square_22.addEventListener("click", () => {
      game.playRound(2,2);
      updateScreen();
    });    
  };

  

  clickHandlerBoard();
}

ScreenController();


