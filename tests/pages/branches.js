import PageObject from 'travis/tests/page-object';

let {
  hasClass,
  text,
  visitable
} = PageObject;

export default PageObject.create({
  visit: visitable(':organization/:repo/branches'),

  defaultBranch: {
    scope: '.branch-row',

    name: text('.row-name .label-align'),
    buildCount: text('.row-builds .label-align'),
    passed: hasClass('passed')
  }
});
