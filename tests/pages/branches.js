import PageObject from 'travis/tests/page-object';

let {
  collection,
  hasClass,
  is,
  text,
  visitable,
  clickable,
  isVisible
} = PageObject;

const branchRowComponent = {
  scope: '.default-branch .branch-row',

  name: text('.row-name .label-align'),
  buildCount: text('.row-builds .label-align'),

  passed: hasClass('passed'),
  failed: hasClass('failed'),
  errored: hasClass('errored'),
  created: hasClass('created'),

  request: text('.row-request .label-align'),
  commitSha: text('.row-commit .label-align'),
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

  defaultBranch: branchRowComponent,

  activeBranches: collection({
    scope: '.active-branches',
    itemScope: '.branch-row',
    loadMore: clickable('.active-branches .button'),
    item: branchRowComponent
  }),

  inactiveBranches: collection({
    scope: '.inactive-branches',
    inactiveBranchesVisible: isVisible('.inactive-branch-list'),
    inactiveBranchesNotVisible: isVisible('.inactive-branches-hidden'),
    countNumber: isVisible('.inactive-branch-count'),
    itemScope: '.branch-row',

    info: text('.inactive-branches-hidden .helptext'),
    getMoreBtn: clickable('.inactive-branches .button'),

    item: branchRowComponent
  })
});
