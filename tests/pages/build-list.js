
import PageObject from 'travis/tests/page-object';

let {
  clickable,
  collection,
  hasClass,
  isVisible,
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

      passed: hasClass('passed'),
      failed: hasClass('failed'),
      errored: hasClass('errored'),

      commitSha: text('.row-commit .label-align'),
      committer: text('.row-committer .label-align'),
      commitDate: text('.row-calendar .label-align'),
      duration: text('.row-duration .label-align'),
      message: text('.row-message')
    }
  }),

  showMoreButton: {
    scope: 'button.showmore-button',

    exists: isVisible(),
    click: clickable()
  }
});
