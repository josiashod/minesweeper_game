import { MAX_MINES, MINES_PERCENTAGE } from "../pages/App";

const LEVELS = [
    {
        "name": "beginner",
        "col": 8,
        "row": 8,
    },
    {
        "name": "intermediate",
        "col": 16,
        "row": 16,
    },
    {
        "name": "advanced",
        "col": 20,
        "row": 20,
    }
];

const LEVEL_LABELS = {
    beginner: "Débutant",
    intermediate: "Intermédiaire",
    advanced: "Expert",
};

const getMines = (board) => {
    let mines = (board * MINES_PERCENTAGE) / 100;

    return mines < MAX_MINES ? Math.floor(mines) : MAX_MINES
}

function Level({ handleBoard }) {
    let setBoard = (level) => {
        handleBoard({
            name: level.name,
            col: level.col,
            row: level.row,
            mines: getMines(level.row * level.col),
        })
    }
    return (
        <div>
            <h1 className="hidden lg:block py-4 text-7xl font-towards text-center text-white mb-3">
                Minesweeper
            </h1>
            <p className="mx-auto mb-10 max-w-xl text-center text-sm sm:text-base" style={{ color: "#a7a9a5" }}>
                Choisis une difficulté et nettoie le terrain sans faire exploser la partie.
            </p>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {LEVELS.map((level) => (
                    <button onClick={() => setBoard(level)} key={level.name} className="level-card group">
                        <div className="mb-8 flex items-center justify-between gap-4">
                            <h5 className="text-left text-xl font-semibold text-white">{LEVEL_LABELS[level.name]}</h5>
                            <span className="rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white" style={{ border: "1px solid rgba(123, 125, 122, 0.35)", background: "rgba(123, 125, 122, 0.14)" }}>
                                Play
                            </span>
                        </div>
                        <div className="grid grid-cols-2 gap-3 text-left">
                            <div className="level-stat">
                                <span className="text-xs uppercase tracking-wide" style={{ color: "#a7a9a5" }}>Grille</span>
                                <strong>{ level.row } x { level.col }</strong>
                            </div>
                            <div className="level-stat">
                                <span className="text-xs uppercase tracking-wide" style={{ color: "#a7a9a5" }}>Mines</span>
                                <strong>{ getMines(level.row * level.col) }</strong>
                            </div>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
  }
  
  export default Level;
  
