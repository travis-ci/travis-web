import Ember from 'ember';

export default Ember.Mixin.create({
  showMore() {
    const id = this.get('repo.id'),
      buildsLength = this.get('builds.length');
    let number = this.get('builds.lastObject.number');

    const defaultBranchLastBuildNumber = this.get('repo.defaultBranch.lastBuild.number');

    /**
      * This is a hackish fix for a bug involving a gap in the build history list.
      * The repos endpoint includes the last build on the default build, and
      * if there hasn’t been a build on it in a while, the build history query will
      * only show the 20 most recent builds, so there will be a gap before the default
      * branch build. Without this workaround, clicking the Show More button will
      * not load the builds within the gap.
      */
    if (number === defaultBranchLastBuildNumber) {
      const builds = this.get('builds');

      if (builds.length > 2) {
        number = builds[builds.length - 2].get('number');
      }
    }

    const tabName = this.get('tab');
    const singularTab = tabName.substr(0, tabName.length - 1);
    const type = this.get('tab') === 'builds' ? 'push' : singularTab;
    this.loadMoreBuilds(id, buildsLength, type);
  },

  loadMoreBuilds(id, buildsLength, type) {
    var options;
    options = {
      repository_id: id,
      offset: buildsLength
    };
    if (type != null) {
      options.event_type = type.replace(/s$/, '');
      if (options.event_type === 'push') {
        options.event_type = ['push', 'api', 'cron'];
      }
    }
    return this.store.query('build', options);
  },

  actions: {
    showMoreBuilds() {
      return this.showMore();
    }
  }
});
