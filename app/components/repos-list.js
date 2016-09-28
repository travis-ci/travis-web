import Ember from 'ember';

const { service } = Ember.inject;

let ReposListComponent = Ember.Component.extend({
  tabsState: service(),

  tagName: 'ul',
  classNames: ['repos-list'],

  noReposMessage: Ember.computed('tabsState.sidebarTab', function () {
    const tab = this.get('tabsState.sidebarTab');
    if (tab === 'owned') {
      return 'You don\'t have any repos set up on Travis CI';
    } else if (tab === 'recent') {
      return 'Repositories could not be loaded';
    } else {
      return 'Could not find any repos';
    }
  }),

});

export default ReposListComponent;
