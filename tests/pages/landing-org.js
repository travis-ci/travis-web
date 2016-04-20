import PageObject from 'travis/tests/page-object';

let {
  visitable,
  text
} = PageObject;

export default PageObject.create({
  visit: visitable('/'),
  heroText: text('#hero-copy h1')
});
