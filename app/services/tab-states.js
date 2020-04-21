import Service from '@ember/service';
import { equal } from '@ember/object/computed';

export const SIDEBAR_TAB = {
  OWNED: 'owned',
  RUNNING: 'running',
  SEARCH: 'search',
};

export const MAIN_TAB = {
  CURRENT: 'current',
  JOB: 'job',
  BUILD: 'build',
  SETTINGS: 'settings',
  REQUESTS: 'requests',
  CACHES: 'caches',
};

export default Service.extend({
  sidebarTab: SIDEBAR_TAB.OWNED,
  mainTab: MAIN_TAB.CURRENT,

  isSidebarOwned: equal('sidebarTab', SIDEBAR_TAB.OWNED),
  isSidebarRunning: equal('sidebarTab', SIDEBAR_TAB.RUNNING),
  isSidebarSearch: equal('sidebarTab', SIDEBAR_TAB.SEARCH),

  switchSidebar(state) {
    this.set('sidebarTab', state);
  },
  switchSidebarToOwned() {
    this.switchSidebar(SIDEBAR_TAB.OWNED);
  },
  switchSidebarToRunning() {
    this.switchSidebar(SIDEBAR_TAB.RUNNING);
  },
  switchSidebarToSearch() {
    this.switchSidebar(SIDEBAR_TAB.SEARCH);
  },

  switchMainTab(state) {
    this.set('mainTab', state);
  },
  switchMainTabToCurrent() {
    this.switchMainTab(MAIN_TAB.CURRENT);
  },
  switchMainTabToBuild() {
    this.switchMainTab(MAIN_TAB.BUILD);
  },
  switchMainTabToJob() {
    this.switchMainTab(MAIN_TAB.JOB);
  },
  switchMainTabToSettings() {
    this.switchMainTab(MAIN_TAB.SETTINGS);
  },
  switchMainTabToRequests() {
    this.switchMainTab(MAIN_TAB.REQUESTS);
  },
  switchMainTabToCaches() {
    this.switchMainTab(MAIN_TAB.CACHES);
  },
});
