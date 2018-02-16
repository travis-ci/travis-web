import {
  create,
  collection,
  text,
  visitable
} from 'ember-cli-page-object';

export default create({
  visit: visitable('/:username'),

  repos: collection('.owner-tiles .owner-tile', {
    name: text('.repo-title .label-align span.inner-underline'),
    buildNumber: text('.build-number .label-align'),
    defaultBranch: text('.default-branch .label-align'),
    commitSha: text('.commit-sha .label-align'),
    commitDate: text('.commit-date .finished-at'),

    noBuildMessage: text('p.row-item')
  })
});
