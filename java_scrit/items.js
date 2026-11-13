import { player, potions } from "./state.js";
import { addMessage } from "./journal.js";

// ========================================
// CRÉER LES POTIONS
// ========================================
function createPotion(x, y) {
    let potion = {
        x: x,
        y: y,
        heal: 3
    };

    potions.push(potion);
}

// ========================================
// PLACEMENT DES POTIONS
// ========================================
export function placePotions(rooms) {
    for (let i = 1; i < rooms.length; i++) {
        let room = rooms[i];
        let x = room.x + Math.floor(Math.random() * room.width);
        let y = room.y + Math.floor(Math.random() * room.height);
        createPotion(x, y);
    }
}

// ========================================
// DETECTION DES POTIONS
// ========================================
export function isPotionAt(x, y) {
    for (let i = 0; i < potions.length; i++) {
        if (
            potions[i].x === x &&
            potions[i].y === y
        ) {
            return true;
        }
    }
    return false;
}

// ========================================
// COLLECT DES POTIONS
// ========================================
export function collectPotion(x, y) {
    for (let i = 0; i < potions.length; i++) {
        if (
            potions[i].x === x &&
            potions[i].y === y
        ) {
            player.potions++;
            addMessage(
                "Vous avez ramassé une potion de soin !",
                "success"
            );
            potions.splice(i, 1);
            return;
        }
    }
}