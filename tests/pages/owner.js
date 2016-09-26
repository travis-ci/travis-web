import PageObject from 'travis/tests/page-object';

let {
  collection,
  text,
  visitable
} = PageObject;

export default PageObject.create({
  visit: visitable('/:username'),

  repos: collection({
    scope: '.owner-tiles',
    itemScope: '.owner-tile',

    item: {
      name: text('.repo-title a .label-align'),
      buildNumber: text('.row-item:eq(1) .label-align'),
      defaultBranch: text('.default-branch .label-align'),
      commitSha: text('.row-item:eq(3) .label-align'),

      noBuildMessage: text('p.row-item')
    }
  })
});
