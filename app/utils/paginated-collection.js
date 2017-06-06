import Ember from 'ember';

const { alias } = Ember.computed;

export default Ember.ArrayProxy.extend(Ember.PromiseProxyMixin, {

  promise: Ember.computed('content', function () {
    let _self = this;
    let content = this.get('content');
    let promise = new Ember.RSVP.Promise(function(resolve, reject) {
      content.then(function() {
        resolve(_self);
      }, function(error) {
        reject(error);
      });
    });
    return promise;
  }),

  arrangedContent: alias('content.content'),

  'pagination.total': alias('content.content.meta.pagination.count')

});
