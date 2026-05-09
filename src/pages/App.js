import { useState } from "react";
import GameBoard from "../components/GameBoard";
import Level from "../components/Level";

export const MAX_MINES = 99;
export const MINES_PERCENTAGE = 23.4375;

function App() {
  const [board, setBoard] = useState(null)

  return (
    <div className="app-shell w-full min-h-screen flex px-4 py-6 sm:px-8">
      <div className="m-auto w-full max-w-7xl">
        <h1 className="block lg:hidden py-4 text-5xl font-towards text-center text-white mb-6">
          Minesweeper
        </h1>
        {!board ? <Level handleBoard={setBoard} /> : <GameBoard board={board} startOver={setBoard} />}

        <footer className="mt-8 text-center text-sm" style={{ color: "#7B7D7A" }}>
          Powered by <a href="https://github.com/josiashod" target="_blank" rel="noopener noreferrer" className="font-medium text-white transition hover:opacity-80">@josiashod</a>
        </footer>
      </div>
    </div>
  );
}

export default App;
