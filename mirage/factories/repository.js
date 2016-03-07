import Mirage from 'ember-cli-mirage';

export default Mirage.Factory.extend({
  slug: 'travis-ci/travis-web',
  githubLanguage: 'ruby',
  active: true
});
