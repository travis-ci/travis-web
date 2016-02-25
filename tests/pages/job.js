import PageObject from 'travis/tests/page-object';

let {
  text
} = PageObject;

export default PageObject.create({
  branch: text('.commit-branch'),
  message: text('.build-title'),
  state: text('.build-status'),
  author: text('.commit-author'),
  log: text('#log'),
  logError: text('.job-log .notice')
});
