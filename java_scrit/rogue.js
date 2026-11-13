import {
    mapWidth,
    mapHeight,
    map,
    player,
    gameOver,
    enemies,
    potions,
    setGameOver
} from "./state.js";

import {
    generateRooms,
    canMove
} from "./map.js";

import { addMessage } from "./journal.js";

import {
    placePlayer,
    movePlayer
} from "./player.js";

import {
    placePotions,
    isPotionAt,
    collectPotion
} from "./items.js";

import {
    placeEnemies,
    isEnemyAt,
    enemyTurn
} from "./enemies.js";

// ========================================
// UTILISER LES POTIONS
// ========================================
function usePotion() {
    if (gameOver) {
    return;
}
    // Vérifier si le joueur possède une potion
    if (player.potions <= 0) {
        addMessage("Vous n'avez aucune potion !", "warning");
        return;
    }
    // Vérifier si le joueur a déjà tous ses PV
    if (player.hp === player.maxHp) {
        addMessage("Vos PV sont déjà au maximum !", "warning");
        return;
    }
    // Consommer une potion
    player.potions--;
    // Récupérer 3 PV
    player.hp = player.hp + 3;
    // Empêcher de dépasser les PV maximums
    if (player.hp > player.maxHp) {
        player.hp = player.maxHp;
    }
    addMessage("Vous utilisez une potion de soin !", "success");
    addMessage("Vous récupérez des PV : " + player.hp + " / " + player.maxHp, "info");
    enemyTurn(drawMap);
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
            // POTION
            else if (isPotionAt(x, y)){
                cell.textContent="!";
                cell.classList.add("potion");
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
    if (gameOver) {
    const gameOverMessage = document.createElement("h2");
    gameOverMessage.textContent = "VOUS ÊTES MORT";
    gameOverMessage.classList.add("game-over");
    game.appendChild(gameOverMessage);
}
    document.getElementById("stats").textContent =
    "PV : " + player.hp + " / " + player.maxHp +
    " | Or : " + player.gold +
    "| Potions: " + player.potions;
}

// ========================================
// CONTROLES
// ========================================
document.addEventListener("keydown", function(event) {
    if (
        event.key === "ArrowUp" ||
        event.key === "w"
    ) {
        movePlayer(0, -1, drawMap);
    }
    else if (
        event.key === "ArrowDown" ||
        event.key === "s"
    ) {
        movePlayer(0, 1, drawMap);
    }
    else if (
        event.key === "ArrowLeft" ||
        event.key === "a"
    ) {
        movePlayer(-1, 0, drawMap);
    }
    else if (
        event.key === "ArrowRight" ||
        event.key === "d"
    ) {
        movePlayer(1, 0, drawMap);
    }
    else if (event.key.toLowerCase() === "h"){
        usePotion();
    }
});

// ========================================
// DEMARRER LE JEU
// ========================================
let rooms = generateRooms();
placePlayer(rooms);
placeEnemies(rooms);
placePotions(rooms);
drawMap();