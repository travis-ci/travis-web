import V3Adapter from 'travis/adapters/v3';

export default V3Adapter.extend({
  includes: 'organization.installation',

  pathForType: function () {
    return 'orgs';
  },
});
