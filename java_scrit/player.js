import{
    player,
    gameOver
} from "./state.js";
import { canMove } from "./map.js";
import{
    getEnemyAt,
    enemyTurn
} from "./enemies.js";
import{ attackEnemy} from "./combat.js";
import{ collectPotion} from "./items.js";

// ========================================
// PLACER LE JOUEUR
// ========================================
export function placePlayer(rooms) {
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
// DEPLACER LE JOUEUR
// ========================================
export function movePlayer(dx, dy, drawMap) {
    if (gameOver) {
    return;}
    let newX = player.x + dx;
    let newY = player.y + dy;
    //verifier ennemi devant
    let enemyIndex = getEnemyAt(newX, newY);
    if(enemyIndex !== -1){
        attackEnemy(enemyIndex, drawMap);
        enemyTurn(drawMap);
        return;
    }
    //verifi si peut avancer
    if (canMove(newX, newY)) {
        player.x = newX;
        player.y = newY;
        collectPotion(newX, newY);
        enemyTurn(drawMap);
    }
}

