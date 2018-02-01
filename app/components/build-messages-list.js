import Component from '@ember/component';
import { computed } from 'ember-decorators/object';
import fetch from 'fetch';
import { service } from 'ember-decorators/service';

import ObjectProxy from '@ember/object/proxy';
import PromiseProxyMixin from '@ember/object/promise-proxy-mixin';
let ObjectPromiseProxy = ObjectProxy.extend(PromiseProxyMixin);

export default Component.extend({
  @service store: null,

  @computed('repo.id', 'build.request.id')
  messagesRequest(repoId, requestId) {
    const urlRoot = this.get('store').adapterFor('v3').buildURL('repo', repoId);

    return ObjectPromiseProxy.create({
      promise: fetch(`${urlRoot}/request/${requestId}/messages`, {
        headers: {
          'Travis-API-Version': '3'
        }})
        .then(response => response.json()).then(response => ({messages: response.messages}))
    });
  }
});
