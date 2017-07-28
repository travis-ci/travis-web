import Ember from 'ember';
import PaginatedCollection from 'travis/utils/paginated-collection';
import { computed } from 'ember-decorators/object';

export default PaginatedCollection.extend(Ember.PromiseProxyMixin, {
  @computed('content')
  promise(content) {
    let promise = new Ember.RSVP.Promise(function (resolve, reject) {
      content.then(function (value) {
        resolve(PaginatedCollection.create({ content: value }));
      }, function (error) {
        reject(error);
      });
    });
    return promise;
  },
});
