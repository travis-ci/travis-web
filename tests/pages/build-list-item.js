import PageObject from 'travis/tests/page-object';

const {
  hasClass,
  is,
  text
} = PageObject;

export default {
  name: text('.build-info a'),

  passed: hasClass('passed'),
  failed: hasClass('failed'),
  errored: hasClass('errored'),

  commitSha: text('.row-commit .label-align'),
  committer: text('.row-committer .label-align'),
  commitDate: text('.row-calendar .label-align'),
  duration: text('.row-duration .label-align')
};
