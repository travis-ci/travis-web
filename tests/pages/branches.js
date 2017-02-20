import PageObject from 'travis/tests/page-object';

let {
  collection,
  hasClass,
  is,
  text,
  visitable,
  isVisible,
  isHidden
} = PageObject;

const branchRowComponent = {
  scope: '.branch-row',

  name: text('.row-name .label-align'),
  buildCount: text('.row-builds .label-align'),

  passed: hasClass('passed'),
  failed: hasClass('failed'),
  errored: hasClass('errored'),
  created: hasClass('created'),

  helptext: text('.helptext'),
  title: text('h2.small-title'),

  request: text('.row-request .label-align'),
  commitSha: text('.row-commit span.inner-underline'),
  committer: text('.row-commiter .label-align'),
  commitDate: text('.row-calendar .label-align'),

  buildTiles: collection({
    itemScope: '.build-tiles li',

    item: {
      passed: hasClass('passed'),
      failed: hasClass('failed'),
      errored: hasClass('errored'),
      empty: is(':empty'),

      number: text('.build-tile-number')
    }
  })
};

export default PageObject.create({
  visit: visitable(':organization/:repo/branches'),

  branchesTabActive: hasClass('active', '#tab_branches'),

  showsNoBranchesMessaging: text('.missing-notice h2.page-title'),

  defaultBranch: collection({
    scope: '.default-branch',
    itemScope: '.branch-row',
    item: branchRowComponent
  }),

  deletedBranchesVisible: isVisible('.deleted-branches .blank-list'),
  deletedBranchesNotVisible: isHidden('.deleted-branches .blank-list'),

  activeBranches: collection({
    scope: '.active-branches',
    itemScope: '.branch-row',
    item: branchRowComponent
  }),

  inactiveBranches: collection({
    scope: '.deleted-branches',
    itemScope: '.branch-row',
    item: branchRowComponent
  })
});
