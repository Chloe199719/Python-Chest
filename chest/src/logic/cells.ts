import { Piece } from "./piece";

export class Cell {
  piece: Piece | null;
  constructor() {
    this.piece = null;
  }
}
