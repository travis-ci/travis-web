import BasicView from 'travis/views/basic';
var View;

View = BasicView.extend({
  tabBinding: 'controller.tab',

  classHome: function() {
    return this.get('tab') === 'home' ? 'active' : null;
  }.property('tab'),

  classStats: function() {
    return this.get('tab') === 'stats' ? 'active' : null;
  }.property('tab'),

  classProfile: function() {
    var classes = ['profile menu'];

    if (this.get('tab') === 'profile') {
      classes.push('active');
    }

    classes.push(this.get('controller.auth.state') || 'signed-out');

    return classes.join(' ');
  }.property('tab', 'controller.auth.state'),

  showProfile() {
    $('#top .profile ul').show();
  },

  hideProfile() {
    $('#top .profile ul').hide();
  }
});

export default View;
