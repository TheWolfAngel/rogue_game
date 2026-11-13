import { 
    player,
    enemies,
    setGameOver
 } from "./state.js";
 import { addMessage } from "./journal.js";

// ========================================
// INFLIGER DES DEGATS AU JOUEUR
// ========================================
export function damagePlayer(damage, drawMap) {
    player.hp = player.hp - damage;
    addMessage(
        "Vous subissez " + damage + " dégât(s) !",
        "combat"
    );
    addMessage(
        "PV restants : " + player.hp + " / " + player.maxHp,
        "warning"
    );
    // Vérifier si le joueur est mort
    if (player.hp <= 0) {
        player.hp = 0;
       setGameOver(true);
        addMessage("Vous êtes mort !", "combat");
        addMessage("Fin de la partie.", "combat");
    }
    drawMap();
}

// ========================================
//  ATTAQUER LES ENNEMIS
// ========================================
export function attackEnemy(enemyIndex, drawMap){
    let enemy = enemies[enemyIndex];
    //infliger degat
    enemy.hp = enemy.hp - 1;
    //verifier si mort
    if(enemy.hp <= 0){
        player.gold = player.gold + enemy.gold;
        enemies.splice(enemyIndex, 1);
        addMessage("Gobelin vaincu !", "success");
        addMessage("Vous obtenez 10 pièces d'or.", "success");
    }
    else{
        addMessage("L'ennemi subit des dégâts. PV restants : " + enemy.hp,
            "combat");
    }
    drawMap();
}
