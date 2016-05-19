import PageObject from 'travis/tests/page-object';

let {
  hasClass,
  text,
  value,
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
  },

  limitConcurrentBuilds: {
    scope: 'section.settings-section .limit-concurrent-builds',

    isActive: hasClass('active', '.switch'),
    value: value('input')
  }
});
