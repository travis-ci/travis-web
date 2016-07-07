import PageObject from 'travis/tests/page-object';
import BuildListItem from './build-list-item';

let {
  collection,
  visitable
} = PageObject;

export default PageObject.create({
  visitBuildHistory: visitable(':organization/:repo/builds'),
  visitCrons: visitable(':organization/:repo/crons'),
  visitPullRequests: visitable(':organization/:repo/pull_requests'),

  builds: collection({
    itemScope: '.build-list .pr-row',

    item: BuildListItem
  })
});
