// dph -> Damage per hit
// pos is the tower position
class Tower extends CommonProps {
    static attackList = {};
    constructor(hitpoints, dph, pos) {
        super(hitpoints, dph, pos);
        this.id = pos;
        this.createTower();
    }

    // Add towers to dom
    createTower() {
        const tower = document.createElement("div");
        const healthbar = document.createElement("div");
        const healthColor = document.createElement("div");

        tower.className = `tower ${this.pos}`;
        tower.id = this.pos;
        tower.title = this.pos;
        healthbar.className = `toHealthBar ${this.pos}health`;
        healthColor.className = `toHealthColor ${this.pos}color`;

        healthbar.appendChild(healthColor);
        tower.appendChild(healthbar);
        document.querySelector(".towers").appendChild(tower);
        this.setHealthBar(this.calculateHpPercent());
    }

    static findAndAttack(){}

    static prepareAttackOnTroops(currentTarget, towerObjs) {
        // if target is already dead, do nothing???
        // TODO: If target is already dead, find another prey
        if (!currentTarget.isActive()) {
            return;
        }

        for (const tower of towerObjs) {
            // if tower is already destroyed, skip the loop
            if (!tower.isActive()) {
                continue;
            }
            // if current target is the tower's main enemy
            if (currentTarget.pos === tower.getCurrentEnemy()) {
                // If tower is already in a combat other than its main enemy, leave that combat and start a combat with its main enemy
                if (Tower.attackList[tower.pos]) {
                    clearInterval(Tower.attackList[tower.pos][1]);
                    delete Tower.attackList[tower.pos];
                }

                this.attackOnTroops(currentTarget, tower, towerObjs);
            } else if (!Tower.attackList[tower.pos]) {
                // If tower is not already occupied with its main enemy, attack the troop at any position
                this.attackOnTroops(currentTarget, tower, towerObjs);
            }
        }
    }

    static attackOnTroops(currentTarget, tower, towerObjs) {
        let attackInterval;
        attackInterval = setInterval(() => {
            // If tower is destroyed or troop is dead, stop attacking
            if (!currentTarget.isActive()) {
                clearInterval(attackInterval);
                delete Tower.attackList[tower.pos];
                Tower.prepareAttackOnTroops(currentTarget, towerObjs);
                return;
            }

            if (!tower.isActive()) {
                clearInterval(attackInterval);
                delete Tower.attackList[tower.pos];
                return;
            }

            tower.attackTroop(currentTarget);

            // Do damage to opponent after weapon reaches their position
            setTimeout(() => {
                currentTarget.takeDamage(tower.getDPH());
                currentTarget.setHealthBar(currentTarget.calculateHpPercent());
            }, 890);
        }, 900);
        Tower.attackList[tower.pos] = [currentTarget, attackInterval];
    }

    setHealthBar(percent) {
        percent = percent || 0;
        const elem = document.querySelector(`.${this.pos}color`);
        elem.style.backgroundColor = this.getBarColor(percent);
        elem.style.right = 100 - percent + "%";
    }

    attackTroop(target) {}
}

class FireTower extends Tower {
    constructor() {
        super(550, 35, "towerFire");
    }

    attackTroop(target) {
        this.inventory.throwWeapon("fire", this.getCoordinates(), target);
    }
}

class CannonTower extends Tower {
    constructor() {
        super(650, 40, "towerCannon");
    }

    attackTroop(target) {
        this.inventory.throwWeapon("cannon", this.getCoordinates(), target);
    }
}

class ArcherTower extends Tower {
    constructor() {
        super(400, 30, "towerArrow");
    }

    attackTroop(target) {
        this.inventory.throwWeapon("arrow", this.getCoordinates(), target);
    }
}
