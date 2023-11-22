import { computed } from '@ember/object';
import { assert } from '@ember/debug';
import { parseWithDefault } from '../storage';
import Service, { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { asObservableArray } from "travis/utils/observable_array";
import { underscoreKeys } from "travis/utils/underscore-keys";

const storage = getStorage();

const Auth = Service.extend({
  store: service(),

  accounts: computed({
    get() {
      const accountsData = storage.getItem('travis.auth.accounts');
      let accounts = parseWithDefault(accountsData, []).map(account =>
          extractAccountRecord(this.store, account)
      );
      accounts = asObservableArray(accounts);
      accounts.addArrayObserver(this, {
        willChange: 'persistAccounts',
        didChange: 'persistAccounts'
      });
      return accounts;
    },
    set(key, accounts_) {
      this.persistAccounts(accounts_);
      return accounts_;
    }
  }),

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
      console.log("AM I here 2?")
      return storage.getItem('travis.rssToken') || null;
    },
    set(key, token) {
      assert('RSS Token storage is read-only', token === null);
      storage.removeItem('travis.rssToken');
      return null;
    }
  }),

  user: computed({
    get() {
      const data = parseWithDefault(storage.getItem('travis.user'), null);
      return underscoreKeys(data && data.user || data);
    },
    set(key, user) {
      assert('User storage is read-only', user === null);
      storage.removeItem('travis.user');
      return null;
    }
  }),

  persistAccounts(newValue) {
    const records = (newValue || []).map(record => serializeUserRecord(record));
    storage.setItem('travis.auth.accounts', JSON.stringify(records));
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

export default Auth;
