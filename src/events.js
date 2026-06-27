class EventBus {
  constructor() {
    this.listeners = new Map();
  }

  on(eventName, handler) {
    const list = this.listeners.get(eventName) || [];
    list.push(handler);
    this.listeners.set(eventName, list);
    return () => this.off(eventName, handler);
  }

  off(eventName, handler) {
    const list = this.listeners.get(eventName);
    if (!list) {
      return;
    }
    const next = list.filter((fn) => fn !== handler);
    this.listeners.set(eventName, next);
  }

  emit(eventName, payload) {
    const list = this.listeners.get(eventName);
    if (!list) {
      return;
    }
    list.forEach((fn) => {
      try {
        fn(payload);
      } catch (_) {
      }
    });
  }
}

export const eventBus = new EventBus();
