import BasicView from 'travis/views/basic';
import { githubAdmin as githubAdminUrl } from 'travis/utils/urls';

export default BasicView.extend({
  templateName: 'profile/tabs/hooks',
  userBinding: 'controller.user',

  urlGithubAdmin: function() {
    return githubAdminUrl(this.get('hook.slug'));
  }.property('hook.slug')
});
