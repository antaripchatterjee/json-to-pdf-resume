export default class AutoIncrementalPanelIndex {
  static #instance = null;
  #counter = 0;

  constructor() {
    if (AutoIncrementalPanelIndex.#instance) {
      return AutoIncrementalPanelIndex.#instance;
    }
    AutoIncrementalPanelIndex.#instance = this;
  }

  static getInstance() {
    if (!AutoIncrementalPanelIndex.#instance) {
      new AutoIncrementalPanelIndex();
    }
    return AutoIncrementalPanelIndex.#instance;
  }

  static getNext() {
    const instance = AutoIncrementalPanelIndex.getInstance();
    return ++instance.#counter;
  }

  static getCurrent() {
    const instance = AutoIncrementalPanelIndex.getInstance();
    return instance.#counter;
  }

  static reset(start = 0) {
    const instance = AutoIncrementalPanelIndex.getInstance();
    instance.#counter = start;
    return instance.#counter;
  }
}
