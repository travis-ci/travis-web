import { Promise as EmberPromise } from 'rsvp';
import PromiseProxyMixin from '@ember/object/promise-proxy-mixin';
import PaginatedCollection from 'travis/utils/paginated-collection';
import { computed } from '@ember/object';

export default PaginatedCollection.extend(PromiseProxyMixin, {
  promise: computed('content', function () {
    let content = this.content;
    let promise = new EmberPromise((resolve, reject) => {
      content.then((value) => {
        resolve(PaginatedCollection.create({ content: value }));
      }, (error) => {
        reject(error);
      });
    });
    return promise;
  }),
});
