import Ember from 'ember';
import PaginatedCollection from 'travis/utils/paginated-collection';

export default PaginatedCollection.extend(Ember.PromiseProxyMixin, {
  promise: Ember.computed('content', function () {
    let content = this.get('content');
    let promise = new Ember.RSVP.Promise(function (resolve, reject) {
      content.then(function (value) {
        resolve(PaginatedCollection.create({ content: value }));
      }, function (error) {
        reject(error);
      });
    });
    return promise;
  })
});
