import BasicView from 'travis/views/basic';

export default BasicView.extend({
  templateName: 'profile/show',
  layoutName: 'layouts/profile',
  classNames: ['profile-view'],
  accountBinding: 'controller.account',

  name: function() {
    return this.get('account.name') || this.get('account.login');
  }.property('account.name', 'account.login')
});
