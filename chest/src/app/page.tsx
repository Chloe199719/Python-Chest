import Image from "next/image";
import GameBoard from "./GameBoard";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <GameBoard />
    </main>
  );
}
