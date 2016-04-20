import PageObject from 'travis/tests/page-object';

let {
  visitable,
  text
} = PageObject;

export default PageObject.create({
  visit: visitable('profile/:username'),
  name: text('.profile-header h1')
});
