import PageObject from 'travis/tests/page-object';

let {
  visitable,
  text,
  collection
} = PageObject;

export default PageObject.create({
  visit: visitable('/'),
  heroText: text('#hero-copy h1'),
  headerLinks: collection({
    scope: 'nav#navigation ul',
    itemScope: 'li a',
    item: {
      linkText: text(),
    }
  }),
  helpLink: text('nav#navigation ul li span')
});
