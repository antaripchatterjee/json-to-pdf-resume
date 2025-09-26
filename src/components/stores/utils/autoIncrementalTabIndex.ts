export default class AutoIncrementalTabIndex {
  private static instance: AutoIncrementalTabIndex | null = null;
  private counter: number = 0;

  constructor() {
    if (AutoIncrementalTabIndex.instance) {
      return AutoIncrementalTabIndex.instance;
    }
    AutoIncrementalTabIndex.instance = this;
  }

  /** Get the singleton instance */
  static getInstance(): AutoIncrementalTabIndex {
    if (!AutoIncrementalTabIndex.instance) {
      new AutoIncrementalTabIndex();
    }
    return AutoIncrementalTabIndex.instance!;
  }

  /** Get the next incremental tab index */
  static getNext(): number {
    const instance = AutoIncrementalTabIndex.getInstance();
    return ++instance.counter;
  }

  /** Get the current tab index (without incrementing) */
  static getCurrent(): number {
    const instance = AutoIncrementalTabIndex.getInstance();
    return instance.counter;
  }

  /** Reset the counter to a starting value (default 0) */
  static reset(start: number = 0): number {
    const instance = AutoIncrementalTabIndex.getInstance();
    instance.counter = start;
    return instance.counter;
  }
}
