import PageObject from 'travis/tests/page-object';

let {
  hasClass,
  text,
  visitable
} = PageObject;

export default PageObject.create({
  visit: visitable(':organization/:repo/settings'),

  buildOnlyWithTravisYml: {
    scope: 'section.settings-section .builds_only_with_travis_yml.switch',

    isActive: hasClass('active')
  },

  buildPushes: {
    scope: 'section.settings-section .build_pushes.switch',

    isActive: hasClass('active')
  }
});
