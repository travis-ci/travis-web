
import PageObject from 'travis/tests/page-object';

let {
  collection,
  hasClass,
  text,
  visitable
} = PageObject;

export default PageObject.create({
  visitBuildHistory: visitable(':organization/:repo/builds'),
  visitPullRequests: visitable(':organization/:repo/pull_requests'),

  builds: collection({
    itemScope: '.build-list .pr-row',

    item: {
      name: text('.build-info a'),

      created: hasClass('created'),
      started: hasClass('started'),
  
      passed: hasClass('passed'),
      failed: hasClass('failed'),
      errored: hasClass('errored'),

      commitSha: text('.row-commit .label-align'),
      committer: text('.row-committer .label-align'),
      commitDate: text('.row-calendar .label-align'),
      duration: text('.row-duration .label-align'),
      message: text('.row-message')
    }
  })
});
