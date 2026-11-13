// ========================================
// CARTE DU DONJON
// ========================================
export const mapWidth = 60;
export const mapHeight = 30;
export let map = [];

// ========================================
// JOUEUR
// ========================================
export let player = {
    x: 0,
    y: 0,
    gold: 0,
    hp: 10,
    maxHp: 10,
    potions: 0
};
export let gameOver = false;

// ========================================
// ENNEMIS
// ========================================
export let enemies = [];

// ========================================
// POTIONS
// ========================================
export let potions = [];

// ========================================
// GAME OVER 
// ========================================
export function setGameOver(value){
 gameOver = value;
}
