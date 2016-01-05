import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['settings-sshkey'],
  isDeleting: false,
  actions: {
    "delete": function() {
      var deletingDone;
      if (this.get('isDeleting')) {
        return;
      }
      this.set('isDeleting', true);
      deletingDone = () => {
        return this.set('isDeleting', false);
      };
      this.get('key').deleteRecord();
      return this.get('key').save().then(deletingDone, deletingDone).then(() => {
        return this.sendAction('sshKeyDeleted');
      });
    }
  }
});
