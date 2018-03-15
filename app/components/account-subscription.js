import Component from '@ember/component';
import { service } from 'ember-decorators/service';
import { computed } from 'ember-decorators/object';

import ObjectProxy from '@ember/object/proxy';
import PromiseProxyMixin from '@ember/object/promise-proxy-mixin';
let ObjectPromiseProxy = ObjectProxy.extend(PromiseProxyMixin);

export default Component.extend({
  @service ajax: null,
  @service store: null,

  @computed()
  subscription() {
    let options = {
      headers: {
        'Travis-API-Version': '3'
      }
    };

    let owner = this.get('account.login');
    let includes = '?include=owner.subscription';
    let url = `/owner/${owner}${includes}`;

    return ObjectPromiseProxy.create({
      promise: this.get('ajax').ajax(url, 'get', options).then(response => response.subscription)
    });
  },
});
