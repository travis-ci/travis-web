import Service from '@ember/service';
import { equal } from '@ember/object/computed';

export const SIDEBAR_TAB_STATES = {
  OWNED: 'owned',
  RUNNING: 'running',
  SEARCH: 'search',
};

export default Service.extend({
  sidebarTab: SIDEBAR_TAB_STATES.OWNED,
  mainTab: 'current',

  isSidebarOwned: equal('sidebarTab', SIDEBAR_TAB_STATES.OWNED),
  isSidebarRunning: equal('sidebarTab', SIDEBAR_TAB_STATES.RUNNING),
  isSidebarSearch: equal('sidebarTab', SIDEBAR_TAB_STATES.SEARCH),

  switchSidebar(state) {
    this.set('sidebarTab', state);
  },
  switchSidebarToOwned() {
    this.switchSidebar(SIDEBAR_TAB_STATES.OWNED);
  },
  switchSidebarToRunning() {
    this.switchSidebar(SIDEBAR_TAB_STATES.RUNNING);
  },
  switchSidebarToSearch() {
    this.switchSidebar(SIDEBAR_TAB_STATES.SEARCH);
  },
});
