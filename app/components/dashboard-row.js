import Ember from 'ember';
import { githubCommit as githubCommitUrl } from 'travis/utils/urls';

const { service } = Ember.inject;
const { alias } = Ember.computed;

export default Ember.Component.extend({
  permissions: service(),
  ajax: service(),
  tagName: 'li',
  classNameBindings: ['repo.active:is-active'],
  classNames: ['rows', 'rows--dashboard'],
  isLoading: false,
  isTriggering: false,
  dropupIsOpen: false,

  currentBuild: alias('repo.currentBuild'),

  urlGithubCommit: Ember.computed('repo.slug', 'currentBuild.commit.sha', function () {
    return githubCommitUrl(this.get('repo.slug'), this.get('currentBuild.commit.sha'));
  }),

  displayMenuTofu: Ember.computed('permissions.all', 'repo', function () {
    return this.get('permissions').hasPushPermission(this.get('repo'));
  }),

  openDropup() {
    this.toggleProperty('dropupIsOpen');
    Ember.run.later((() => { this.set('dropupIsOpen', false); }), 2000);
  },

  triggerBuild() {
    const self = this;
    let data = {};
    data.request = `{ 'branch': '${this.get('repo.defaultBranch.name')}' }`;

    this.get('ajax').ajax(`/v3/repo/${this.get('repo.id')}/requests`, 'POST', { data })
      .then(() => {
        // console.log(response);
        self.set('isTriggering', false);
      });
    this.set('dropupIsOpen', false);
    this.set('isTriggering', true);
  },

  actions: {
    openDropup() {
      this.openDropup();
    },
    triggerBuild() {
      this.triggerBuild();
    }
  }
});
