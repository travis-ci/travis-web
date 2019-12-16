function makeStorage() {
  const storage = {
    getItem(key) {
      return storage[key];
    },

    setItem(key, value) {
      return storage[key] = value;
    },

    removeItem(key) {
      delete storage[key];
    },

    clear() {
      for (let key of storage) {
        const value = storage[key];
        if (typeof value !== 'function') {
          storage.removeItem(key);
        }
      }
    }
  };
  return storage;
}

const localStorage = makeStorage();
const sessionStorage = makeStorage();

export { localStorage, sessionStorage, makeStorage };
