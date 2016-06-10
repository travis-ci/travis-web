import PageObject from 'travis/tests/page-object';

let {
  collection,
  hasClass,
  is,
  text,
  visitable
} = PageObject;

export default PageObject.create({
  visit: visitable(':organization/:repo/branches'),

  defaultBranch: {
    scope: '.default-branch .branch-row',

    name: text('.row-name .label-align'),
    buildCount: text('.row-builds .label-align'),
    passed: hasClass('passed'),

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
  },

  activeBranches: collection({
    scope: '.active-branches',
    itemScope: '.branch-row',

    item: {
      name: text('.row-name .label-align')
    }
  }),

  inactiveBranches: collection({
    scope: '.inactive-branches',
    itemScope: '.branch-row',

    item: {
      name: text('.row-name .label-align')
    }
  })
});
