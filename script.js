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

  const playRound = (column, row) => {
    console.log(`Dropping ${getActivePlayer}'s token into column ${column}, row ${row}...`)
    isValidMove = board.placeToken(column, row, getActivePlayer().token) ? true : false ;
    
    if (isValidMove) {
      switchPlayerTurn();
    }
    printNewRound();
  };
  
  printNewRound();

  return {
    playRound,
    getActivePlayer
  };
}

const game = GameController();


