import DotsNBoxes from "./DotsNBoxes.js";
import R from "./ramda.js";

// Array of result texts.
const result_text = [
    "Draw!",
    "Blue wins!",
    "Red wins!"
];

const result_dialog = document.getElementById("result_dialog");
const game_result = document.getElementById("game_result");

// Variables defining the amount of rows and columns.
const game_rows = 4;
const game_columns = 5;

// The first assigning of the game state.
let game_state = DotsNBoxes.starting_state();

document.documentElement.style.setProperty("--game-rows", game_rows);
document.documentElement.style.setProperty("--game-columns", game_columns);

// Assigning the game_grid from index.html a variable.
const game_grid = document.getElementById("game_grid");

// Function that make a vertical line element.
const make_v_line = function (r_i, c_i) {
    const v_line = document.createElement("v_line");
    v_line.textContent = `${r_i},${c_i}`;
    v_line.onclick = function () {
        console.log(`v_line: ${r_i},${c_i}`);
        game_state = DotsNBoxes.v_ply(r_i, c_i, game_state);
        console.log(`moves_made: ${game_state.moves_made}`);
        update_v_board();
        update_b_board();
        update_dot_colour();
        if (DotsNBoxes.player_has_won(game_state) !== -1) {
            game_result.innerHTML = result_text[
                DotsNBoxes.player_has_won(game_state)
            ];
            result_dialog.showModal();
        }
    };
    game_grid.append(v_line);
    return v_line;
};

// Function that make a horizontal line element.
const make_h_line = function (r_i, c_i) {
    const h_line = document.createElement("h_line");
    h_line.textContent = `${r_i},${c_i}`;
    h_line.onclick = function () {
        console.log(`h_line: ${r_i},${c_i}`);
        game_state = DotsNBoxes.h_ply(r_i, c_i, game_state);
        console.log(`moves_made: ${game_state.moves_made}`);
        update_h_board();
        update_b_board();
        update_dot_colour();
        if (DotsNBoxes.player_has_won(game_state) !== -1) {
            game_result.innerHTML = result_text[
                DotsNBoxes.player_has_won(game_state)
            ];
            result_dialog.showModal();
        }
    };
    game_grid.append(h_line);
    return h_line;
};

// Function that make a box element.
const make_box = function (r_i, c_i) {
    const box = document.createElement(`box`);
    box.textContent = `${r_i},${c_i}`;
    game_grid.append(box);
};

// Function that make a dot element.
const make_dot = function () {
    const dot = document.createElement(`dot`);
    dot.id = "dot";
    game_grid.append(dot);
};

// The assembly of the game grid to be played on.
R.range(0, (game_rows)).forEach(function (row_index) {
    R.range(0, (game_columns)).forEach(function (column_index) {
        make_dot();
        make_h_line(row_index, column_index);
    });
    make_dot();
    R.range(0, (game_columns)).forEach(function (column_index) {
        make_v_line(row_index, column_index);
        make_box(row_index, column_index);
    });
    make_v_line(row_index, game_columns);
});
R.range(0, (game_columns)).forEach(function (column_index) {
    make_dot();
    make_h_line(game_rows, column_index);
});
make_dot();

// Collecting the horizontal line elements into an array.
const table_h_lines = (
    Array.from(document.getElementsByTagName("h_line"))
);

// Collecting the vertical line elements into an array.
const table_v_lines = (
    Array.from(document.getElementsByTagName("v_line"))
);

// Collecting the box elements into an array.
const table_boxes = (
    Array.from(document.getElementsByTagName("box"))
);

const table_dots = (
    Array.from(document.getElementsByTagName("dot"))
);

// Function that updates the game_grid from the v_board inside the game_state.
const update_v_board = function () {
    game_state.v_board.forEach(function (row, row_index) {
        row.forEach(function (cell, column_index) {
            const table_v_line = (
                table_v_lines[(row_index) * (game_columns + 1) + column_index]
            );
            table_v_line.className = (
                (cell === 1)
                ? "lit"
                : "unlit"
            );
        });
    });
};

// Function that updates the game_grid from the h_board inside the game_state.
const update_h_board = function () {
    game_state.h_board.forEach(function (row, row_index) {
        row.forEach(function (cell, column_index) {
            const table_h_line = (
                table_h_lines[(row_index) * (game_columns) + column_index]
            );
            table_h_line.className = (
                (cell === 1)
                ? "lit"
                : "unlit"
            );
        });
    });
};

// Function that updates the game_grid from the b_board in the game_state.
const update_b_board = function () {
    console.log(game_state.b_board);
    console.log(table_boxes);
    game_state.b_board.forEach(function (row, row_index) {
        row.forEach(function (cell, column_index) {
            const table_box = (
                table_boxes[(row_index) * (game_columns) + column_index]
            );
            if (cell === 1) {
                return table_box.className = "blue";
            }
            if (cell === 2) {
                return table_box.className = "red";
            } else {
                return table_box.className = "unlit";
            }
        });
    });
};

// Function that changes colour of the selected lines depending on the player's
// turn.
const update_line_colour = function () {
    const lines = table_h_lines.concat(table_v_lines);
    lines.forEach(function (line) {
        line.addEventListener("mouseover", function handleMouseOVer() {
            line.style.backgroundColor = (
                (DotsNBoxes.player_to_ply(game_state) === 1)
                ? "#2a2a66"
                : "#662a2a"
            );
        });
        line.addEventListener("mouseout", function handleMouseOut() {
            line.style.backgroundColor = "";
        });
    });
};

// Function that changes colour of the dots depending on the player's
// turn.
const update_dot_colour = function () {
    table_dots.forEach(function (dot) {
        dot.style.backgroundColor = (
            (DotsNBoxes.player_to_ply(game_state) === 1)
            ? "#5757cf"
            : "#cf5757"
        );
    });
};