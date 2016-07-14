import PageObject from 'travis/tests/page-object';

let {
  text
} = PageObject;

export default PageObject.create({
  automaticSignOutNotification: text('p.flash-message')
});
