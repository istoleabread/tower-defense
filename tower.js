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

    static prepareAttackOnTroops(currentTarget, towerObjs) {
        // find the target if its in front of tower and attack it
        if (!currentTarget.isActive()) {
            return;
        }

        for (const tower of towerObjs) {
            if (!tower.isActive()) {
                return;
            }

            if (currentTarget.pos === tower.getCurrentEnemy()) {
                let attackInterval;
                if (Tower.attackList[tower.pos]) {
                    clearInterval(Tower.attackList[tower.pos][1]);
                    delete Tower.attackList[tower.pos];
                }

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

                    // Do damage to opponent after weapon reaches their
                    setTimeout(() => {
                        currentTarget.takeDamage(tower.getDPH());
                        currentTarget.setHealthBar(currentTarget.calculateHpPercent());
                    }, 890);
                }, 900);
                Tower.attackList[tower.pos] = [currentTarget, attackInterval];
                // Still building the feature for towers to know of surrouding troops rather than the main one
            // } else {
            //     // If tower is not already occupied
            //     if (!Tower.attackList[tower.pos]) {
            //         let attackInterval;
            //         console.log(tower);
            //         attackInterval = setInterval(() => {
            //             // If tower is destroyed or troop is dead, stop attacking
            //             if (!currentTarget.isActive()) {
            //                 clearInterval(attackInterval);
            //                 delete Tower.attackList[tower.pos];
            //                 console.log("me run");
            //                 Tower.prepareAttackOnTroops(currentTarget, towerObjs);
            //                 return;
            //             }

            //             if (!tower.isActive()) {
            //                 clearInterval(attackInterval);
            //                 delete Tower.attackList[tower.pos];
            //                 return;
            //             }

            //             tower.attackTroop(currentTarget);

            //             // Do damage to opponent after weapon reaches their
            //             setTimeout(() => {
            //                 currentTarget.takeDamage(tower.getDPH());
            //                 currentTarget.setHealthBar(currentTarget.calculateHpPercent());
            //             }, 890);
            //         }, 900);
            //     }
            }
        }
    }

    static attackOnTroops() {
        console.log(Tower.attackList);
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
