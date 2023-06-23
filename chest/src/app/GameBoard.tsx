"use client";
import { Game } from "@/logic/piece";
import { use, useEffect, useState } from "react";
import Image from "next/image";

type Props = {};
function GameBoard({}: Props) {
  const [game, setGame] = useState<Game>(new Game());
  const [startSelected, setStartSelected] = useState<[number, number] | null>(
    null
  );
  const [endSelected, setEndSelected] = useState<[number, number] | null>(null);
  const possiblePromotions = ["queen", "knight", "rook", "bishop"];
  const [selectedPromotion, setSelectedPromotion] = useState<
    "queen" | "knight" | "rook" | "bishop" | null
  >(null);
  function handleClick(arr: [number, number]) {
    if (startSelected && endSelected) {
      setStartSelected(null);
      setEndSelected(null);
      return;
    }

    if (startSelected) {
      if (startSelected[0] == arr[0] && startSelected[1] == arr[1]) {
        setStartSelected(null);
        return;
      } else {
        setEndSelected(arr);
        return;
      }
    }
    setStartSelected(arr);
  }
  useEffect(() => {
    if (startSelected && endSelected) {
      const copy = game;
      copy.move(startSelected, endSelected);
      setStartSelected(null);
      setEndSelected(null);
      setGame(copy);
    }
  }, [startSelected, endSelected, game]);
  useEffect(() => {
    if (selectedPromotion) {
      const copy = game;
      copy.promotePawn(selectedPromotion);
      setGame(copy);
      setSelectedPromotion(null);
    }
  }, [game, selectedPromotion]);
  return (
    <div className="flex flex-col items-center gap-3">
      {game.gameIsOver ? (
        <div className="text-4xl">
          {game.gameIsOver.winner.toLocaleUpperCase()} Won
        </div>
      ) : (
        ""
      )}
      <div className="text-4xl">TURN: {game.turn}</div>
      <div>
        {game.board.gameBoard.map((row, i) => {
          return (
            <div key={i} className="flex">
              {row.map((cell, ii) => {
                const color = (i + ii) % 2 == 0 ? "bg-white" : "bg-zinc-400";
                return (
                  <div
                    onClick={() => {
                      handleClick([i, ii]);
                    }}
                    key={`${ii}${i}`}
                    className={`flex-1 border  border-black h-20 w-20 flex items-center justify-center ${
                      startSelected &&
                      startSelected[0] == i &&
                      startSelected[1] == ii
                        ? "bg-green-500"
                        : color
                    } ${
                      endSelected && endSelected[0] == i && endSelected[1] == ii
                        ? "bg-red-500"
                        : ""
                    }`}
                  >
                    {cell.piece ? (
                      <Image
                        width={60}
                        height={60}
                        src={`/${cell.piece.type}_${cell.piece.color}.png`}
                        alt={`${cell.piece.type}_${cell.piece.color}`}
                      />
                    ) : (
                      ""
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
      {game.isPawnPromoting !== false ? (
        <div className="flex gap-3">
          {possiblePromotions.map((promotion, i) => {
            return (
              <div
                onClick={() => {
                  setSelectedPromotion(
                    promotion as "queen" | "knight" | "rook" | "bishop"
                  );
                }}
                key={i}
                className="border border-black"
              >
                <Image
                  width={60}
                  height={60}
                  /*@ts-expect-error */
                  src={`/${promotion}_${game.isPawnPromoting.color}.png`}
                  alt="stuff"
                />
              </div>
            );
          })}
        </div>
      ) : (
        ""
      )}
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={() => {
          setGame(new Game());
        }}
      >
        RESET
      </button>
    </div>
  );
}
export default GameBoard;
