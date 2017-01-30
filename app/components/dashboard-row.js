import Ember from 'ember';

const { service } = Ember.inject;
const { alias } = Ember.computed;

export default Ember.Component.extend({
  permissions: service(),
  externalLinks: service(),

  tagName: 'li',
  classNameBindings: ['currentBuild.state', 'repo.active:is-active'],
  classNames: ['rows', 'rows--dashboard'],
  isLoading: false,
  isTriggering: false,
  hasTriggered: false,
  dropupIsOpen: false,

  currentBuild: alias('repo.currentBuild'),

  urlGithubCommit: Ember.computed('repo.slug', 'currentBuild.commit.sha', function () {
    const slug = this.get('repo.slug');
    const sha = this.get('currentBuild.commit.sha');
    return this.get('externalLinks').githubCommit(slug, sha);
  }),

  displayMenuTofu: Ember.computed('permissions.all', 'repo', function () {
    return this.get('permissions').hasPushPermission(this.get('repo'));
  }),

  displayActivateLink: Ember.computed('permissions.all', 'repo', function () {
    return this.get('permissions').hasAdminPermission(this.get('repo'));
  }),

  openDropup() {
    let self = this;
    this.toggleProperty('dropupIsOpen');
    Ember.run.later((() => { self.toggleProperty('dropupIsOpen'); }), 2000);
  },

  actions: {
    openDropup() {
      this.openDropup();
    }
  }
});
