import {
  create,
  attribute,
  clickable,
  collection,
  hasClass,
  isVisible,
  text,
  visitable
} from 'ember-cli-page-object';

export default create({
  visitBuildHistory: visitable('github/:organization/:repo/builds'),
  visitPullRequests: visitable('github/:organization/:repo/pull_requests'),

  showsNoBuildsMessaging: text('.missing-notice h2.page-title'),

  builds: collection('.build-list .pr-row', {
    name: text('.build-info a'),
    badge: text('[data-test-build-list-draft-badge]'),

    created: hasClass('created'),
    started: hasClass('started'),

    passed: hasClass('passed'),
    failed: hasClass('failed'),
    errored: hasClass('errored'),

    commitSha: text('.row-commit .label-align'),
    committer: text('.row-committer .label-align'),

    commitDate: {
      scope: '.row-calendar div',
      title: attribute('title'),
      text: text('.label-align')
    },

    requestIconTitle: attribute('title', '.row-item.request span[title]'),
    duration: text('.row-duration .label-align'),
    message: text('.row-message'),

    cancelButton: {
      scope: '.action-button--cancel',
      visible: isVisible(),
      click: clickable()
    }
  }),

  showMoreButton: {
    scope: 'button.showmore-button',

    exists: isVisible(),
    click: clickable()
  }
});
