import Component from '@ember/component';
import { computed } from 'ember-decorators/object';
import fetch from 'fetch';
import { service } from 'ember-decorators/service';

export default Component.extend({
  @service store: null,
  @computed('repo.id', 'build.request_id')
  messages(repoId, requestId) {
    const urlRoot = this.get('store').adapterFor('v3').buildURL('repo', repoId);

    return fetch(`${urlRoot}/request/${requestId}/messages`)
      .then(response => response.json()).then(response => {
        this.set('actualMessages', response.messages);
        return response.messages;
      });
  }
});
