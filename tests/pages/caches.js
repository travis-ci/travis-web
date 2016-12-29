import PageObject from 'travis/tests/page-object';

let {
  clickable,
  collection,
  isVisible,
  text,
  visitable
} = PageObject;

const cacheComponent = {
  name: text('.row-branch .label-align'),
  lastModified: text('.row-calendar .label-align'),
  size: text('.row-size .label-align'),

  delete: clickable('.delete-cache-icon')
};

export default PageObject.create({
  visit: visitable(':organization/:repo/caches'),

  deleteAllCaches: clickable('.delete-cache-button'),
  noCachesExist: isVisible('p.helptext.no-caches'),

  pushCaches: collection({
    itemScope: '.push-caches .cache-item',
    item: cacheComponent
  }),

  pullRequestCaches: collection({
    itemScope: '.pull-request-caches .cache-item',
    item: cacheComponent
  })
});
