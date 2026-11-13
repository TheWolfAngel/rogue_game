import { player, enemies, gameOver } from "./state.js";
import { canMove } from "./map.js";
import { damagePlayer } from "./combat.js";
import { addMessage } from "./journal.js";

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
        detected: false
    };
    enemies.push(enemy);
}

// ========================================
// PLACER LES ENNEMI
// ========================================
export function placeEnemies(rooms) {
    enemies.length = 0;
    for (let i = 1; i < rooms.length; i++) {
        let room = rooms[i];
        let enemyX = Math.floor(room.x + room.width / 2);
        let enemyY = Math.floor(room.y + room.height / 2);
            //verifier qu'il sigit d'ennemi
        if (enemyX !== player.x || enemyY !== player.y) {
            createEnemy(enemyX, enemyY);
        }
    }
}

// ========================================
// VERIFICATION POSITION DES ENNEMIS
// ========================================
export function isEnemyAt(x, y) {
    return getEnemyAt(x, y) !== -1;
}

// ========================================
//    TROUVER UN ENNEMI
// ========================================
export function getEnemyAt(x, y){
    for(let i=0; i<enemies.length; i++){
        if(
            enemies[i].x === x &&
            enemies[i].y === y
        ){
            return i;
        }
    }
    return -1
} 

// ========================================
//  CALCUL DE LA DISTANCE DE DETECTION
// ========================================
function calculateDistance(x1, y1, x2, y2){
    let distanceX=Math.abs(x2-x1);
    let distanceY=Math.abs(y2-y1);
    return distanceX + distanceY;
}

// ========================================
//   DETECTION DU JOUEUR
// ========================================
function canEnemySeePlayer(enemy){
    let distance= calculateDistance(
        enemy.x, enemy.y, player.x, player.y
    );
    if(distance<=5){
        return true;
    }
    return false;
}

// ========================================
//  DEPLACEMENT ENNEMIS
// ========================================
function moveEnemy(enemy){
    let differenceX = player.x - enemy.x;
    let differenceY = player.y - enemy.y;
    let newX= enemy.x;
    let newY= enemy.y;
    //deplace horizon
    if(Math.abs(differenceX)>= Math.abs(differenceY)){
        if(differenceX > 0){
            newX = enemy.x + 1;
        }
        else if( differenceX < 0){
            newX = enemy.x - 1;
        }
        if (canMove(newX, newY) && getEnemyAt(newX, newY)=== -1 && (newX !== player.x || newY !== player.y)){
            enemy.x = newX;
            return;
        }
    }
    // deplace vertical
    newX = enemy.x;
    newY = enemy.y;
    if(differenceY>0){
        newY = enemy.y +1;
    }
    else if (differenceY<0){
        newY = enemy.y -1;
    }
    if (canMove(newX, newY) && getEnemyAt(newX, newY) === -1){
        enemy.y = newY;
        return;
    }
    //choisir le deplacement
    newX = enemy.x;
    newY = enemy.y;
    if(Math.abs(differenceX)<Math.abs(differenceY)){
        if(differenceX>0){
            newX =enemy.x +1;
        }
        else if(differenceX<0){
            newX = enemy.x -1;
        }
        if(canMove(newX, newY) && getEnemyAt(newX, newY)=== -1){
            enemy.x = newX;
        }
    }
}

// ========================================
//  TOUR DES ENNEMIS
// ========================================
export function enemyTurn(drawMap){
    if (gameOver){
        return;
    }
    for(let i=0; i<enemies.length; i++){
        let enemy = enemies[i];
        let distance = calculateDistance(enemy.x, enemy.y, player.x, player.y);
      // L'ennemi attaque si le joueur est adjacent
        if (distance <= 1) {
    addMessage("Un ennemi attaque le joueur !", "combat");
    damagePlayer(enemy.damage, drawMap);
    // Arrêter le tour si le joueur est mort
    if (gameOver) {return;}
}
        // L'ennemi détecte le joueur
        else if (canEnemySeePlayer(enemy)) {
            if (enemy.detected === false) {
                addMessage("Un ennemi vous a repéré !", "warning");
                enemy.detected = true;
            }
            // Mémoriser sa position avant son déplacement
            let oldX = enemy.x;
            let oldY = enemy.y;
            moveEnemy(enemy);
            // Vérifier si l'ennemi a bougé
            if (oldX !== enemy.x || oldY !== enemy.y) {
                addMessage("Un ennemi se rapproche de vous.", "info");
            }
        }
        // L'ennemi perd de vue le joueur
        else {
            enemy.detected = false;
        }
    }
    drawMap();
}