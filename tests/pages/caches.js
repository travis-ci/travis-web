import PageObject from 'travis/tests/page-object';

let {
  clickable,
  collection,
  text,
  visitable
} = PageObject;

const cacheComponent = {
  name: text('.row-item:eq(0) .label-align'),
  lastModified: text('.row-item:eq(1) .label-align'),
  size: text('.row-item:eq(2) .label-align'),

  delete: clickable('.icon-trash')
};

export default PageObject.create({
  visit: visitable(':organization/:repo/caches'),

  pushCaches: collection({
    itemScope: 'ul.caches-list:eq(0) .cache-item',
    item: cacheComponent
  }),

  pullRequestCaches: collection({
    itemScope: 'ul.caches-list:eq(1) .cache-item',
    item: cacheComponent
  })
});
