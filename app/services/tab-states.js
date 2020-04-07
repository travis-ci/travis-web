import Service from '@ember/service';

export const SIDEBAR_TAB_STATES = {
  OWNED: 'owned',
  RUNNING: 'running',
  SEARCH: 'search',
};

export default Service.extend({
  sidebarTab: SIDEBAR_TAB_STATES.OWNED,
  mainTab: 'current'
});
