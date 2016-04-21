import PageObject from 'travis/tests/page-object';

let {
  collection,
  hasClass,
  text,
  visitable
} = PageObject;

export default PageObject.create({
  visit: visitable('profile/:username'),
  name: text('.profile-header h1'),

  hooks: collection({
    itemScope: '.profile-hooklist .row',

    item: {
      name: text('a.profile-repo'),
      isActive: hasClass('active', '.switch--icon')
    }
  })
});
