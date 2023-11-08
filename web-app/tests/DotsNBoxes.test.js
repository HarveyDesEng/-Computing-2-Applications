import DotsNBoxes from "../DotsNBoxes.js";
import R from "../ramda.js";

const throw_if_invalid = function (board) {

    //Rectangular array.
    if (!Array.isArray(board) || !Array.isArray(board[0])) {
        throw new Error(
            "The board is not a 2D array: " + DotsNBoxes.to_string(board)
        );
    }
    const height = board[0].length;
    const rectangular = R.all(
        (column) => column.length === height,
        board
    );
    if (!rectangular) {
        throw new Error(
            "The board is not rectangular: " + DotsNBoxes.to_string(board)
        );
    }

    //Contains only valid.
    const box_values = [0, 1, 2];
    const contains_box_values = R.pipe(
        R.flatten,
        R.all((slot) => box_values.includes(slot))
    )(board);
    if (!contains_box_values) {
        throw new Error(
            "The board contains invalid box values: " + DotsNBoxes.to_string(board)
        );
    }
};

describe("Validity of empty boards", function () {

    it(`empty_v_board:
    Given that an empty board of vertical lines are made;
    At the begining of the game;
    Then the board is valid.`, function () {
        const empty_v_board = DotsNBoxes.starting_state().v_board;
        throw_if_invalid(empty_v_board);
    });

    it(`empty_h_board
    Given that an empty board of horizonal lines are made;
    At the begining of the game;
    Then the board is valid.`, function () {
        const empty_h_board = DotsNBoxes.starting_state().h_board;
        throw_if_invalid(empty_h_board);
    });

    it(`empty_b_board:
    Given that an empty board of horizonal lines are made;
    At the begining of the game;
    Then the board is valid.`, function () {
        const empty_b_board = DotsNBoxes.starting_state().b_board;
        throw_if_invalid(empty_b_board);
    });
});

describe ("Plies", function () {

    it(`Given that the game is not over,
When the player selects one of the line items,
The resulting board is:
a valid oard that is not ended with the enxt player to ply,
or a valid board that is ended and not won by the next player.`)
});