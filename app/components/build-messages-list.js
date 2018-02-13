import Component from '@ember/component';
import { computed } from 'ember-decorators/object';
import { service } from 'ember-decorators/service';

import ObjectProxy from '@ember/object/proxy';
import PromiseProxyMixin from '@ember/object/promise-proxy-mixin';
let ObjectPromiseProxy = ObjectProxy.extend(PromiseProxyMixin);
import { Promise as EmberPromise } from 'rsvp';

export default Component.extend({
  @service ajax: null,
  @service store: null,

  @computed('repo.id', 'build.request.id')
  messagesRequest(repoId, requestId) {
    if (requestId) {
      return ObjectPromiseProxy.create({
        promise: this.get('ajax').ajax(`/repo/${repoId}/request/${requestId}/messages`, 'GET', {
          headers: {
            'Travis-API-Version': '3'
          }})
          .then(response => ({messages: response.messages}))
      });
    } else {
      return ObjectPromiseProxy.create({
        promise: EmberPromise.resolve([])
      });
    }
  }
});
