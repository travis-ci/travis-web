import PageObject from 'ember-cli-page-object';

let {
  text
} = PageObject;

export default PageObject.create({
  heading: text('h1.content-title')
});
