import PageObject from 'travis/tests/page-object';

let {
  visitable,
  text
} = PageObject;

export default PageObject.create({
  visit: visitable('/'),
  heroText: text('#landing h1.h1--teal')
});
