
import { mapWidth, mapHeight, player } from "./state.js";

// Mémorise les cases déjà découvertes
const explored = [];

// Initialise le brouillard pour une nouvelle partie
export function initFog() {
    explored.length = 0;

    for (let y = 0; y < mapHeight; y++) {
        const row = [];

        for (let x = 0; x < mapWidth; x++) {
            row.push(false);
        }

        explored.push(row);
    }

    updateFog();
}

// Vérifie si une case est proche du joueur
export function isVisible(x, y) {
    const distanceX = Math.abs(x - player.x);
    const distanceY = Math.abs(y - player.y);

    return distanceX <= 2 && distanceY <= 2;
}

// Enregistre les cases découvertes
export function updateFog() {
    for (let y = 0; y < mapHeight; y++) {
        for (let x = 0; x < mapWidth; x++) {
            if (isVisible(x, y)) {
                explored[y][x] = true;
            }
        }
    }
}

// Vérifie si une case a déjà été explorée
export function isExplored(x, y) {
    return explored[y]?.[x] === true;
}
