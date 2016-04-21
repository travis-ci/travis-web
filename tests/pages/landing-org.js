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
    itemScope: 'nav#navigation ul',
    item: {
      linkText: text('li', { at: 0 }),
    }
  }),
  helpLink: text('nav#navigation ul li span')
});
