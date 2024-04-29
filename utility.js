class Utility {
    constructor() {
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

    showMsg(msg, color = "orangered") {
        if (this.errorTimeout) clearTimeout(this.errorTimeout);
        DOMCache.errorBox.textContent = msg;
        DOMCache.errorBox.style.backgroundColor = color;
        this.errorTimeout = setTimeout(() => {
            DOMCache.errorBox.textContent = "";
        }, 1700);
    }
}
