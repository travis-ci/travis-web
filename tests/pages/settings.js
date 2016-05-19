import PageObject from 'travis/tests/page-object';

let {
  collection,
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
  },

  buildPullRequests: {
    scope: 'section.settings-section .build_pull_requests.switch',

    isActive: hasClass('active')
  },

  environmentVariables: collection({
    scope: '.settings-list--envvars',
    itemScope: '.settings-envvar',

    item: {
      name: text('.env-var-name'),
      isPublic: hasClass('is-public'),
      value: value('input')
    }
  }),

  crons: collection({
    scope: '.settings-list--crons',
    itemScope: '.settings-cron',

    item: {
      branchName: text('.branch-name'),
      interval: text('.interval'),
      nextEnqueuing: text('.next-enqueuing'),
      disableByBuildText: text('.disable-by-build')
    }
  })
});
