import V3Adapter from 'travis/adapters/v3';

export default V3Adapter.extend({
  includes: 'owner.installation',

  pathForType: function () {
    return 'orgs';
  },
});
