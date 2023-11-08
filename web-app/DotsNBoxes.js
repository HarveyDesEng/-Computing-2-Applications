import R from "./ramda.js";

/**
 * This is a module for playing Dots and Boxes.
 * @namespace DotsNBoxes
 */
const DotsNBoxes = {};


/**
 * Function that creates boards of chosen widh and height.
 * @function
 * @param {DotsNBoxes.width} width The width of the empty board.
 * @param {DotsNBoxes.height} height The height of the empty board.
 * @returns {DotsNBoxes.board} An empty board of width and height specified by
 * user.
 */

const empty_board = function (width, height) {
    return R.repeat(R.repeat(0, width), height);
};

const width = 5;
const height = 4;

const empty_v_board = empty_board(width + 1, height);
const empty_h_board = empty_board(width, height + 1);
const empty_b_board = empty_board(width, height);


/**
 * Function that creates the starting state of the board which includes acts as
 * an object holding teh vertical, horizontal and box boards as well as a
 * counter for the moves made.
 * @function
 * @returns {DotsNBoxes.state} An Object holding the 3 boards and a counter for
 * the moves made.
 */
DotsNBoxes.starting_state = function () {
    return {
        "v_board": empty_v_board,
        "h_board": empty_h_board,
        "b_board": empty_b_board,
        "moves_made": 0
    };
};

let add_moves = 1;

/**
 * Function that allows the player to make a ply from a vertical line.
 * @function
 * @param {DotsNBoxes.row_index} row_index The x index of line.
 * @param {DotsNBoxes.column_index} column_index The y axis of the line.
 * @returns {DotsNBoxes.game_state} A collection of all boards and moves made.
 */
DotsNBoxes.v_ply = function (row_index, column_index, game_state) {
    if (game_state.v_board[row_index][column_index] === 1) {
        return {
            "v_board": game_state.v_board,
            "h_board": game_state.h_board,
            "b_board": game_state.b_board,
            "moves_made": game_state.moves_made
        };
    } else {
        return {
            "v_board": ply_line_on_board(
                row_index,
                column_index,
                game_state.v_board
            ),
            "h_board": game_state.h_board,
            "b_board": DotsNBoxes.update_box_array_after_v(
                row_index,
                column_index,
                game_state
            ),
            "moves_made": game_state.moves_made + add_moves
        };
    }
};

/**
 * Function that allows the player to make a ply from a horizontal line line.
 * @function
 * @param {DotsNBoxes.row_index} row_index The x index of line.
 * @param {DotsNBoxes.column_index} column_index The y axis of the line.
 * @returns {DotsNBoxes.game_state} A collection of all boards and moves made.
 */
DotsNBoxes.h_ply = function (row_index, column_index, game_state) {
    if (game_state.h_board[row_index][column_index] === 1) {
        return {
            "v_board": game_state.v_board,
            "h_board": game_state.h_board,
            "b_board": game_state.b_board,
            "moves_made": game_state.moves_made
        };
    } else {
        return {
            "v_board": game_state.v_board,
            "h_board": ply_line_on_board(
                row_index,
                column_index,
                game_state.h_board
            ),
            "b_board": DotsNBoxes.update_box_array_after_h(
                row_index,
                column_index,
                game_state
            ),
            "moves_made": game_state.moves_made + add_moves
        };
    }
};

/**
 * Function that determines the player's turn.
 * @function
 * @param {DotsNBoxes.Board} state A collection of all boards and moves made.
 * @returns {Number} The number reperesenting the player to play next..
 */
DotsNBoxes.player_to_ply = function (state) {
    const moves_made = state.moves_made;
    if (moves_made % 2 === 1) {
        return 1;
    }
    if (moves_made % 2 === 0) {
        return 2;
    } else {
        return undefined;
    }
};

const ply_line_on_board = function (row_index, column_index, board) {
    if (board[row_index][column_index] === 1) {
        return board;
    }
    return (R.update(
        row_index,
        R.update(column_index, 1, board[row_index]),
        board
    ));
};


const ply_box_on_board = function (player, row_index, column_index, board) {
    return (R.update(
        row_index,
        R.update(column_index, player, board[row_index]),
        board
    ));
};

/**
 * Function that determines whether a box is made by the player after their ply
 * on a vertical board and then returns a new state.
 * @function
 * @param {DotsNBoxes.row_index} row_index The x index of line.
 * @param {DotsNBoxes.column_index} column_index The y axis of the line.
 * @param {DotsNBoxes.Board} state A collection of all boards and moves made.
 */
DotsNBoxes.update_box_array_after_v = function (r_i, c_i, state) {
    if (
        //both boxes around vertical line
        (state.v_board[r_i][c_i + 1] === 1)
        && (state.h_board[r_i][c_i] === 1)
        && (state.h_board[r_i + 1][c_i] === 1)
        && (state.v_board[r_i][c_i - 1] === 1)
        && (state.h_board[r_i][c_i - 1] === 1)
        && (state.h_board[r_i + 1][c_i - 1] === 1)
    ) {
        const intermediate_board = ply_box_on_board(
            DotsNBoxes.player_to_ply(state),
            r_i,
            c_i,
            state.b_board
        );
        add_moves = 0;
        return ply_box_on_board(
            DotsNBoxes.player_to_ply(state),
            r_i,
            (c_i - 1),
            intermediate_board
        );
    }
    if (
        // box to the right of vertical line
        (state.v_board[r_i][c_i + 1] === 1)
        && (state.h_board[r_i][c_i] === 1)
        && (state.h_board[r_i + 1][c_i] === 1)
    ) {
        add_moves = 0;
        return ply_box_on_board(
            DotsNBoxes.player_to_ply(state),
            r_i,
            c_i,
            state.b_board
        );
    }
    if (
        // box to the left of vertical line
        (state.v_board[r_i][c_i - 1] === 1)
        && (state.h_board[r_i][c_i - 1] === 1)
        && (state.h_board[r_i + 1][c_i - 1] === 1)
    ) {
        add_moves = 0;
        return ply_box_on_board(
            DotsNBoxes.player_to_ply(state),
            r_i,
            (c_i - 1),
            state.b_board
        );
    } else {
        add_moves = 1;
        return state.b_board;
    }
};

/**
 * Function that determines whether a box is made by the player after their ply
 * on a horizontal board and then returns a new state.
 * @function
 * @param {DotsNBoxes.row_index} row_index The x index of line.
 * @param {DotsNBoxes.column_index} column_index The y axis of the line.
 * @param {DotsNBoxes.Board} state A collection of all boards and moves made.
 */
DotsNBoxes.update_box_array_after_h = function (r_i, c_i, state) {
    if (r_i === 0) {
        if (
            // box below horizonal line
            (state.h_board[r_i + 1][c_i] === 1)
            && (state.v_board[r_i][c_i] === 1)
            && (state.v_board[r_i][c_i + 1] === 1)
        ) {
            add_moves = 0;
            return ply_box_on_board(
                DotsNBoxes.player_to_ply(state),
                r_i,
                c_i,
                state.b_board
            );
        } else {
            add_moves = 1;
            return state.b_board;
        }
    }
    if (r_i === height) {
        if (
            // box above horizontal line
            (state.h_board[r_i - 1][c_i] === 1)
            && (state.v_board[r_i - 1][c_i] === 1)
            && (state.v_board[r_i - 1][c_i + 1] === 1)
        ) {
            add_moves = 0;
            return ply_box_on_board(
                DotsNBoxes.player_to_ply(state),
                (r_i - 1),
                c_i,
                state.b_board
            );
        } else {
            add_moves = 1;
            return state.b_board;
        }
    }
    if (
        //both boxes around horizontal line
        (state.h_board[r_i - 1][c_i] === 1)
        && (state.v_board[r_i - 1][c_i] === 1)
        && (state.v_board[r_i - 1][c_i + 1] === 1)
        && (state.h_board[r_i + 1][c_i] === 1)
        && (state.v_board[r_i][c_i] === 1)
        && (state.v_board[r_i][c_i + 1] === 1)
    ) {
        const intermediate_board = ply_box_on_board(
            DotsNBoxes.player_to_ply(state),
            (r_i - 1),
            c_i,
            state.b_board
        );
        add_moves = 0;
        return ply_box_on_board(
            DotsNBoxes.player_to_ply(state),
            r_i,
            c_i,
            intermediate_board
        );
    }
    if (
        // box above horizontal line
        (state.h_board[r_i - 1][c_i] === 1)
        && (state.v_board[r_i - 1][c_i] === 1)
        && (state.v_board[r_i - 1][c_i + 1] === 1)
    ) {
        add_moves = 0;
        return ply_box_on_board(
            DotsNBoxes.player_to_ply(state),
            (r_i - 1),
            c_i,
            state.b_board
        );
    }
    if (
        // box below horizonal line
        (state.h_board[r_i + 1][c_i] === 1)
        && (state.v_board[r_i][c_i] === 1)
        && (state.v_board[r_i][c_i + 1] === 1)
    ) {
        add_moves = 0;
        return ply_box_on_board(
            DotsNBoxes.player_to_ply(state),
            r_i,
            c_i,
            state.b_board
        );
    } else {
        add_moves = 1;
        return state.b_board;
    }
};
/**
* Returns a  function, mapping a board to provided string representations.
* @function
* @param {DotsNBoxes.board} board The board being converted into a string
* representation.
* @returns {function} The string representation.
*/
DotsNBoxes.to_string = (board) => R.pipe(
    R.transpose, // Columns to display vertically.
    R.reverse, // Empty slots at the top.
    R.map(R.join(" ")), // Add a space between each slot.
    R.join("\n") // Stack rows atop each other.
)(board);

/**
 * Function that determines whether a player has won after their ply
 * on a horizontal board and then returns a number representing the results.
 * @function
 * @param {DotsNBoxes.Board} state A collection of all boards and moves made.
 * @returns {Number} The number reperesenting the results of the game.
 */
DotsNBoxes.player_has_won = function (state) {
    if (
        R.count(R.equals(1), R.flatten(state.v_board)) === (
            (width + 1) * (height)
        )
        && R.count(R.equals(1), R.flatten(state.h_board)) === (
            (width) * (height + 1)
        )
    ) {
        if (
            R.count(R.equals(1), R.flatten(state.b_board))
            === R.count(R.equals(2), R.flatten(state.b_board))
        ) {
            console.log("Game is tied");
            return 0;
        }
        if (
            R.count(R.equals(1), R.flatten(state.b_board))
            > R.count(R.equals(2), R.flatten(state.b_board))
        ) {
            console.log("Red has won");
            return 1;
        }
        if (
            R.count(R.equals(1), R.flatten(state.b_board))
            < R.count(R.equals(2), R.flatten(state.b_board))
        ) {
            console.log("Blue has won");
            return 2;
        }
    } else {
        return -1;
    }
};

export default Object.freeze(DotsNBoxes);