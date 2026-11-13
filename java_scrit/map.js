import{
    mapWidth,
    mapHeight,
    map
} from "./state.js";

// ========================================
// CREER UNE CARTE VIDE
// ========================================
export function createEmptyMap() {
    map.length = 0;
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
// GENERER LES SALLES
// ========================================
export function generateRooms() {
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
// VERIFIER SI LE JOUEUR PEUT BOUGER
// ========================================
export function canMove(x, y) {
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
