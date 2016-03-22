import PageObject from 'travis/tests/page-object';

let {
  clickable,
  visitable,
  text
} = PageObject;

export default PageObject.create({
  automaticSignOutNotification: text('p.flash-message')
});
