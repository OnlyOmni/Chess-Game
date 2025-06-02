// Piece-Square Tables (simplified example, values are relative bonuses)
// Values are from white's perspective. Flip for black. Higher is better.
// These are placed outside $(document).ready so they are globally accessible within this script file.

const pawnTable = [
    [0,  0,  0,  0,  0,  0,  0,  0],
    [50, 50, 50, 50, 50, 50, 50, 50], // Promotion incentive
    [10, 10, 20, 30, 30, 20, 10, 10],
    [5,  5, 10, 25, 25, 10,  5,  5],
    [0,  0,  0, 20, 20,  0,  0,  0],
    [5, -5,-10,  0,  0,-10, -5,  5],
    [5, 10, 10,-20,-20, 10, 10,  5],
    [0,  0,  0,  0,  0,  0,  0,  0]
];

const knightTable = [
    [-50,-40,-30,-30,-30,-30,-40,-50],
    [-40,-20,  0,  5,  5,  0,-20,-40],
    [-30,  5, 10, 15, 15, 10,  5,-30],
    [-30,  0, 15, 20, 20, 15,  0,-30],
    [-30,  5, 15, 20, 20, 15,  5,-30],
    [-30,  0, 10, 15, 15, 10,  0,-30],
    [-40,-20,  0,  0,  0,  0,-20,-40],
    [-50,-40,-30,-30,-30,-30,-40,-50]
];

const bishopTable = [
    [-20,-10,-10,-10,-10,-10,-10,-20],
    [-10,  0,  0,  0,  0,  0,  0,-10], // Less aggressive than some tables
    [-10,  0,  5, 10, 10,  5,  0,-10],
    [-10,  5,  5, 10, 10,  5,  5,-10],
    [-10,  0, 10, 10, 10, 10,  0,-10],
    [-10, 10, 10, 10, 10, 10, 10,-10],
    [-10,  5,  0,  0,  0,  0,  5,-10],
    [-20,-10,-10,-10,-10,-10,-10,-20]
];

const rookTable = [
    [0,  0,  0,  5,  5,  0,  0,  0],
    [-5,  0,  0,  0,  0,  0,  0, -5],
    [-5,  0,  0,  0,  0,  0,  0, -5],
    [-5,  0,  0,  0,  0,  0,  0, -5],
    [-5,  0,  0,  0,  0,  0,  0, -5],
    [-5,  0,  0,  0,  0,  0,  0, -5],
    [5, 10, 10, 10, 10, 10, 10,  5], // 7th rank bonus
    [0,  0,  0,  0,  0,  0,  0,  0]
];

const queenTable = [
    [-20,-10,-10, -5, -5,-10,-10,-20],
    [-10,  0,  5,  0,  0,  0,  0,-10],
    [-10,  5,  5,  5,  5,  5,  0,-10],
    [0,  0,  5,  5,  5,  5,  0, -5],
    [-5,  0,  5,  5,  5,  5,  0, -5],
    [-10,  0,  5,  5,  5,  5,  0,-10],
    [-10,  0,  0,  0,  0,  0,  0,-10],
    [-20,-10,-10, -5, -5,-10,-10,-20]
];


const kingTableEarly = [ // For early/mid game
    [-30,-40,-40,-50,-50,-40,-40,-30],
    [-30,-40,-40,-50,-50,-40,-40,-30],
    [-30,-40,-40,-50,-50,-40,-40,-30],
    [-30,-40,-40,-50,-50,-40,-40,-30],
    [-20,-30,-30,-40,-40,-30,-30,-20],
    [-10,-20,-20,-20,-20,-20,-20,-10],
    [20, 20,  0,  0,  0,  0, 20, 20], // Encourage castling
    [20, 30, 10,  0,  0, 10, 30, 20]  // Castled positions
];

const kingTableEnd = [ // For endgame
    [-50,-40,-30,-20,-20,-30,-40,-50],
    [-30,-20,-10,  0,  0,-10,-20,-30],
    [-30,-10, 20, 30, 30, 20,-10,-30],
    [-30,-10, 30, 40, 40, 30,-10,-30],
    [-30,-10, 30, 40, 40, 30,-10,-30],
    [-30,-10, 20, 30, 30, 20,-10,-30],
    [-30,-30,  0,  0,  0,  0,-30,-30],
    [-50,-30,-30,-30,-30,-30,-30,-50]
];

// Helper to get piece-square table value
function getPieceSquareValue(piece, squareName) { // squareName e.g., 'e4'
    if (!piece) return 0;

    const file = squareName.charCodeAt(0) - 'a'.charCodeAt(0); // 0-7 for a-h
    const rank = 8 - parseInt(squareName.charAt(1));       // 0-7 for 8-1

    if (rank < 0 || rank > 7 || file < 0 || file > 7) return 0; // Should not happen with valid squares

    let table;
    switch (piece.type) {
        case 'p': table = pawnTable; break;
        case 'n': table = knightTable; break;
        case 'b': table = bishopTable; break;
        case 'r': table = rookTable; break;
        case 'q': table = queenTable; break;
        case 'k':
            const boardFenPieces = game.fen().split(' ')[0]; // e.g. "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR"
            const queenCount = (boardFenPieces.match(/q/gi) || []).length;
            // Count pieces by removing digits and slashes
            const pieceCount = boardFenPieces.replace(/\//g, '').replace(/[1-8]/g, '').length;
            table = (pieceCount < 12 || queenCount < 2) ? kingTableEnd : kingTableEarly;
            break;
        default: return 0;
    }

    // Tables are typically defined from white's perspective (rank 0 is white's 1st rank)
    // chess.js board (and array indices 0-7 for rank) go from rank 8 down to rank 1
    // So, if white, table[rank] is correct. If black, table[7-rank] (mirrored).
    return (piece.color === 'w') ? table[rank][file] : -table[7 - rank][file];
}


$(document).ready(function() {
    console.log("Document ready. Main script.js executing with improved basic AI.");

    const statusEl = $('#status');
    const turnEl = $('#turn');
    const fenEl = $('#fen');
    const pgnEl = $('#pgn');
    const playerColorSelect = $('#playerColor');
    const newGameButton = $('#newGameButton');
    const undoButton = $('#undoButton');

    let board = null;
    let game = null; // Will be 'new Chess()' from chess.js v0.10.3

    let playerChoosesColor = 'w';
    let actualPlayerColor = 'w';
    let playerOrientation = 'white';
    let aiIsThinking = false;

    console.log("Global variables and selectors initialized.");

    // --- IMPROVED BASIC AI with Piece-Square Tables ---
    function evaluateBoard(current_game_state, ai_color_perspective) {
        let totalEvaluation = 0;
        // Material values (centipawns)
        const pieceValues = { 'p': 100, 'n': 320, 'b': 330, 'r': 500, 'q': 900, 'k': 20000 };
        // Mobility bonus per move
        const mobilityFactor = 2; 

        for (let r = 0; r < 8; r++) { // 8 ranks
            for (let f = 0; f < 8; f++) { // 8 files
                const squareName = 'abcdefgh'[f] + (8 - r); // 'a8' down to 'h1'
                const piece = current_game_state.get(squareName); // Use game.get(square)

                if (piece) {
                    let value = pieceValues[piece.type] + getPieceSquareValue(piece, squareName);
                    totalEvaluation += (piece.color === ai_color_perspective ? value : -value);
                }
            }
        }

        // Add mobility score (simple version)
        const aiMoves = current_game_state.moves({color: ai_color_perspective}).length;
        const opponentColor = (ai_color_perspective === 'w') ? 'b' : 'w';
        // Temporarily switch turn to get opponent's moves
        const originalTurn = current_game_state.turn();
        current_game_state.load(current_game_state.fen().replace(originalTurn, opponentColor)); // Hacky way to change turn for moves()
        const opponentMoves = current_game_state.moves({color: opponentColor}).length;
        current_game_state.load(current_game_state.fen().replace(opponentColor, originalTurn)); // Revert turn

        totalEvaluation += (aiMoves - opponentMoves) * mobilityFactor;
        
        return totalEvaluation;
    }

    function getBasicAIMove() {
        if (!game || game.game_over()) return null;

        const possibleMoves = game.moves({ verbose: true });
        if (possibleMoves.length === 0) return null;

        let bestMoveSAN = null;
        let bestScore = -Infinity; 
        const aiColor = game.turn();

        for (const move of possibleMoves) {
            game.move(move.san); // Make the move
            let score;

            if (game.in_checkmate()) { // AI delivers checkmate
                score = 99999; // Very high score for checkmate
            } else if (game.in_draw() || game.in_stalemate() || game.insufficient_material()) {
                score = 0; // Neutral for draws
            } else {
                // Evaluate the board from THE AI'S perspective after its move
                score = evaluateBoard(game, aiColor);
                
                // Bonus for giving check, penalty if AI gets itself into check (shouldn't happen with legal moves)
                if (game.in_check()) { // Check if opponent is in check after AI's move
                    score += (aiColor === game.turn() ? -1000 : 50); // if AI is still turn, means it checked itself (bad), else opponent is checked (good)
                }
            }
            game.undo(); // Undo the move

            if (score > bestScore) {
                bestScore = score;
                bestMoveSAN = move.san;
            }
        }

        if (bestMoveSAN === null && possibleMoves.length > 0) { // Fallback if all moves are somehow terrible
            bestMoveSAN = possibleMoves[Math.floor(Math.random() * possibleMoves.length)].san;
        }
        
        console.log(`Basic AI (Improved) selected move: ${bestMoveSAN} with score: ${bestScore} for color ${aiColor}`);
        return bestMoveSAN;
    }
    // --- END IMPROVED BASIC AI ---

    async function makeAIMove() {
        if (!game || game.game_over() || game.turn() !== actualPlayerColor) {
            updateStatus(); // Ensure UI reflects if it's player's turn
            return;
        }

        aiIsThinking = true;
        statusEl.text("OmniBot (Improved AI) is thinking...");
        await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 400)); // Shorter delay ok for basic AI

        const moveSAN = getBasicAIMove();
        if (moveSAN) {
            game.move(moveSAN);
            if (board) board.position(game.fen());
            playSound('move-opponent');
        } else {
            console.warn("Improved Basic AI could not find a move.");
            // This might happen if it's stalemate/checkmate for AI, game.game_over() should catch it.
        }
        aiIsThinking = false;
        updateStatus();
    }

    function playSound(type) { /* console.log(`Sound: ${type}`); */ }

    function onDragStart(source, piece, position, orientation) {
        if (!game || game.game_over() || game.turn() !== actualPlayerColor || aiIsThinking) {
            return false;
        }
        if ((actualPlayerColor === 'w' && piece.search(/^b/) !== -1) ||
            (actualPlayerColor === 'b' && piece.search(/^w/) !== -1)) {
            return false;
        }
        highlightLegalMoves(source);
        return true;
    }

    function highlightLegalMoves(square) {
        removeHighlights();
        if (!game) return;
        const moves = game.moves({ square: square, verbose: true });
        if (moves.length === 0) return;
        moves.forEach(move => {
            const $targetSquare = $(`.square-${move.to}`);
            if (move.captured) {
                $targetSquare.addClass('highlight-capture');
            } else {
                $targetSquare.addClass('highlight-legal');
            }
        });
    }

    function removeHighlights() {
        $('#board .square-55d63').removeClass('highlight-legal highlight-capture');
    }

    function onDrop(source, target) {
        removeHighlights();
        if (!game) return 'snapback';
        let moveAttempt = { from: source, to: target, promotion: 'q' };
        let moveResult = game.move(moveAttempt);
        if (moveResult === null) return 'snapback';
        playSound(moveResult.captured ? 'capture' : 'move-self');
        // onSnapEnd handles board update, status update, and AI turn trigger
    }

    function onSnapEnd() {
        if (!game || !board) return;
        board.position(game.fen());
        updateStatus();
        if (!game.game_over() && game.turn() !== actualPlayerColor) {
            makeAIMove();
        }
    }

    function updateStatus() {
        if (!game) { statusEl.text("Game not initialized."); return; }
        let currentStatusText = '';
        const currentTurnColorDisplay = (game.turn() === 'w') ? 'White' : 'Black';
        turnEl.text(currentTurnColorDisplay);

        if (game.in_checkmate()) {
            currentStatusText = `Game Over: ${currentTurnColorDisplay} is in checkmate.`;
            statusEl.css('color', 'red');
        } else if (game.in_draw()) {
            currentStatusText = 'Game Over: Draw';
            if (game.in_stalemate()) currentStatusText += ' (Stalemate)';
            if (game.in_threefold_repetition()) currentStatusText += ' (Threefold Repetition)';
            if (game.insufficient_material()) currentStatusText += ' (Insufficient Material)';
            statusEl.css('color', 'orange');
        } else {
            currentStatusText = (game.turn() === actualPlayerColor) ? "Your turn" : (aiIsThinking ? "OmniBot (Improved AI) is thinking..." : "OmniBot's turn");
            if (game.in_check()) {
                currentStatusText += ` (${currentTurnColorDisplay} is in check).`;
                statusEl.css('color', 'yellow');
            } else {
                statusEl.css('color', '#ffc107');
            }
        }
        statusEl.text(currentStatusText);
        fenEl.text(game.fen());
        pgnEl.val(game.pgn({ max_width: 72, newline_char: '\n' }));
        pgnEl.scrollTop(pgnEl[0].scrollHeight);
        const canUndo = game.history().length > 0;
        undoButton.prop('disabled', !canUndo || aiIsThinking || (game.turn() !== actualPlayerColor && game.history().length > 0));
    }

    function startNewGame() {
        console.log("startNewGame called.");
        if (typeof Chess !== 'function') {
            statusEl.text("ERROR: Chess.js library not loaded.");
            console.error("Chess object (from chess.js) is not defined. Aborting.");
            return;
        }
        if (!playerColorSelect || playerColorSelect.length === 0) {
            console.error("playerColorSelect DOM element not found. Aborting.");
            statusEl.text("ERROR: UI element missing.");
            return;
        }
        game = new Chess(); // Initialize new chess.js game state
        aiIsThinking = false;

        playerChoosesColor = playerColorSelect.val();
        actualPlayerColor = (playerChoosesColor === 'random') ? (Math.random() < 0.5 ? 'w' : 'b') : playerChoosesColor.charAt(0);
        playerOrientation = (actualPlayerColor === 'w') ? 'white' : 'black';
        console.log(`New Game (Improved Basic AI): Player as ${actualPlayerColor}, Board orientation: ${playerOrientation}`);

        const boardConfig = {
            draggable: true, position: 'start', orientation: playerOrientation,
            onDragStart: onDragStart, onDrop: onDrop, onSnapEnd: onSnapEnd,
            pieceTheme: 'img/chesspieces/wikipedia/{piece}.png',
        };

        if (board) {
            board.orientation(playerOrientation); board.position('start', false);
        } else {
            board = Chessboard('board', boardConfig); $(window).resize(board.resize);
        }

        updateStatus();
        playSound('game-start');

        if (!game.game_over() && game.turn() !== actualPlayerColor) {
            makeAIMove();
        } else {
            statusEl.text("New game started. Your turn.");
        }
    }

    function undoLastPlayerMove() {
        console.log("Undo button clicked.");
        if (!game || game.history().length === 0 || aiIsThinking) {
            console.log("Undo skipped.");
            return;
        }
        
        let movesToUndo = 0;
        // If it's player's turn now, it means AI (or previous player in a 2-player context) just moved.
        // We want to undo that move, and then the player's move before that.
        if (game.turn() === actualPlayerColor) {
            if (game.history().length > 0) { game.undo(); movesToUndo++; } // Undo AI's/Opponent's last move
            if (game.history().length > 0) { game.undo(); movesToUndo++; } // Undo Player's move before that
        } 
        // If it's AI's turn, player just moved. Undo player's move.
        else { 
            if (game.history().length > 0) { game.undo(); movesToUndo++; }
        }
        
        console.log(`Undid ${movesToUndo} half-moves.`);
        if (board) board.position(game.fen());
        updateStatus(); // This will reflect the new current turn
        playSound('undo');
    
        // Important: After undoing, if it becomes the AI's turn again, the AI should make a move.
        // The updateStatus() call might not be enough if makeAIMove() is only called from onSnapEnd.
        // So, explicitly check and call if needed.
        if (!game.game_over() && game.turn() !== actualPlayerColor) {
            console.log("After undo, it's AI's turn. Triggering AI move.");
            makeAIMove();
        }
    }

    // --- Event Listeners & Initial Call ---
    newGameButton.on('click', startNewGame);
    undoButton.on('click', undoLastPlayerMove);

    console.log("Scheduling initial game start (with improved basic AI).");
    setTimeout(function() {
        if (typeof Chess === 'function') {
            startNewGame();
        } else {
            console.error("Delayed Start: Chess object (from chess.js) not defined.");
            statusEl.text("Error: Chess.js failed. Check console/network.");
        }
    }, 300); 
});