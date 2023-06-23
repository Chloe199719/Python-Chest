import { Cell } from "./cells";

export class Piece {
  color: "white" | "black";
  type: "pawn" | "rook" | "knight" | "bishop" | "queen" | "king";
  constructor(
    color: "white" | "black",
    type: "pawn" | "rook" | "knight" | "bishop" | "queen" | "king"
  ) {
    this.color = color;
    this.type = type;
  }
  isValidMove(start: number[], end: number[]) {
    const dx = end[0] - start[0];
    const dy = end[1] - start[1];

    switch (this.type) {
      case "pawn":
        if (this.color === "white") {
          return (dx == -1 && dy == 0) || (Math.abs(dy) == 1 && dx == -1);
        } else {
          return (dx == 1 && dy == 0) || (Math.abs(dy) == 1 && dx == 1);
        }

      case "knight":
        return (
          (Math.abs(dx) === 2 && Math.abs(dy) === 1) ||
          (Math.abs(dx) === 1 && Math.abs(dy) === 2)
        );

      case "bishop":
        return Math.abs(dx) === Math.abs(dy);

      case "rook":
        return dx === 0 || dy === 0;

      case "queen":
        return dx === 0 || dy === 0 || Math.abs(dx) === Math.abs(dy);

      case "king":
        return Math.max(Math.abs(dx), Math.abs(dy)) === 1;
    }
    return false;
  }
  kill(Piece: Piece) {
    if (this.color !== Piece.color) {
      if (this.type === "king") {
        return {
          winner: Piece.color, // Change to call a function that ends the game
        };
      }
      return true;
    }
    return false;
  }
}

export class Board {
  gameBoard: Cell[][];
  constructor() {
    this.gameBoard = [];
    for (let i = 0; i < 8; i++) {
      this.gameBoard[i] = [];
      for (let j = 0; j < 8; j++) {
        this.gameBoard[i][j] = new Cell();
      }
    }
    type piece = "rook" | "knight" | "bishop" | "queen" | "king";
    const pieces_order: piece[] = [
      "rook",
      "knight",
      "bishop",
      "queen",
      "king",
      "bishop",
      "knight",
      "rook",
    ];

    for (let i = 0; i < 8; i++) {
      this.gameBoard[0][i].piece = new Piece("black", pieces_order[i]);
      this.gameBoard[1][i].piece = new Piece("black", "pawn");
      this.gameBoard[6][i].piece = new Piece("white", "pawn");
      this.gameBoard[7][i].piece = new Piece("white", pieces_order[i]);
    }
  }
}

export class Game {
  board: Board;
  turn: "white" | "black";
  gameIsOver: false | { winner: "white" | "black" };
  constructor() {
    this.board = new Board();
    this.turn = "white";
    this.gameIsOver = false;
  }
  move(start: number[], end: number[]) {
    if (this.gameIsOver) {
      return false;
    }
    const startCell = this.board.gameBoard[start[0]][start[1]];
    const endCell = this.board.gameBoard[end[0]][end[1]];
    if (!this.isPathClear(start, end)) {
      return false;
    }
    if (startCell.piece) {
      if (startCell.piece.color === this.turn) {
        if (endCell.piece) {
          if (
            this.kill(startCell.piece, endCell.piece) &&
            startCell.piece.isValidMove(start, end)
          ) {
            endCell.piece = startCell.piece;
            startCell.piece = null;
            this.turn = this.turn === "white" ? "black" : "white";
            return true;
          }
        } else {
          if (startCell.piece.isValidMove(start, end)) {
            endCell.piece = startCell.piece;
            startCell.piece = null;
            this.turn = this.turn === "white" ? "black" : "white";
            return true;
          }
        }
      }
    }
    return false;
  }
  kill(PieceStart: Piece, PieceEnd: Piece) {
    if (PieceStart.color !== PieceEnd.color) {
      if (PieceEnd.type === "king") {
        this.gameIsOver = { winner: PieceStart.color };
        console.log("Game Over");
        return {
          winner: PieceStart.color, // Change to call a function that ends the game
        };
      }
      return true;
    }
    return false;
  }
  isPathClear(start: number[], end: number[]) {
    const dx = end[0] - start[0];
    const dy = end[1] - start[1];

    let xDir = 0;
    let yDir = 0;

    if (dx !== 0) {
      xDir = dx > 0 ? 1 : -1;
    }
    if (dy !== 0) {
      yDir = dy > 0 ? 1 : -1;
    }

    let x = start[0] + xDir;
    let y = start[1] + yDir;
    while (x !== end[0] && y !== end[1]) {
      if (this.board.gameBoard[x][y].piece) {
        return false;
      }
      x += xDir;
      y += yDir;
    }
    return true;
  }
}
