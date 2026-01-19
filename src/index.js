const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const TILE_SIZE = 32;
const WALL_TILE_SIZE = 16;

/* 
    MAPPING LEGEND:
    0 = Path,
    1 = Wall,
    2 = Player Start,
    3 = Tree,
    4 = Castle,
    5 = Chest,
    6 = Flower Monster,
    7 = Scorpion Monster
*/
let hasKey = false;
let startX, startY;

const tileMap = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 8, 3, 0, 0, 0, 4, 1],
    [1, 0, 3, 3, 3, 3, 3, 3, 3, 0, 3, 3, 3, 3, 3, 3, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 3, 3, 0, 1],
    [1, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 3, 0, 3, 3, 3, 3, 3, 3, 3, 0, 1],
    [1, 0, 3, 3, 0, 3, 0, 3, 0, 3, 3, 0, 3, 6, 3, 0, 0, 3, 0, 0, 6, 3, 6, 0, 0, 3, 7, 0, 0, 1],
    [1, 0, 0, 3, 7, 3, 0, 3, 0, 3, 0, 3, 0, 6, 0, 0, 0, 3, 0, 3, 0, 3, 3, 3, 0, 0, 0, 0, 3, 1],
    [1, 0, 0, 3, 0, 3, 0, 3, 0, 3, 0, 3, 6, 8, 6, 0, 0, 3, 3, 3, 0, 8, 3, 8, 0, 7, 3, 3, 3, 1],
    [1, 0, 3, 3, 0, 0, 0, 3, 0, 3, 0, 3, 0, 0, 0, 0, 0, 8, 0, 0, 0, 0, 3, 0, 0, 3, 3, 7, 0, 1],
    [1, 0, 0, 0, 0, 3, 3, 3, 0, 3, 0, 0, 0, 3, 8, 3, 0, 3, 3, 0, 6, 3, 0, 3, 0, 3, 3, 7, 0, 1],
    [1, 0, 3, 0, 3, 8, 7, 8, 3, 3, 0, 0, 0, 8, 2, 8, 0, 3, 0, 3, 0, 0, 0, 0, 0, 3, 3, 7, 0, 1],
    [1, 7, 3, 0, 3, 7, 0, 7, 3, 0, 3, 0, 0, 3, 0, 3, 0, 3, 0, 0, 0, 0, 3, 0, 6, 7, 6, 7, 0, 1],
    [1, 6, 3, 0, 3, 7, 0, 7, 3, 0, 3, 6, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 3, 0, 0, 3, 3, 0, 0, 1],
    [1, 7, 3, 0, 3, 0, 0, 0, 0, 3, 3, 0, 0, 3, 3, 0, 3, 0, 0, 3, 6, 0, 3, 0, 3, 0, 0, 0, 7, 1],
    [1, 0, 0, 0, 0, 0, 0, 8, 0, 0, 0, 0, 0, 3, 3, 0, 3, 0, 7, 3, 0, 0, 3, 0, 0, 3, 0, 0, 3, 1],
    [1, 0, 3, 0, 0, 0, 3, 3, 3, 3, 3, 0, 3, 3, 0, 0, 3, 0, 0, 3, 0, 0, 3, 3, 0, 3, 3, 0, 0, 1],
    [1, 0, 3, 3, 0, 3, 3, 0, 0, 3, 0, 0, 3, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 3, 0, 1],
    [1, 0, 7, 7, 3, 0, 3, 0, 0, 3, 0, 3, 0, 0, 3, 3, 3, 3, 3, 0, 3, 3, 3, 3, 0, 3, 0, 0, 3, 1],
    [1, 0, 3, 3, 3, 3, 3, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 8, 0, 3, 1],
    [1, 5, 0, 0, 6, 0, 0, 0, 0, 3, 0, 3, 3, 3, 0, 0, 0, 0, 8, 0, 3, 0, 3, 0, 0, 0, 0, 0, 3, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]

];

const MAP_COLS = tileMap[0].length;
const MAP_ROWS = tileMap.length;

canvas.width = MAP_COLS * TILE_SIZE;
canvas.height = MAP_ROWS * TILE_SIZE;

const spriteSheet = new Image();
spriteSheet.src = 'assets/chara1.png';

const terrainTileset = new Image();
terrainTileset.src = 'assets/map0.png';

const monster6 = new Image();
monster6.src = 'assets/monster/monster6.gif';

const monster7 = new Image();
monster7.src = 'assets/monster/monster7.gif';


const player = {
    x: 0,
    y: 0,
    width: TILE_SIZE,
    height: TILE_SIZE,
    spriteX: 0,
    spriteY: 1 * TILE_SIZE
};

for (let row = 0; row < MAP_ROWS; row++) {
    for (let col = 0; col < MAP_COLS; col++) {
        if (tileMap[row][col] === 2) {
            player.x = col * TILE_SIZE;
            player.y = row * TILE_SIZE;
            startX = player.x; // Store start position
            startY = player.y;
            tileMap[row][col] = 0;
        }
    }
}

function drawMaze() {
    const wallSrcX = 7 * WALL_TILE_SIZE;
    const wallSrcY = 0 * WALL_TILE_SIZE;
    const treeSrcX = 7 * WALL_TILE_SIZE;
    const treeSrcY = 1 * WALL_TILE_SIZE;
    const bolderSrcX = 11 * WALL_TILE_SIZE;
    const bolderSrcY = 1 * WALL_TILE_SIZE;
    const castleSrcX = 4 * WALL_TILE_SIZE;
    const castleSrcY = 1 * WALL_TILE_SIZE;
    const chestSrcX = 9 * WALL_TILE_SIZE;
    const chestSrcY = 1 * WALL_TILE_SIZE;

    for (let row = 0; row < MAP_ROWS; row++) {
        for (let col = 0; col < MAP_COLS; col++) {
            const tile = tileMap[row][col];
            const destX = col * TILE_SIZE;
            const destY = row * TILE_SIZE;

            if (tile === 1) { // WALL
                ctx.drawImage(terrainTileset, wallSrcX, wallSrcY, WALL_TILE_SIZE, WALL_TILE_SIZE, destX, destY, TILE_SIZE, TILE_SIZE);
            } else if (tile === 3) { // TREE
                ctx.drawImage(terrainTileset, treeSrcX, treeSrcY, WALL_TILE_SIZE, WALL_TILE_SIZE, destX, destY, TILE_SIZE, TILE_SIZE);
            } else if (tile === 4) { // CASTLE
                ctx.drawImage(terrainTileset, castleSrcX, castleSrcY, WALL_TILE_SIZE, WALL_TILE_SIZE, destX, destY, TILE_SIZE, TILE_SIZE);
            } else if (tile === 5) { // CHEST
                ctx.drawImage(terrainTileset, chestSrcX, chestSrcY, WALL_TILE_SIZE, WALL_TILE_SIZE, destX, destY, TILE_SIZE, TILE_SIZE);
            } else if (tile === 6) { // Monster 6
                ctx.drawImage(monster6, 124, 0, 70, 70, destX, destY, TILE_SIZE, TILE_SIZE);
            } else if (tile === 7) { // Monster 7
                ctx.drawImage(monster7, 144, 0, 52, 52, destX, destY, TILE_SIZE, TILE_SIZE);
            } else if (tile === 8) { // Rock Bolder
                ctx.drawImage(terrainTileset, bolderSrcX, bolderSrcY, WALL_TILE_SIZE, WALL_TILE_SIZE, destX, destY, TILE_SIZE, TILE_SIZE);
            }

        }
    }
}

function drawPlayer() {
    ctx.drawImage(spriteSheet, player.spriteX, player.spriteY, TILE_SIZE, TILE_SIZE, player.x, player.y, player.width, player.height);
}

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawMaze();
    drawPlayer();
    requestAnimationFrame(update);
}

let assetsLoaded = 0;
const totalAssets = 4;
function assetLoaded() {
    assetsLoaded++;
    if (assetsLoaded === totalAssets) {
        const newMapRows = tileMap.length;
        const newMapCols = tileMap[0].length;
        canvas.width = newMapCols * TILE_SIZE;
        canvas.height = newMapRows * TILE_SIZE;
        update();
    }
}

spriteSheet.onload = assetLoaded;
terrainTileset.onload = assetLoaded;
monster6.onload = assetLoaded;
monster7.onload = assetLoaded;


/*
window.addEventListener('keydown', (e) => {
    let nextX = player.x;
    let nextY = player.y;

    switch (e.key) {
        case 'ArrowUp': nextY -= TILE_SIZE; break;
        case 'ArrowDown': nextY += TILE_SIZE; break;
        case 'ArrowLeft': nextX -= TILE_SIZE; break;
        case 'ArrowRight': nextX += TILE_SIZE; break;
        default: return;
    }

    const nextGridCol = Math.floor(nextX / TILE_SIZE);
    const nextGridRow = Math.floor(nextY / TILE_SIZE);

    if (nextGridCol >= 0 && nextGridCol < MAP_COLS && nextGridRow >= 0 && nextGridRow < MAP_ROWS) {
        const nextTile = tileMap[nextGridRow][nextGridCol];

        if (nextTile === 0) { // Path
            player.x = nextX;
            player.y = nextY;
        } else if (nextTile === 5) { // Chest
            hasKey = true;
            tileMap[nextGridRow][nextGridCol] = 0;
            alert("Key Found!");
            player.x = nextX;
            player.y = nextY;
        } else if (nextTile === 4) { // Castle
            if (hasKey) {
                alert("YOU WIN!");
            } else {
                alert("Locked! Find the Chest.");
            }
        } else if (nextTile === 6 || nextTile === 7) { // Monster collision
            alert("GAME OVER! You were eaten.");
            player.x = startX;
            player.y = startY;
            hasKey = false;
        }
    }
});
*/
