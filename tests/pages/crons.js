import PageObject from 'travis/tests/page-object';
import BuildListItem from './build-list-item';

let {
  collection,
  visitable
} = PageObject;

export default PageObject.create({
  visit: visitable(':organization/:repo/crons'),

  crons: collection({
    itemScope: '.build-list .pr-row',

    item: BuildListItem
  })
});
