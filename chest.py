class Board:


    def __init__(self, x, y):
        # self.position = (x, y)
        self.piece = None

class Piece:
    def __init__(self, color, piece_type):
        self.color = color
        self.piece_type = piece_type
       
    
    def __str__(self):
        return f"{self.color[0]}{self.piece_type[0]}"
    
    def is_valid_move(self, start, end):
        dx = end[0] - start[0]
        dy = end[1] - start[1]

        if self.piece_type == "pawn":
            if self.color == "black":
                return (dx == 1 and dy == 0) or (abs(dy) == 1 and dx == 1)
            else:
                return (dx == -1 and dy == 0) or (abs(dy) == 1 and dx == -1)

        elif self.piece_type == "knight":
            return (abs(dx) == 2 and abs(dy) == 1) or (abs(dx) == 1 and abs(dy) == 2)

        elif self.piece_type == "bishop":
            return abs(dx) == abs(dy)

        elif self.piece_type == "rook":
            return dx == 0 or dy == 0

        elif self.piece_type == "queen":
            return dx == 0 or dy == 0 or abs(dx) == abs(dy)

        elif self.piece_type == "king":
            return max(abs(dx), abs(dy)) == 1

        return False
    def kill(self, piece):
        if self.color != piece.color:
            if self.piece_type == "king":
                print(f"{self} killed {piece}")
                print("Game over")
                exit()
            print(f"{self} killed {piece}")
            return True
        return False 
    

class ChessBoard:
    def __init__(self):
        self.board = [[Board(x, y) for x in range(8)] for y in range(8)]
        self.initBoard()
        self.player1 = "white"
        self.player2 = "black"
    
    def printBoard(self):
        for row in self.board:
            for cell in row:
                if cell.piece:
                    print(f"{cell.piece}", end=' ')
                else:
                    print("--", end=' ')
            print()
        print()
    def initBoard(self):
        pieces_order = ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook']
            
            # Place black pieces
        for i, piece_type in enumerate(pieces_order):
            self.board[0][i].piece = Piece('black', piece_type)
            self.board[1][i].piece = Piece('black', 'pawn')

            # Place white pieces
        for i, piece_type in enumerate(pieces_order):
            self.board[7][i].piece = Piece('white', piece_type)
            self.board[6][i].piece = Piece('white', 'pawn')

# game = ChessBoard()

# game.printBoard()

class Game:
    def __init__(self):
        self.chess_board = ChessBoard()
        self.turn = "White"
        self.selPiece = {
            "r": "rook",
            "k": "knight",
            "q": "queen",
            "b": "bishop",
        }
    def is_path_clear(self, start, end):
            dx = end[0] - start[0]
            dy = end[1] - start[1]
            
            x_dir = 0
            y_dir = 0
            
            if dx != 0:
                x_dir = 1 if dx > 0 else -1
            if dy != 0:
                y_dir = 1 if dy > 0 else -1
            
            x, y = start[0] + x_dir, start[1] + y_dir
            while x != end[0] or y != end[1]:
                if self.chess_board.board[x][y].piece is not None:
                    return False
                x += x_dir
                y += y_dir
            return True
    
    def move(self, start, end):
        piece = self.chess_board.board[start[0]][start[1]].piece
        print(piece)
        if piece.color.lower() != self.turn.lower():
            print("Invalid move1")
            return
        if piece.piece_type in ["rook", "bishop", "queen"]:
            if not self.is_path_clear(start, end):
                print("Cannot move through other pieces")
                return
        if piece.piece_type == "pawn" and self.chess_board.board[end[0]][end[1]].piece != None and self.chess_board.board[end[0]][end[1]].piece.kill(piece):
          
            if piece.color == "black":
                if end[0] - start[0] == 1 and abs(end[1] - start[1]) == 1:
                    
                    self.chess_board.board[end[0]][end[1]].piece = piece
                    self.chess_board.board[start[0]][start[1]].piece = None
                        

            elif piece.color == "white":
                if start[0] - end[0] == 1 and abs(end[1] - start[1]) == 1:
                 
                    self.chess_board.board[end[0]][end[1]].piece = piece
                    self.chess_board.board[start[0]][start[1]].piece = None
                        
        elif piece.piece_type == "pawn" and self.chess_board.board[end[0]][end[1]].piece == None:
            if piece.color == "black":
                if end[0] - start[0] == 1 and abs(end[1] - start[1]) == 0:
                    self.chess_board.board[end[0]][end[1]].piece = piece
                    self.chess_board.board[start[0]][start[1]].piece = None
                    
            elif piece.color == "white":
                if start[0] - end[0] == 1 and abs(end[1] - start[1]) == 0:
                    self.chess_board.board[end[0]][end[1]].piece = piece
                    self.chess_board.board[start[0]][start[1]].piece = None
                        
        elif piece.is_valid_move(start, end) and self.chess_board.board[end[0]][end[1]].piece != None and self.chess_board.board[end[0]][end[1]].piece.kill(piece):

            self.chess_board.board[end[0]][end[1]].piece = piece
            self.chess_board.board[start[0]][start[1]].piece = None
                
        elif piece.is_valid_move(start, end) and self.chess_board.board[end[0]][end[1]].piece == None:
            
            self.chess_board.board[end[0]][end[1]].piece = piece
            self.chess_board.board[start[0]][start[1]].piece = None
            
        else:
            print("Invalid move")
            return
        
        if piece.piece_type == "pawn" and piece.color == "black" and end[0] == 7:
            print("Enter piece type: r: rook, k: knight, b: bishop, q: queen")
            res = input()
            while res not in self.selPiece:
                print("Invalid piece type")
                res = input()
            piece.piece_type = self.selPiece[res]
        elif piece.piece_type == "pawn" and piece.color == "white" and end[0] == 0:
            print("Enter piece type: r: rook, k: knight, b: bishop, q: queen")
            res = input()
            while res not in self.selPiece:
                print("Invalid piece type")
                res = input()
            piece.piece_type = self.selPiece[res]   
            
        self.turn = "Black" if self.turn == "White" else "White"
             
             
    
    
    def play(self):
        while True:
            self.chess_board.printBoard()
            print(f"{self.turn} turn")
            print("Enter start position: ")
            start = input()
            print("Enter end position: ")
            end = input()

            start = (int(start[0]), int(start[1]))
            end = (int(end[0]), int(end[1]))

            

            self.move(start, end)


game = Game()

game.play()