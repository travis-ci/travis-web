import Ember from 'ember';
import PaginatedCollection from 'travis/utils/paginated-collection';
import { computed } from 'ember-decorators/object';

export default PaginatedCollection.extend(Ember.PromiseProxyMixin, {
  @computed('content')
  promise(content) {
    let promise = new Ember.RSVP.Promise((resolve, reject) => {
      content.then((value) => {
        resolve(PaginatedCollection.create({ content: value }));
      }, (error) => {
        reject(error);
      });
    });
    return promise;
  },
});
