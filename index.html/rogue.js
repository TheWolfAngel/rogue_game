
// ========================================
// CARTE DU DONJON
// ========================================

const mapWidth = 60;
const mapHeight = 30;

let map = [];


// ========================================
// JOUEUR
// ========================================

let player = {
    x: 0,
    y: 0
};

// ========================================
// ENNEMIS
// ========================================
let ennemis = [];

// ========================================
// CREER UNE CARTE VIDE
// ========================================

function createEmptyMap() {

    map = [];

    for (let y = 0; y < mapHeight; y++) {

        let row = [];

        for (let x = 0; x < mapWidth; x++) {

            row.push("#");
        }

        map.push(row);
    }
}


// ========================================
// CREER UNE SALLE
// ========================================

function createRoom(room) {

    for (let y = room.y; y < room.y + room.height; y++) {

        for (let x = room.x; x < room.x + room.width; x++) {

            map[y][x] = ".";
        }
    }
}


// ========================================
// CREUSER UNE CASE
// ========================================

function dig(x, y) {

    if (
        x > 0 &&
        x < mapWidth - 1 &&
        y > 0 &&
        y < mapHeight - 1
    ) {

        map[y][x] = ".";
    }
}


// ========================================
// CREER UN CORRIDOR HORIZONTAL
// ========================================

function createHorizontalCorridor(x1, x2, y) {

    let start = Math.min(x1, x2);
    let end = Math.max(x1, x2);

    for (let x = start; x <= end; x++) {

        dig(x, y);
    }
}


// ========================================
// CREER UN CORRIDOR VERTICAL
// ========================================

function createVerticalCorridor(y1, y2, x) {

    let start = Math.min(y1, y2);
    let end = Math.max(y1, y2);

    for (let y = start; y <= end; y++) {

        dig(x, y);
    }
}


// ========================================
// VERIFIER SI UNE SALLE CHEVAUCHE UNE AUTRE
// ========================================

function roomOverlaps(room, rooms) {

    for (let otherRoom of rooms) {

        if (
            room.x < otherRoom.x + otherRoom.width + 1 &&
            room.x + room.width + 1 > otherRoom.x &&
            room.y < otherRoom.y + otherRoom.height + 1 &&
            room.y + room.height + 1 > otherRoom.y
        ) {

            return true;
        }
    }

    return false;
}

// ========================================
// GERENATION D'ENNEMIS 
// ========================================
function createEnemy(x, y){
    let enemy={
        x: x,
        y: y,
        hp:3,
        damage: 1,
        gold: 10,
    };
    enemies.push(enemy);
}

// ========================================
// GENERER LES SALLES
// ========================================

function generateRooms() {

    createEmptyMap();

    let rooms = [];

    let attempts = 0;


    // Essayer de créer 8 salles

    while (rooms.length < 9 && attempts < 100) {

        attempts++;


        let width =
            Math.floor(Math.random() * 6) + 5;

        let height =
            Math.floor(Math.random() * 4) + 4;


        let x =
            Math.floor(
                Math.random() * (mapWidth - width - 2)
            ) + 1;


        let y =
            Math.floor(
                Math.random() * (mapHeight - height - 2)
            ) + 1;


        let room = {
            x: x,
            y: y,
            width: width,
            height: height
        };


        // Vérifier si la salle est valide

        if (!roomOverlaps(room, rooms)) {

            createRoom(room);

            rooms.push(room);
        }
    }


    // ========================================
    // RELIER LES SALLES
    // ========================================

    for (let i = 1; i < rooms.length; i++) {

        let previousRoom = rooms[i - 1];
        let currentRoom = rooms[i];


        // Centre de l'ancienne salle

        let previousCenterX =
            Math.floor(
                previousRoom.x +
                previousRoom.width / 2
            );

        let previousCenterY =
            Math.floor(
                previousRoom.y +
                previousRoom.height / 2
            );


        // Centre de la nouvelle salle

        let currentCenterX =
            Math.floor(
                currentRoom.x +
                currentRoom.width / 2
            );

        let currentCenterY =
            Math.floor(
                currentRoom.y +
                currentRoom.height / 2
            );


        // Corridor horizontal

        createHorizontalCorridor(
            previousCenterX,
            currentCenterX,
            previousCenterY
        );


        // Corridor vertical

        createVerticalCorridor(
            previousCenterY,
            currentCenterY,
            currentCenterX
        );
    }


    return rooms;
}


// ========================================
// PLACER LE JOUEUR
// ========================================

function placePlayer(rooms) {

    let firstRoom = rooms[0];


    player.x =
        Math.floor(
            firstRoom.x +
            firstRoom.width / 2
        );
    player.y =
        Math.floor(
            firstRoom.y +
            firstRoom.height / 2
        );
}

// ========================================
// PLACER LES ENNEMI
// ========================================
function placeEnemies(rooms) {
    enemies = [];
    for (let i = 1; i < rooms.length; i++) {
        let room = rooms[i];
        let enemyX =
            Math.floor(
                room.x + room.width / 2
            );
        let enemyY =
            Math.floor(
                room.y + room.height / 2
            );
        if (
            enemyX !== player.x ||
            enemyY !== player.y
        ) {
            createEnemy(enemyX, enemyY);
        }
    }
}

// ========================================
// VERIFICATION POSITION DES ENNEMIS
// ========================================
function isEnemyAt(x, y) {
    for (let enemy of enemies) {
        if (
            enemy.x === x &&
            enemy.y === y
        ) {
            return true;
        }
    }
    return false;
}

// ========================================
// AFFICHER LA CARTE
// ========================================

function drawMap() {

    const game = document.getElementById("game");

    game.innerHTML = "";


    for (let y = 0; y < mapHeight; y++) {

        const row =
            document.createElement("div");

        row.classList.add("row");


        for (let x = 0; x < mapWidth; x++) {

            const cell =
                document.createElement("div");

            cell.classList.add("cell");


            // JOUEUR

            if (
                x === player.x &&
                y === player.y
            ) {

                cell.textContent = "@";

                cell.classList.add("player");
            }

            // ENNEMI
            else if (isEnemyAt(x, y)){
                cell.textContent = "E";
                cell.classList.add("enemy");
            }


            // MUR

            else if (map[y][x] === "#") {

                cell.textContent = "#";

                cell.classList.add("wall");
            }


            // SOL

            else {

                cell.textContent = ".";

                cell.classList.add("floor");
            }


            row.appendChild(cell);
        }


        game.appendChild(row);
    }
}


// ========================================
// VERIFIER SI LE JOUEUR PEUT BOUGER
// ========================================

function canMove(x, y) {

    // Sortie de la carte

    if (y < 0 || y >= mapHeight) {

        return false;
    }


    if (x < 0 || x >= mapWidth) {

        return false;
    }


    // Mur

    if (map[y][x] === "#") {

        return false;
    }


    return true;
}


// ========================================
// DEPLACER LE JOUEUR
// ========================================

function movePlayer(dx, dy) {

    let newX = player.x + dx;
    let newY = player.y + dy;


    if (canMove(newX, newY)) {

        player.x = newX;
        player.y = newY;

        drawMap();
    }
}


// ========================================
// CONTROLES
// ========================================

document.addEventListener("keydown", function(event) {

    if (
        event.key === "ArrowUp" ||
        event.key === "w"
    ) {

        movePlayer(0, -1);
    }

    else if (
        event.key === "ArrowDown" ||
        event.key === "s"
    ) {

        movePlayer(0, 1);
    }

    else if (
        event.key === "ArrowLeft" ||
        event.key === "a"
    ) {

        movePlayer(-1, 0);
    }

    else if (
        event.key === "ArrowRight" ||
        event.key === "d"
    ) {

        movePlayer(1, 0);
    }

});


// ========================================
// DEMARRER LE JEU
// ========================================

let rooms = generateRooms();

placePlayer(rooms);
placeEnemies(rooms);

drawMap();