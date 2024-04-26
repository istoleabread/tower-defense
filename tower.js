class Tower extends GameEntityAttributes {
    static attackList = {}; // maintain info regarding all towers ongoing combat
    constructor(hitpoints, dph, pos) {
        super(hitpoints, dph, pos);
        this.id = pos;
        this.util.addTowerToDOM(this);
    }

    static findAndAttack(towerObjs) {
        if (!Object.values(Tower.attackList).length) return; // If there is no combat ongoing, return
        const firstTarget = Object.values(Tower.attackList)[0][0];
        Tower.prepareAttackOnTroops(firstTarget, towerObjs);
    }

    static prepareAttackOnTroops(currentTarget, towerObjs) {
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
                // If tower is already in a combat other than its main enemy, leave that combat and start a new combat with its main enemy
                if (Tower.attackList[tower.pos]) {
                    clearInterval(Tower.attackList[tower.pos][1]);
                    delete Tower.attackList[tower.pos];
                }

                this.attackOnTroop(currentTarget, tower, towerObjs);
            } else if (!Tower.attackList[tower.pos]) {
                // If tower is not already occupied with its main enemy, attack the troop at any position
                this.attackOnTroop(currentTarget, tower, towerObjs);
            }
        }
    }

    static attackOnTroop(currentTarget, tower, towerObjs) {
        let attackInterval;
        attackInterval = setInterval(() => {
            // If tower is destroyed or troop is dead, stop attacking
            if (!currentTarget.isActive() || !tower.isActive()) {
                clearInterval(attackInterval);
                delete Tower.attackList[tower.pos];
                Tower.findAndAttack(towerObjs);
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

    getTowerProps() {
        return {
            className: `tower ${this.pos}`,
            id: this.pos,
            title: this.pos,
        };
    }

    getHealthProps(bar = true) {
        if (bar) {
            return {
                className: `toHealthBar ${this.pos}health`,
            };
        }
        return {
            className: `toHealthColor ${this.pos}color`,
        };
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
