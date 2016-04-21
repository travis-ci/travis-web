import PageObject from 'travis/tests/page-object';

let {
  visitable,
  text,
  collection
} = PageObject;

export default PageObject.create({
  visit: visitable('/'),
  heroText: text('#landing h1.h1--teal'),
  headerLinks: collection({
    scope: 'nav#navigation ul',
    itemScope: 'li a',
    item: {
      linkText: text(),
    }
  }),
});
