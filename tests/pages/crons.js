import PageObject from 'travis/tests/page-object';

let {
  collection,
  hasClass,
  is,
  text,
  visitable
} = PageObject;

export default PageObject.create({
  visit: visitable(':organization/:repo/crons'),

  crons: collection({
    itemScope: '.build-list .pr-row',

    item: {
      name: text('.build-info a'),

      passed: hasClass('passed'),
      failed: hasClass('failed'),
      errored: hasClass('errored'),

      commitSha: text('.row-commit .label-align'),
      committer: text('.row-committer .label-align'),
      commitDate: text('.row-calendar .label-align'),
      duration: text('.row-duration .label-align')
    }
  })
});
