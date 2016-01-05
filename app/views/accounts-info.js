import BasicView from 'travis/views/basic';

export default BasicView.extend({
  templateName: 'profile/tabs/user',
  userBinding: 'controller.user',

  gravatarUrl: function() {
    return location.protocol + "//www.gravatar.com/avatar/" + (this.get('user.gravatarId')) + "?s=200&d=mm";
  }.property('user.gravatarId')
});
