import PageObject from 'travis/tests/page-object';

let {
  attribute,
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

  showsNoBuildsMessaging: text('.missing-notice h2.page-title'),

  notification: text('p.flash-message'),

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
      requestIconTitle: attribute('title', '.request-icon'),
      duration: text('.row-duration .label-align'),
      message: text('.row-message'),

      cancelButton: {
        scope: '.action-button--cancel',
        visible: isVisible(),
        click: clickable()
      }
    }
  }),

  showMoreButton: {
    scope: 'button.showmore-button',

    exists: isVisible(),
    click: clickable()
  }
});
