export default class TabMap extends Map {
    constructor(entries = []) {
        super(entries);
        this._lastIndex = entries.length - 1;
    }
    addTab() {
        this._lastIndex++;
        this.set(
            this._lastIndex,
            `New Tab ${this._lastIndex + 1}`
        );
        return this;
    }
    removeTab(tabIndex) {
        this.delete(tabIndex);
        return this;
    }
    updateTab(tabIndex, newLabel) {
        this.set(tabIndex, newLabel)
        return this;
    }
}