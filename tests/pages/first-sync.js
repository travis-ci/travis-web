import PageObject from 'travis/tests/page-object';

let {
  text
} = PageObject;

export default PageObject.create({
  heading: text('h1.content-title')
});
