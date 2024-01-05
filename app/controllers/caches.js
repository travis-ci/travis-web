import EmberObject, { computed } from '@ember/object';
import Controller from '@ember/controller';
import config from 'travis/config/environment';
import { inject as service } from '@ember/service';
import { alias, reads } from '@ember/object/computed';
import { task } from 'ember-concurrency';
import {tracked} from "@glimmer/tracking";

export default class extends Controller {
  @service api;
  @service flashes;

  config = config;

  @tracked pushes;
  @tracked pullRequests;
  @tracked repo;

  constructor() {
    super(...arguments);
  }

  @computed('pushes.[]', 'pullRequests.[]')
  get cachesExist() {
    return this.pushes?.length || this.pullRequests?.length;
  }

  @task(function* () {
    if (config.skipConfirmations || confirm('Are you sure?')) {
      try {
        yield this.api.delete(`/repo/${this.repo.id}/caches`);
        this.set('pullRequests', EmberObject.create());
        this.set('pushes', EmberObject.create());
      } catch (e) {
        this.flashes.error('Could not delete the caches');
      }
    }
  }).drop()
  deleteRepoCache;

  reassignPullRequests(val, component) {
    component.set('pullRequests', val);
  }

  reassignPushes(val, component) {
    component.set('pushes', val);
  }
}
