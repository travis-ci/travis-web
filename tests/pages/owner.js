import {
  create,
  collection,
  text,
  visitable
} from 'ember-cli-page-object';

export default create({
  visit: visitable('/:username'),

  repos: collection('.owner-tiles .owner-tile', {
    name: text('.repo-title span.label-align'),
    buildNumber: text('.build-number .label-align'),
    defaultBranch: text('.default-branch .default-branch-name'),
    commitSha: text('.commit-sha .commit-compare'),
    commitDate: text('.owner-tile-date .finished-at'),

    noBuildMessage: text('p.row-content')
  })
});
