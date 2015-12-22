import Ember from 'ember';

export default Ember.Component.extend({
  actions: {
    close() {
      $('.popup').removeClass('display');
      return false;
    },

    removeLog() {
      var job = this.get('job');
      $('.popup').removeClass('display');

      return job.removeLog().then(function() {
        return Travis.flash({ success: 'Log has been successfully removed.' });
      }, function(xhr) {
        if (xhr.status === 409) {
          return Travis.flash({ error: 'Log can\'t be removed' });
        } else if (xhr.status === 401) {
          return Travis.flash({ error: 'You don\'t have sufficient access to remove the log' });
        } else {
          return Travis.flash({ error: 'An error occured when removing the log' });
        }
      });
    }
  }
});
