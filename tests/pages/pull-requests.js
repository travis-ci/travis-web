import PageObject from 'travis/tests/page-object';

let {
  collection,
  hasClass,
  is,
  text,
  visitable
} = PageObject;

export default PageObject.create({
  visit: visitable(':organization/:repo/pull_requests'),

  pullRequests: collection({
    itemScope: '.build-list .pr-row',

    item: {
      name: text('.row-name .label-align'),
      buildCount: text('.row-builds .label-align'),

      passed: hasClass('passed'),
      failed: hasClass('failed'),
      errored: hasClass('errored'),

      request: text('.row-request .label-align'),
      commitSha: text('.row-commit .label-align'),
      committer: text('.row-commiter .label-align'),
      commitDate: text('.row-calendar .label-align')
    }
  })
});
