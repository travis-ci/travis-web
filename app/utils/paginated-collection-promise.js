import { Promise as EmberPromise } from 'rsvp';
import PromiseProxyMixin from '@ember/object/promise-proxy-mixin';
import PaginatedCollection from 'travis/utils/paginated-collection';
import { computed } from 'ember-decorators/object';

export default PaginatedCollection.extend(PromiseProxyMixin, {
  @computed('content')
  promise(content) {
    let promise = new EmberPromise((resolve, reject) => {
      content.then((value) => {
        resolve(PaginatedCollection.create({ content: value }));
      }, (error) => {
        reject(error);
      });
    });
    return promise;
  },
});
