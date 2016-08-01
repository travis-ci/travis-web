import Ember from 'ember';

const { service } = Ember.inject;
const { alias } = Ember.computed;

export default Ember.Component.extend({
  permissions: service(),
  externalLinks: service(),
  ajax: service(),
  flashes: service(),

  tagName: 'li',
  classNameBindings: ['repo.active:is-active'],
  classNames: ['rows', 'rows--dashboard'],
  isLoading: false,
  isTriggering: false,
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
        self.set('isTriggering', false);
        self.get('flashes')
          .success(`You successfully triggered a build for ${self.get('repo.slug')}.
                   It might take a moment to show up though.`);
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
