import BasicView from 'travis/views/basic';

export default BasicView.extend({
  templateName: 'profile/tabs',
  tabBinding: 'controller.tab',
  activate() {
    return this.get('controller').activate(event.target.name);
  },

  classHooks: function() {
    return this.get('tab') === 'hooks' ? 'active' : null;
  }.property('tab'),

  classUser: function() {
    return this.get('tab') === 'user' ? 'active' : null;
  }.property('tab'),

  displayUser: function() {
    return this.get('controller.account.login') === this.get('controller.user.login');
  }.property('controller.account.login', 'controller.user.login')
});
