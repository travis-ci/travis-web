import { later } from '@ember/runloop';
import Component from '@ember/component';
import { service } from 'ember-decorators/service';
import { computed } from 'ember-decorators/object';
import { alias } from 'ember-decorators/object/computed';

export default Component.extend({
  @service('permissions') permissionsService: null,
  @service externalLinks: null,
  @service api: null,
  @service flashes: null,

  tagName: 'li',
  classNameBindings: ['repo.active:is-active'],
  classNames: ['rows', 'rows--dashboard'],
  isLoading: false,
  isTriggering: false,
  dropupIsOpen: false,

  @alias('repo.currentBuild') currentBuild: null,

  @computed('repo.slug', 'currentBuild.commit.sha')
  urlGitHubCommit(slug, sha) {
    return this.get('externalLinks').githubCommit(slug, sha);
  },

  @alias('repo.permissions.create_request') displayMenuTofu: null,

  openDropup() {
    this.toggleProperty('dropupIsOpen');
    later((() => { this.set('dropupIsOpen', false); }), 4000);
  },

  mouseLeave() {
    this.set('dropupIsOpen', false);
  },

  triggerBuild() {
    const self = this;
    let data = {};
    data.request = `{ 'branch': '${this.get('repo.defaultBranch.name')}' }`;

    this.get('api').post(`/repo/${this.get('repo.id')}/requests`, { data: data })
      .then(() => {
        self.set('isTriggering', false);
        self.get('flashes')
          .success(`You’ve successfully triggered a build for ${self.get('repo.slug')}.
                   Hold tight, it might take a moment to show up.`);
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
    },

    starRepo() {
      if (this.get('repo.starred')) {
        this.get('unstar').perform(this.get('repo'));
      } else {
        this.get('star').perform(this.get('repo'));
      }
    }
  }
});
