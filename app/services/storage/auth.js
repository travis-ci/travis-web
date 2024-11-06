import { computed } from '@ember/object';
import { assert } from '@ember/debug';
import { parseWithDefault } from '../storage';
import Service, { inject as service } from '@ember/service';

const storage = getStorage();

export default Service.extend({
  store: service(),


  token: computed({
    get() {
      return storage.getItem('travis.token') || null;
    },
    set(key, token) {
      assert('Token storage is read-only', token === null);
      storage.removeItem('travis.token');
      return null;
    }
  }),

  rssToken: computed({
    get() {
      return storage.getItem('travis.rssToken') || null;
    },
    set(key, token) {
      assert('RSS Token storage is read-only', token === null);
      storage.removeItem('travis.rssToken');
      return null;
    }
  }),

  webToken: computed({
    get() {
      return storage.getItem('travis.webToken') || null;
    },
    set(key, token) {
      assert('Web Token storage is read-only', token === null);
      storage.removeItem('travis.webToken');
      return null;
    }
  }),

  user: computed({
    get() {
      const data = parseWithDefault(storage.getItem('travis.user'), null);
      return data && data.user || data;
    },
    set(key, user) {
      assert('User storage is read-only', user === null);
      storage.removeItem('travis.user');
      return null;
    }
  }),

  get accounts() {
    const accountsData = storage.getItem('travis.auth.accounts');
    this._accounts = parseWithDefault(accountsData, []).map(account =>
      extractAccountRecord(this.store, account)
    );
    return this._accounts;
  },
  set accounts(accounts) {
    this.persistAccounts(accounts);
  },

  pushAccount(account) {
    this._accounts.push(account);
    this.persistAccounts(this._accounts);
    return this._accounts;
  },


  persistAccounts(newValue) {
    try {
      const records = (newValue || []).map(record => serializeUserRecord(record));
      storage.setItem('travis.auth.accounts', JSON.stringify(records));
      this._accounts = records;
    } catch (e) {
    }
  },

  activeAccountId: computed({
    get() {
      return +storage.getItem('travis.auth.activeAccountId');
    },
    set(key, id) {
      if (id === null) {
        storage.removeItem('travis.auth.activeAccountId');
        return null;
      } else {
        storage.setItem('travis.auth.activeAccountId', id);
        return id;
      }
    }
  }),

  activeAccountInstallation: computed({
    get() {
      return +storage.getItem('travis.auth.activeAccountInstallation');
    },
    set(key, id) {
      if (id === null) {
        storage.removeItem('travis.auth.activeAccountInstallation');
        return null;
      } else {
        storage.setItem('travis.auth.activeAccountInstallation', id);
        return id;
      }
    }
  }),

  activeAccount: computed({
    get() {
      const { accounts, activeAccountId } = this;
      return accounts.find(account => +account.id === activeAccountId);
    },
    set(key, account) {
      const id = account && account.id || null;
      this.set('activeAccountId', id);
      return account;
    }
  }),

  isBecome: computed(() => !!storage.getItem('travis.auth.become')),

  setRegeneratedToken(token) {
    storage.setItem('travis.token', token);
  },

  clearLoginData() {
    storage.removeItem('travis.token');
    storage.removeItem('travis.user');
    storage.removeItem('travis.auth.become');
  },

  clear() {
    this.clearLoginData();
    storage.removeItem('travis.auth.accounts');
    storage.removeItem('travis.auth.activeAccountId');
  }

});

// HELPERS

function getStorage() {
  let localStorage = {};
  let sessionStorage = {};
  if (typeof window !== 'undefined') {
    localStorage = window.localStorage;
    sessionStorage = window.sessionStorage;
  }
  // primary storage for auth is the one in which auth data was updated last
  const sessionStorageUpdatedAt = +sessionStorage.getItem('travis.auth.updatedAt');
  const localStorageUpdatedAt = +localStorage.getItem('travis.auth.updatedAt');
  return sessionStorageUpdatedAt > localStorageUpdatedAt ? sessionStorage : localStorage;
}

function serializeUserRecord(record) {
  return record.serialize({ includeId: true, forLocalStorage: true });
}

function extractAccountRecord(store, userData) {
  const record = store.peekRecord('user', userData.id);
  return record || store.push(store.normalize('user', userData));
}

