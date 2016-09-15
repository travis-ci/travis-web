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
      name: text('.repo-title a .label-align')
    }
  })
});
