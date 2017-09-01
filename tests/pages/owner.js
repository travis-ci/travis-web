import PageObject from 'travis/tests/page-object';

let {
  collection,
  text,
  visitable
} = PageObject;

export default PageObject.create({
  visit: visitable('/:username'),

  repos: collection({
    scope: '.owner-tiles',
    itemScope: '.owner-tile',

    item: {
      name: text('.repo-title .label-align span.inner-underline'),
      buildNumber: text('.build-number .label-align'),
      defaultBranch: text('.default-branch .label-align'),
      commitSha: text('.commit-sha .label-align'),
      commitDate: text('.commit-date .finished-at'),

      noBuildMessage: text('p.row-item')
    }
  })
});
