import {
  create,
  visitable,
  hasClass
} from 'ember-cli-page-object';

export default create({
  visit: visitable('/travis-ci/travis-web/branches'),
  branchesTabActive: hasClass('active', '#tab_branches')
});
