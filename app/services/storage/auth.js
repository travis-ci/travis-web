import Service, { inject as service } from '@ember/service';
import {action, computed} from '@ember/object';
import { assert } from '@ember/debug';
import { parseWithDefault } from '../storage';
import { underscoreKeys } from "travis/utils/underscore-keys";
import {tracked} from "@glimmer/tracking";

const storage = getStorage();

export default class Auth extends Service {
  @service store;

  @tracked _accounts = [];

  constructor() {
    super(...arguments);
    this.loadAccounts();
  }

  loadAccounts() {
    const accountsData = storage.getItem('travis.auth.accounts');
    console.log("accounts Data", accountsData);
    this.accounts = parseWithDefault(accountsData, []).map(account =>
      extractAccountRecord(this.store, account)
    );
  }

  get accounts() {
    return this._accounts;
  }

  set accounts(accounts) {
    this.setAccounts(accounts);
  }

  @action
  setAccounts(accounts) {
    console.log("setting accounts", accounts);
    this._accounts = accounts;
    this.persistAccounts(accounts);
  }

  persistAccounts(newValue) {
    console.log("newValue", newValue);
    const records = (newValue || []).map(record => serializeUserRecord(record));
    storage.setItem('travis.auth.accounts', JSON.stringify(records));
  }

  @computed
  get token() {
    return storage.getItem('travis.token') || null;
  }

  set token(value) {
    assert('Token storage is read-only', value === null);
    storage.removeItem('travis.token');
    return null;
  }

  @computed
  get rssToken() {
    return storage.getItem('travis.rssToken') || null;
  }

  set rssToken(value) {
    assert('RSS Token storage is read-only', value === null);
    storage.removeItem('travis.rssToken');
    return null;
  }

  @computed
  get user() {
    const data = parseWithDefault(storage.getItem('travis.user'), {});
    return underscoreKeys(data && data.user || data);
  }

  set user(value) {
    assert('User storage is read-only', value === null);
    storage.removeItem('travis.user');
    return null;
  }

  @computed('accounts.[]', 'activeAccountId')
  get activeAccount() {
    const { accounts, activeAccountId } = this;
    return accounts.find(account => +account.id === activeAccountId);
  }

  set activeAccount(value) {
    const id = value && value.id || null;
    this.activeAccountId = id;
    return value;
  }

  @computed
  get activeAccountId() {
    return +storage.getItem('travis.auth.activeAccountId');
  }

  set activeAccountId(value) {
    if (value === null) {
      storage.removeItem('travis.auth.activeAccountId');
      return null;
    } else {
      storage.setItem('travis.auth.activeAccountId', value);
      return value;
    }
  }

  @computed
  get activeAccountInstallation() {
    return +storage.getItem('travis.auth.activeAccountInstallation');
  }

  set activeAccountInstallation(value) {
    if (value === null) {
      storage.removeItem('travis.auth.activeAccountInstallation');
      return null;
    } else {
      storage.setItem('travis.auth.activeAccountInstallation', value);
      return value;
    }
  }

  @computed
  get isBecome() {
    return !!storage.getItem('travis.auth.become');
  }

  clearLoginData() {
    storage.removeItem('travis.token');
    storage.removeItem('travis.user');
    storage.removeItem('travis.auth.become');
  }

  clear() {
    this.clearLoginData();
    storage.removeItem('travis.auth.accounts');
    storage.removeItem('travis.auth.activeAccountId');
  }
}
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

