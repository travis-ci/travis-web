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
    currentViewNumber: text('.branch-current-active'),
    totalNumber: text('.branch-count-active'),
    itemScope: '.branch-row',

    item: branchRowComponent
  }),

  inactiveBranches: collection({
    scope: '.deleted-branches',
    isVisible: isVisible('.deleted-branches'),
    countNumber: text('.deleted-branch-count'),
    itemScope: '.branch-row',

    info: text('.deleted-branches .note'),
    cta: clickable('.deleted-branches .branches-cta'),

    item: branchRowComponent
  })
});
