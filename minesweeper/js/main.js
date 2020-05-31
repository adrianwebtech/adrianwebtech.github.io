var ind = 0

var easy_board_size_px = 300;
var easy_cell_size_px = 30;
var easy_board_cells_num = 10;
var easy_bomb_num = 10;
var easy_path_flag = "M 13.65625 3.859375 C 11.5625 3.859375 9.832031 2.5 7.199219 2.5 C 6.226562 2.5 5.351562 2.671875 4.542969 2.96875 C 4.65625 2.675781 4.703125 2.363281 4.683594 2.050781 C 4.613281 0.9375 3.703125 0.046875 2.589844 0 C 1.339844 -0.0507812 0.3125 0.949219 0.3125 2.1875 C 0.3125 2.929688 0.683594 3.585938 1.25 3.980469 L 1.25 19.0625 C 1.25 19.582031 1.667969 20 2.1875 20 L 2.8125 20 C 3.332031 20 3.75 19.582031 3.75 19.0625 L 3.75 15.375 C 4.855469 14.902344 6.234375 14.511719 8.21875 14.511719 C 10.3125 14.511719 12.042969 15.871094 14.675781 15.871094 C 16.554688 15.871094 18.058594 15.234375 19.460938 14.273438 C 19.796875 14.042969 20 13.65625 20 13.242188 L 20 3.746094 C 20 2.835938 19.050781 2.230469 18.222656 2.613281 C 16.882812 3.238281 15.238281 3.859375 13.65625 3.859375 Z M 13.65625 3.859375"

var medium_board_size_px = 432;
var medium_cell_size_px = 24;
var medium_board_cells_num = 18;
var medium_bomb_num = 40;
var medium_path_flag = "M 9.558594 2.699219 C 8.09375 2.699219 6.882812 1.75 5.039062 1.75 C 4.359375 1.75 3.746094 1.871094 3.179688 2.078125 C 3.257812 1.875 3.292969 1.652344 3.277344 1.433594 C 3.230469 0.65625 2.59375 0.03125 1.8125 0 C 0.9375 -0.0351562 0.21875 0.664062 0.21875 1.53125 C 0.21875 2.050781 0.476562 2.511719 0.875 2.789062 L 0.875 13.34375 C 0.875 13.707031 1.167969 14 1.53125 14 L 1.96875 14 C 2.332031 14 2.625 13.707031 2.625 13.34375 L 2.625 10.761719 C 3.398438 10.433594 4.363281 10.15625 5.753906 10.15625 C 7.21875 10.15625 8.429688 11.109375 10.273438 11.109375 C 11.589844 11.109375 12.640625 10.664062 13.621094 9.992188 C 13.859375 9.828125 14 9.558594 14 9.269531 L 14 2.625 C 14 1.984375 13.335938 1.5625 12.757812 1.832031 C 11.816406 2.265625 10.664062 2.699219 9.558594 2.699219 Z M 9.558594 2.699219";

var hard_board_size_px = 480;
var hard_cell_size_px = 20;
var hard_board_cells_num = 24;
var hard_bomb_num = 99;
var hard_path_flag = "M 6.828125 1.929688 C 5.78125 1.929688 4.917969 1.25 3.601562 1.25 C 3.113281 1.25 2.675781 1.335938 2.273438 1.484375 C 2.328125 1.339844 2.351562 1.179688 2.339844 1.023438 C 2.308594 0.46875 1.851562 0.0234375 1.296875 0 C 0.671875 -0.0234375 0.15625 0.472656 0.15625 1.09375 C 0.15625 1.464844 0.339844 1.792969 0.625 1.992188 L 0.625 9.53125 C 0.625 9.789062 0.835938 10 1.09375 10 L 1.40625 10 C 1.664062 10 1.875 9.789062 1.875 9.53125 L 1.875 7.6875 C 2.429688 7.453125 3.117188 7.253906 4.109375 7.253906 C 5.15625 7.253906 6.019531 7.933594 7.335938 7.933594 C 8.277344 7.933594 9.03125 7.617188 9.730469 7.136719 C 9.898438 7.019531 10 6.828125 10 6.621094 L 10 1.875 C 10 1.417969 9.527344 1.113281 9.113281 1.308594 C 8.441406 1.617188 7.617188 1.929688 6.828125 1.929688 Z M 6.828125 1.929688";

// Mouse object
var mouse = {
    x: 0,
    y: 0,
    row: 0,
    col: 0,
    state: 'left',
    clickstatus: 'none',
    rightclick: false,
    mousedown_rc: '',
    moving: false,
    hoverTransition: -0.005,
}

// Game
var game = {
    state: 'load',
    startclick: {
        row: 0,
        col: 0,
    },
    difficulty: '',
    grid: {},
    canvas: {
        offset_left: 0,
        offset_top: 0,
    },
    board_size_px: 0,
    cell_size_px: 0,
    board_cells_num: 0,
    path_flag: 0,
    bomb_num: 0,
    colormousedown: 'rgb(0, 0, 0, ',
    colorhover: 'rgb(255, 255, 255, ',
    colorshow: 'rgb(220, 221, 225, ',
    colornum: {
        1: 'rgb(0, 0, 255)',
        2: 'rgb(0, 98, 102)',
        3: 'rgb(183, 21, 64)',
        4: 'rgb(142, 68, 173)',
        5: 'rgb(230, 126, 34)',
        6: 'rgb(44, 62, 80)',
        7: 'rgb(241, 196, 15)',
        8: 'rgb(235, 47, 6)'
    }
}

// Canvas
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');


// Keep running non-stop
setInterval(() => {
    updateData();
    renderCanvas();
}, 0);

function updateData() {
    mouseUpdate();
    gameUpdate();
}

function renderCanvas() {
    updateCellHoverDisplay();
    updateCellMouseDownDisplay();
}

function updateCellHoverDisplay() {

    if (mouse.moving == true && mouse.clickstatus == 'none') {
        var r = mouse.row;
        var c = mouse.col;
        setAllCellsProperty('hover', false);

        if (game.state == 'initial' || game.state == 'idle') {
            if (getCellProperties(r, c).show == false && getCellProperties(r, c).flag == false) {
                // Draw cell hover during idle state
                getCellProperties(r, c).hover = true;
                setHoverOverlay(r, c);
                clearCell(r, c);
                drawCell(r, c);
                mouse.moving = false;
            }
        }
    }

    if (game.state != 'gameover') {
        if (mouse.clickstatus == 'down') {
            setAllCellsProperty('alphahover', 0);
            for (let row = 0; row < game.board_cells_num; row++) {
                for (let col = 0; col < game.board_cells_num; col++) {
                    if (getCellProperties(row, col).show == false && getCellProperties(row, col).flag == false) {
                        clearCell(row, col);
                        drawCell(row, col);
                    }
                }
            }
        }
        else {
            setAllCellsProperty('alphahover', mouse.hoverTransition, 'nolessthan0');
            for (let row = 0; row < game.board_cells_num; row++) {
                for (let col = 0; col < game.board_cells_num; col++) {
                    if (getCellProperties(row, col).alphahover >= 0 && getCellProperties(row, col).hover == false && getCellProperties(row, col).show == false && getCellProperties(row, col).flag == false) {
                        clearCell(row, col);
                        drawCell(row, col);
                    }
                }
            }
        }
    }
}

function updateCellMouseDownDisplay() {
    if (mouse.clickstatus == 'down' && mouse.state == 'left') {
        var r = game.grid[mouse.mousedown_rc].row;
        var c = game.grid[mouse.mousedown_rc].col;

        if (game.state == 'initial' || game.state == 'idle') {
            if (getCellProperties(r, c).show == false && getCellProperties(r, c).flag == false) {
                // Draw cell hover during idle state
                setMouseDownOverlay(r, c);
                clearCell(r, c);
                drawCell(r, c, 'colormousedown', 'alphamousedown');
            }
        }
    }

    if (game.state != 'gameover') {
        if (mouse.clickstatus == 'none') {
            setAllCellsProperty('alphamousedown', 0);
        }
        else {
            setAllCellsProperty('alphamousedown', mouse.hoverTransition, 'nolessthan0');
            for (let row = 0; row < game.board_cells_num; row++) {
                for (let col = 0; col < game.board_cells_num; col++) {
                    if (getCellProperties(row, col).alphahover >= 0 && getCellProperties(row, col).hover == false && getCellProperties(row, col).show == false && getCellProperties(row, col).flag == false) {
                        clearCell(row, col);
                        drawCell(row, col, 'colormousedown', 'alphamousedown');
                    }
                }
            }
        }
    }
}

function mouseUpdate() {

    if (mouse.clickstatus == 'down') {
        if (mouse.state == 'left') {
            setAllCellsProperty('mousedown', false);
            mouse.mousedown_rc = getRowColStr(mouse.row, mouse.col);
            game.grid[mouse.mousedown_rc].mousedown = true;
            // queryWhichCells('mousedown', true, true);
        }
    }

    if (mouse.clickstatus == 'up') {
        mouse.clickstatus = 'none';
        if (mouse.state == 'left') {
            if (game.state == 'initial') { game.state = 'initialshowing'; }
            if (game.state == 'idle') { game.state = 'click'; }
            if (game.state == 'gameover') { console.log('cannot do anything'); }
        }

        if (mouse.state == 'right') {
            if (game.state == 'idle') {
                mouse.rightclick = true;
                setFlag(mouse.row, mouse.col);
                mouse.rightclick = false;
            }
            if (game.state == 'gameover') { console.log('cannot do anything'); }
        }
    }
}

function gameUpdate() {
    if (game.state == 'load') {
        // Initialise during website load
        clearBoard();
        setDifficulty('medium');
        setBoard();
        game.state = 'initial';
    }

    if (game.state == 'initialshowing') {
        // Initialise when click on game canvas for the first time
        initCellsAndBombs();
        startTimer();

        game.state = 'click';
    }

    if (game.state == 'idle') {
        // Code animation logic during idle mode
    }

    // Code game logic for a click
    if (game.state == 'click') {

        game.state = 'computing';
        computeCellClick(mouse.mousedown_rc);
        // queryWhichCells("newshow", true, true);
        updateCellShow();

        setAllCellsProperty("newshow", false);
        computeBombClick(mouse.mousedown_rc);

        // Check whether player press on bomb cell
        game.state = game.state == 'gameover' ? 'gameover' : 'idle';

    }

}

function computeCellClick(rc_str, i) {

    var surround = [];
    // console.log(rc_str + ':' + game.grid[rc_str].flag + ':' + game.grid[rc_str].show + ':' + game.grid[rc_str].bomb);



    // If the cell has no flag and the cell has not been shown
    if (game.grid[rc_str].flag == false && game.grid[rc_str].show == false && game.grid[rc_str].bomb == false) {
        game.grid[rc_str].show = true;
        game.grid[rc_str].newshow = true;
        r = game.grid[rc_str].row;
        c = game.grid[rc_str].col;

        if (game.grid[rc_str].bombnum != 0) {
            return;
        }

        if ((r - 1 >= 0 && c - 1 >= 0)) {
            if (game.grid[getRowColStr(r - 1, c - 1)].show == false) {
                surround.push({ row: r - 1, col: c - 1 });
            }
        }

        if ((r - 1 >= 0)) {
            if (game.grid[getRowColStr(r - 1, c)].show == false) {
                surround.push({ row: r - 1, col: c });
            }
        }

        if ((c - 1 >= 0)) {
            if (game.grid[getRowColStr(r, c - 1)].show == false) {
                surround.push({ row: r, col: c - 1 });
            }
        }

        if ((r + 1 <= game.board_cells_num - 1 && c + 1 <= game.board_cells_num - 1)) {
            if (game.grid[getRowColStr(r + 1, c + 1)].show == false) {
                surround.push({ row: r + 1, col: c + 1 });
            }
        }

        if ((c + 1 <= game.board_cells_num - 1)) {
            if (game.grid[getRowColStr(r, c + 1)].show == false) {
                surround.push({ row: r, col: c + 1 });
            }
        }

        if ((r + 1 <= game.board_cells_num - 1)) {
            if (game.grid[getRowColStr(r + 1, c)].show == false) {
                surround.push({ row: r + 1, col: c });
            }
        }

        if ((r - 1 >= 0 && c + 1 <= game.board_cells_num - 1)) {
            if (game.grid[getRowColStr(r - 1, c + 1)].show == false) {
                surround.push({ row: r - 1, col: c + 1 });
            }
        }

        if ((r + 1 <= game.board_cells_num - 1 && c - 1 >= 0)) {
            if (game.grid[getRowColStr(r + 1, c - 1)].show == false) {
                surround.push({ row: r + 1, col: c - 1 });
            }
        }

        for (let index = 0; index < surround.length; index++) {
            var surround_rc = getRowColStr(surround[index].row, surround[index].col);
            // console.log(surround_rc);
            if (game.grid[surround_rc].bombnum == 0) {
                // console.log("going in : " + i);
                computeCellClick(surround_rc, i + 1);
                // console.log("coming back out : " + i + '|' + surround_rc + " becomes show: true");
            }
            else {
                game.grid[surround_rc].show = true;
                game.grid[surround_rc].newshow = true;
            }
        }
        return;
    }

    return;
}

function updateCellShow() {
    var cellstoshow = queryWhichCells("newshow", true);
    cellstoshow.forEach(element => {
        var r = game.grid[element].row;
        var c = game.grid[element].col;
        clearCell(r, c);
        drawCell(r, c, 'colorshow', 'alphashow');

        if (game.grid[element].bombnum > 0) {
            drawText(r, c, game.grid[element].bombnum);
        }
    });

    var cellsShown = queryWhichCells("show", true);
    var numSafeCells = game.board_cells_num * game.board_cells_num - game.bomb_num;
    if (cellsShown.length == numSafeCells) {
        game.state = 'win';
        console.log("Win the game!");
    }
}

function computeBombClick(rc_str) {
    if (game.grid[rc_str].flag == false && game.grid[rc_str].bomb == true) {
        console.log('game over');
        var bombLocations = queryWhichCells("bomb", true);

        bombLocations.forEach(element => {
            var r = game.grid[element].row;
            var c = game.grid[element].col;
            drawBomb(r, c);
        });
        game.state = 'gameover';
    }
}

// Set flags
function setFlag(r, c) {
    if (getCellProperties(r, c).show == false) {
        getCellProperties(r, c).flag = !getCellProperties(r, c).flag;
        // console.log(getRowColStr(r, c) + ': ' + getCellProperties(r, c).flag);
        if (getCellProperties(r, c).flag == true) {
            drawFlag(r, c);
        }
        else {
            clearCell(r, c);
            drawCell(r, c);
        }
    }
}

// Keep track of mouse movement
$("#canvas").mousemove(function (mouse_event) {
    mouse = getMousePosition(mouse, mouse_event);
    mouse = getMouseRowCol(mouse);
    mouse.moving = true;
});

// Mouse up 
$("#canvas").mouseup(function () {
    mouse.clickstatus = 'up';
})

// Mouse down
$('#canvas').mousedown(function (event) {
    mouse.clickstatus = 'down';
    switch (event.which) {
        case 1:
            mouse.state = 'left';
            break;
        case 2:
            mouse.state = 'middle';
            break;
        case 3:
            mouse.state = 'right';
            break;
        default:
            alert('You have a strange Mouse!');
    }
});

// Clear all
function clearBoard() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// Set board game
function setBoard() {
    ctx.canvas.width = game.board_size_px;
    ctx.canvas.height = game.board_size_px;

    for (let row = 0; row < game.board_cells_num; row++) {
        for (let col = 0; col < game.board_cells_num; col++) {
            initCellProperties(row, col)
        }
    }

    drawAllCells();

    game.canvas.offset_top = Math.floor($("#canvas").offset().top);
    game.canvas.offset_left = Math.floor($("#canvas").offset().left);
}

// Set difficulty
function setDifficulty(difficulty) {
    game.difficulty = difficulty;

    switch (difficulty) {
        case 'easy':
            game.board_cells_num = easy_board_cells_num;
            game.board_size_px = easy_board_size_px;
            game.cell_size_px = easy_cell_size_px;
            game.path_flag = easy_path_flag;
            game.bomb_num = easy_bomb_num;
            break;

        case 'medium':
            game.board_cells_num = medium_board_cells_num;
            game.board_size_px = medium_board_size_px;
            game.cell_size_px = medium_cell_size_px;
            game.path_flag = medium_path_flag;
            game.bomb_num = medium_bomb_num;
            break;

        case 'hard':
            game.board_cells_num = hard_board_cells_num;
            game.board_size_px = hard_board_size_px;
            game.cell_size_px = hard_cell_size_px;
            game.path_flag = hard_path_flag;
            game.bomb_num = hard_bomb_num;
            break;

        default:
            break;
    }
}

// Initialise upon mouse click to start game
function initCellsAndBombs() {
    console.log('set bomb');

    game.startclick.row = mouse.row;
    game.startclick.col = mouse.col;

    var rc_str = getRowColStr(game.startclick.row, game.startclick.col);

    game.grid[rc_str].starting = true;

    // Fallback row and column if out of range
    let fallback = { row: game.startclick.row, col: game.startclick.col };

    // Starting cell must not have bomb
    getCellProperties(game.startclick.row, game.startclick.col, fallback).starting = true;
    getCellProperties(game.startclick.row, game.startclick.col, fallback).impossible = true;

    // console.log('starting : ' + rc_str);

    // Surrounding cells around starting cell must not have bomb
    getCellProperties(game.startclick.row - 1, game.startclick.col - 1, fallback).impossible = true;
    getCellProperties(game.startclick.row - 1, game.startclick.col, fallback).impossible = true;
    getCellProperties(game.startclick.row - 1, game.startclick.col + 1, fallback).impossible = true;
    getCellProperties(game.startclick.row, game.startclick.col - 1, fallback).impossible = true;
    getCellProperties(game.startclick.row, game.startclick.col + 1, fallback).impossible = true;
    getCellProperties(game.startclick.row + 1, game.startclick.col - 1, fallback).impossible = true;
    getCellProperties(game.startclick.row + 1, game.startclick.col, fallback).impossible = true;
    getCellProperties(game.startclick.row + 1, game.startclick.col + 1, fallback).impossible = true;

    setBombLocations();
}

// Define bomb locations
function setBombLocations() {
    // Create bombs
    for (let index = 0; index < game.bomb_num; index++) {
        // ind++;
        setBomb();
    }

    // Set bomb cell property - bombnum to false
    queryWhichCells("bomb", true).forEach(element => {
        game.grid[element].bombnum = 0;
    });

    // queryWhichCells("bombnum", 0, true);
    // queryWhichCells("bombnum", 1, true);
    // queryWhichCells("bombnum", 2, true);
    // queryWhichCells("bombnum", 3, true);
    // queryWhichCells("bombnum", 4, true);
    // queryWhichCells("bombnum", 5, true);
    // queryWhichCells("bombnum", 6, true);
    // queryWhichCells("bombnum", 7, true);
    // queryWhichCells("bombnum", 8, true);
}

function setBomb() {
    // Check whether cell property - impossible is set to true
    var rd = () => { return Math.floor(Math.random() * (game.board_cells_num - 1)) };
    var r = rd();
    var c = rd();
    var rc_str = 'r' + r.toString() + 'c' + c.toString();
    var contain_bomb = queryWhichCells("bomb", true).includes(rc_str);

    while (getCellProperties(r, c).impossible == true || contain_bomb == true) {
        r = rd();
        c = rd();
        rc_str = 'r' + r.toString() + 'c' + c.toString();
        contain_bomb = queryWhichCells("bomb", true).includes(rc_str);
    }

    // Set cell property - bomb to true
    getCellProperties(r, c).bomb = true;
    // console.log(ind + ':' + rc_str + ':' + contain_bomb + ':' + getCellProperties(r, c).bomb);

    var fallback = { row: r, col: c };

    // Increase surrounding cell property - bombnum by 1
    getCellProperties(r - 1, c - 1, fallback).bombnum++;
    getCellProperties(r - 1, c, fallback).bombnum++;
    getCellProperties(r - 1, c + 1, fallback).bombnum++;
    getCellProperties(r, c - 1, fallback).bombnum++;
    getCellProperties(r, c + 1, fallback).bombnum++;
    getCellProperties(r + 1, c - 1, fallback).bombnum++;
    getCellProperties(r + 1, c, fallback).bombnum++;
    getCellProperties(r + 1, c + 1, fallback).bombnum++;
}

function startTimer() {
    console.log('set timer');
}

// Clear cell
function clearCell(row, col) {
    var x = col * game.cell_size_px;
    var y = row * game.cell_size_px;
    ctx.clearRect(x, y, game.cell_size_px, game.cell_size_px);
}

// Draw cell
function drawCell(row, col, hover_mousedown_color_property = 'colorhover', hover_mousedown_alpha_property = 'alphahover') {

    // Create radial color
    offset_x = game.cell_size_px * col + (game.cell_size_px / 2);
    offset_y = game.cell_size_px * row + (game.cell_size_px / 2);
    var grad = ctx.createRadialGradient(offset_x, offset_y, 0, offset_x, offset_y, game.cell_size_px / 0.5);

    grad.addColorStop(0, '#00cec9');
    grad.addColorStop(1, '#2d3436');
    ctx.fillStyle = grad;

    var x = col * game.cell_size_px;
    var y = row * game.cell_size_px;

    // ctx.clearRect(x, y, game.cell_size_px, game.cell_size_px);
    ctx.fillRect(x, y, game.cell_size_px, game.cell_size_px);

    ctx.fillStyle = game[hover_mousedown_color_property].concat(game.grid[getRowColStr(row, col)][hover_mousedown_alpha_property].toString(), ')');
    ctx.fillRect(x, y, game.cell_size_px, game.cell_size_px);
}

// Draw Text
function drawText(row, col, num) {
    var x = col * game.cell_size_px + game.cell_size_px / 2;
    var y = row * game.cell_size_px + game.cell_size_px / 2;

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = 'bold '.concat((game.cell_size_px - 7).toString(), "px Calibri");
    ctx.fillStyle = game.colornum[num];
    ctx.fillText(num.toString(), x, y);
}

// Draw Bomb
function drawBomb(row, col) {
    var x = col * game.cell_size_px + game.cell_size_px / 2;
    var y = row * game.cell_size_px + game.cell_size_px / 2;

    ctx.fillStyle = 'rgb(44, 58, 71)';
    ctx.beginPath();
    ctx.arc(x, y, game.cell_size_px / 3, 0, 2 * Math.PI);
    ctx.fill();
}

// Draw all cells
function drawAllCells() {
    for (let row = 0; row < game.board_cells_num; row++) {
        for (let col = 0; col < game.board_cells_num; col++) {
            drawCell(row, col);
        }
    }
}

// Hover transparency
function setHoverOverlay(row, col) {
    setCellProperty(row, col, "alphahover", 0.2);
}

// Mousedown transparency
function setMouseDownOverlay(row, col) {
    setCellProperty(row, col, "alphamousedown", 0.2);
}

// Draw flags at row and column
function drawFlag(row, col) {
    var path = new Path2D(game.path_flag);
    ctx.fillStyle = "#d63031";
    x_px = col * game.cell_size_px + game.cell_size_px / 7;
    y_px = row * game.cell_size_px + game.cell_size_px / 7;
    ctx.translate(x_px, y_px);
    ctx.fill(path);
    ctx.translate(-x_px, -y_px);
}

// Mouse position
function getMousePosition(m, e) {
    var left = game.canvas.offset_left;
    var top = game.canvas.offset_top;

    m.x = e.clientX - left < 0 ? 0 : e.clientX - left > game.board_size_px - 1 ? game.board_size_px - 1 : e.clientX - left;
    m.y = e.clientY - top < 0 ? 0 : e.clientY - top > game.board_size_px - 1 ? game.board_size_px - 1 : e.clientY - top;

    return m;
}

// Mouse row and column
function getMouseRowCol(m) {
    m.col = Math.floor(m.x / game.cell_size_px);
    m.row = Math.floor(m.y / game.cell_size_px);

    return m;
}

// Cell Properties
function initCellProperties(r, c) {
    var rc_str = 'r' + r.toString() + 'c' + c.toString();
    game.grid[rc_str] = {
        flag: false,
        hover: false,
        bomb: false,
        mousedown: false,
        show: false,
        newshow: false,
        starting: false,
        impossible: false,
        bombnum: 0,
        row: r,
        col: c,
        alphahover: 0,
        alphamousedown: 0,
        alphashow: 0.4,
    }
}

function setCellProperty(row, col, property, value) {
    var rc_str = 'r' + row.toString() + 'c' + col.toString();
    game.grid[rc_str][property] = value;
}

function setAllCellsProperty(property, value, reuse = 'no') {
    for (var k in game.grid) {
        if (reuse == 'no') {
            game.grid[k][property] = value;
        }
        else if (reuse == 'nolessthan0') {
            game.grid[k][property] = game.grid[k][property] + value < 0 ? 0 : game.grid[k][property] + value;
        }
    }
}

function getCellProperties(row, col, fallback = { row: 0, col: 0 }) {
    var r = fallback.row;
    var c = fallback.col;

    if ((row >= 0 && col >= 0) && (row < game.board_cells_num && col < game.board_cells_num)) {
        r = row;
        c = col;
    }

    var rc_str = 'r' + r.toString() + 'c' + c.toString();
    return game.grid[rc_str];
}

function getRowColStr(row, col) {
    return 'r' + row.toString() + 'c' + col.toString();
}

function queryWhichCells(property, condition, verbose = false) {
    var queryresults = [];
    for (var k in game.grid) {
        if (game.grid[k][property] == condition) {
            queryresults.push(k);
        }
    }

    if (verbose) {
        console.log(queryresults);
    }

    return queryresults;
}