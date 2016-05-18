import PageObject from 'travis/tests/page-object';

let {
  hasClass,
  text,
  visitable
} = PageObject;

export default PageObject.create({
  visit: visitable(':organization/:repo/settings'),

  buildOnlyWithTravisYml: {
    scope: 'section.settings-section li:first-of-type .switch',

    isActive: hasClass('active')
  },

  buildPushes: {
    scope: 'section.settings-section li:nth-of-type(2) .switch',

    isActive: hasClass('active')
  }
});
