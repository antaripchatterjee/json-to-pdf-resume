export default class AutoIncrementalTabIndex {
  static #instance = null;
  #counter = 0;

  constructor() {
    if (AutoIncrementalTabIndex.#instance) {
      return AutoIncrementalTabIndex.#instance;
    }
    AutoIncrementalTabIndex.#instance = this;
  }

  static getInstance() {
    if (!AutoIncrementalTabIndex.#instance) {
      new AutoIncrementalTabIndex();
    }
    return AutoIncrementalTabIndex.#instance;
  }

  static getNext() {
    const instance = AutoIncrementalTabIndex.getInstance();
    return ++instance.#counter;
  }

  static getCurrent() {
    const instance = AutoIncrementalTabIndex.getInstance();
    return instance.#counter;
  }

  static reset(start = 0) {
    const instance = AutoIncrementalTabIndex.getInstance();
    instance.#counter = start;
  }
}
