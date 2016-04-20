import Ember from 'ember';

const { service } = Ember.inject;

export default Ember.Component.extend({
  flashes: service(),

  actions: {
    close() {
      $('.popup').removeClass('display');
      return false;
    },

    removeLog() {
      var job = this.get('job');
      $('.popup').removeClass('display');

      return job.removeLog().then(function() {
        return this.get('flashes').success('Log has been successfully removed.');
      }, function(xhr) {
        if (xhr.status === 409) {
          return this.get('flashes').error('Log can\'t be removed');
        } else if (xhr.status === 401) {
          return this.get('flashes').error('You don\'t have sufficient access to remove the log');
        } else {
          return this.get('flashes').error('An error occured when removing the log');
        }
      });
    }
  }
});
