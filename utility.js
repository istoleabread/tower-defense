class Utility {
    constructor() {
        this.towerArea = document.querySelector(".towers");
        this.errorBox = document.querySelector(".errorMsg");
        this.errorTimeout = "";
    }

    createElement(props) {
        const div = document.createElement("div");
        this.applyNestedStyles(div, props);
        return div;
    }

    // recursive method
    applyNestedStyles(div, prop) {
        for (const key in prop) {
            if (typeof prop[key] === "object") {
                this.applyNestedStyles(div[key], prop[key]);
            } else {
                div[key] = prop[key];
            }
        }
        return div;
    }

    addTroopToDOM(troopObj, parentDiv, towerObjs) {
        const parentPosition = parentDiv.dataset.type;
        troopObj.setTroopPos(parentPosition);

        const troop = this.createElement(troopObj.getTroopProps(parentPosition));
        const healthBar = this.createElement(troopObj.getHealthProps());
        const healthColor = this.createElement(troopObj.getHealthProps(false));

        healthBar.appendChild(healthColor);
        troop.appendChild(healthBar);
        parentDiv.appendChild(troop);

        Troop.prepareAttackOnTowers(troopObj, towerObjs);
    }

    removeTroopFromDOM(troopObj) {
        const troop = document.getElementById(troopObj.id);
        document.querySelector(`.${troopObj.pos}`).removeChild(troop);
    }

    addTowerToDOM(towerObj) {
        const tower = this.createElement(towerObj.getTowerProps());
        const healthBar = this.createElement(towerObj.getHealthProps());
        const healthColor = this.createElement(towerObj.getHealthProps(false));

        healthBar.appendChild(healthColor);
        tower.appendChild(healthBar);
        this.towerArea.appendChild(tower);
        this.setHealthBar(towerObj);
    }

    showMsg(msg, color = "orangered") {
        if (this.errorTimeout) clearTimeout(this.errorTimeout);
        this.errorBox.textContent = msg;
        this.errorBox.style.backgroundColor = color;
        this.errorTimeout = setTimeout(() => {
            this.errorBox.textContent = "";
        }, 1700);
    }

    setHealthBar(obj) {
        const percent = obj.calculateHpPercent() || 0;
        const elem = document.querySelector(`.${obj.id}color`);
        if (!elem) return;
        elem.style.backgroundColor = obj.getBarColor(percent);
        elem.style.right = 100 - percent + "%";
    }
}
