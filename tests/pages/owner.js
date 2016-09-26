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
      // FIXME add a class
      defaultBranch: text('.row-item:eq(2) .label-align'),

      noBuildMessage: text('p.row-item')
    }
  })
});
