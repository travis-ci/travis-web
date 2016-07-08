import PageObject from 'travis/tests/page-object';

let {
  clickable,
  collection,
  text,
  visitable
} = PageObject;

const cacheComponent = {
  name: text('.row-branch .label-align'),
  lastModified: text('.row-calendar .label-align'),
  size: text('.row-size .label-align'),

  delete: clickable('.icon-trash')
};

export default PageObject.create({
  visit: visitable(':organization/:repo/caches'),

  pushCaches: collection({
    itemScope: '.push-caches .cache-item',
    item: cacheComponent
  }),

  pullRequestCaches: collection({
    itemScope: '.pull-request-caches .cache-item',
    item: cacheComponent
  })
});
