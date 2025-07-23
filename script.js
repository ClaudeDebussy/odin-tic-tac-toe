function Gameboard() {
  board = [];

  for (i = 0; i < 3; i++) {
    board[i] = [];
    for (j = 0; j < 3; j++) {
    board[i].push(Cell());
    }  
  }

  const getBoard = () => board;

  const placeToken = (column, row, player) => {
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

  return {getBoard, placeToken, printBoard};
}

function Cell() {
  let value = 0;

  const addToken = (player) => {
    value = player;
  };

  const getValue = () => value;

  return {
    addToken,
    getValue
  };
}

function GameController(
  playerOneName = "Player One",
  playerTwoName = "Player Two"
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

  let activePlayer = players[0];

  const switchPlayerTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };
  const getActivePlayer = () => activePlayer;

  const printNewRound = () => {
    board.printBoard();
    console.log(`${getActivePlayer().name}'s turn.`)
  }

  const winner = (board) => {
    let currentBoard = board;
    let winningPatterns = [
      [
        [1,0,0],
        [1,0,0],
        [1,0,0]
      ],
      [
        [1,0,0],
        [0,1,0],
        [0,0,1]
      ],
      [
        [0,0,0],
        [0,0,0],
        [1,1,1]
      ],
      [
        [0,0,1],
        [0,1,0],
        [1,0,0]
      ],
      [
        [1,1,1],
        [0,0,0],
        [0,0,0]
      ],
      [
        [0,0,0],
        [1,1,1],
        [0,0,0]
      ],
      [
        [0,1,0],
        [0,1,0],
        [0,1,0]
      ],
      [
        [0,0,1],
        [0,0,1],
        [0,0,1]
      ]
    ];

    let player1BoardState = JSON.stringify(currentBoard.map((row) => 
      row.map((cell) => cell === "x" ? 1 : 0)
    ));
    let player2BoardState = JSON.stringify(currentBoard.map((row) => 
      row.map((cell) => cell === "o" ? 1 : 0)
    ));

    for (let i = 0; i < winningPatterns.length; i++) {
      let winningPatternToCheckStringified = JSON.stringify(winningPatterns[i]);

      if (player1BoardState === winningPatternToCheckStringified) {
        let winner = players[0].name;
        console.log(`The winner is ${winner}!`);
        return winner;
        
      } else if (player2BoardState === winningPatternToCheckStringified) {
        let winner = players[1].name;
        console.log(`The winner is ${winner}!`);
        return winner;
      }
    };
    // return winner;
  };

  const playRound = (column, row) => {
    console.log(`Dropping ${getActivePlayer().name}'s token into column ${column}, row ${row}...`)
    let isValidMove = board.placeToken(column, row, getActivePlayer().token) ? true : false ;
    const boardWithCellValues = board.getBoard().map((row) => row.map((cell) => cell.getValue()))

    if (winner(boardWithCellValues)) {
      console.log(`${getActivePlayer().name} wins!`);
    } else if (isValidMove) {
      switchPlayerTurn();
      printNewRound();
    }    
  };

  return {
    playRound,
    getActivePlayer
  };
}

const game = GameController();

game.playRound(1,2);
game.playRound(1,1);
game.playRound(2,1);
game.playRound(2,2);
game.playRound(0,1);
game.playRound(0,0);
