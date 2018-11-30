import { later } from '@ember/runloop';
import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { alias } from '@ember/object/computed';

export default Component.extend({
  permissionsService: service('permissions'),
  api: service(),
  flashes: service(),

  tagName: 'li',
  classNameBindings: ['repo.active:is-active'],
  classNames: ['rows', 'rows--dashboard'],
  isLoading: false,
  isTriggering: false,
  dropupIsOpen: false,

  currentBuild: alias('repo.currentBuild'),

  displayMenuTofu: alias('repo.permissions.create_request'),

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
