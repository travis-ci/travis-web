import { sort, alias, reads } from '@ember/object/computed';
import Controller, { inject as controller } from '@ember/controller';
import LoadMoreBuildsMixin from 'travis/mixins/builds/load-more';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { task } from 'ember-concurrency';

const mixins = [LoadMoreBuildsMixin];

export default Controller.extend(...mixins, {
  tabStates: service(),
  features: service(),
  externalLinks: service(),
  permissions: service(),

  buildsSorting: ['number:desc'],
  builds: sort('model', 'buildsSorting'),
  oldBuilds: [],

  repoController: controller('repo'),
  repo: alias('repoController.repo'),
  tab: alias('repoController.tab'),

  showBuildHistoryLink: computed('repo.{isMigrated,isHistoryMigrated}', 'builds.length', 'features.proVersion', function () {
    const { isMigrated, isHistoryMigrated } = this.repo;
    const proVersion = this.get('features.proVersion');
    const hasBuilds = this.builds.length > 0;
    return isMigrated && !isHistoryMigrated && hasBuilds && proVersion;
  }),

  buildHistoryLink: computed('repo.slug', function () {
    return this.externalLinks.orgBuildHistoryLink(this.repo.slug);
  }),

  hasBuildBackups: reads('repo.hasBuildBackups'),

  displayShowMoreButton: computed('tab', 'loadMoreBuilds.isRunning', 'builds', function () {
    const builds = this.get('builds');
    let tab = this.tab;
    if (builds.length == this.repo.buildCount) {
      return false;
    }

    this.set('oldBuilds', builds);
    return tab !== 'branches' && true;
  }),

  displayMoreShowExportFiles: computed('repo.buildBackups', function () {
    return this.repo.buildBackups === undefined;
  }),

  lastExportFiles: reads('repo.buildBackupsLast'),

  loadMoreExportFiles: task(function* () {
    yield this.repo.fetchBuildBackups.perform();
  }).drop(),

  displayExportFiles: computed('permissions.all', 'repo', function () {
    let repo = this.repo;
    return this.permissions.hasPushPermission(repo);
  }),

});
