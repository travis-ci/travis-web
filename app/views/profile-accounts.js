import BasicView from 'travis/views/basic';

export default BasicView.extend({
  tabBinding: 'controller.tab',
  classNames: ['profile-orglist', 'columns', 'medium-4'],
  tagName: 'aside',
  templateName: 'profile/accounts'
});
