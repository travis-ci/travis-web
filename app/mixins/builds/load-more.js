import Mixin from '@ember/object/mixin';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';

export default Mixin.create({
  tabStates: service(),

  loadMoreBuilds: task(function* () {

    const tabName = this.get('tabStates.mainTab');
    const singularTab = tabName.substr(0, tabName.length - 1);
    const type = tabName === 'builds' ? 'push' : singularTab;
    const options = this._constructOptions(type);
    yield this.store.query('build', options);
  }).drop(),

  _constructOptions(type) {
    let options = {
      repository_id: this.get('repo.id'),
      offset: this.get('builds.length'),
    };
    if (type != null) {
      options.event_type = type.replace(/s$/, '');
      if (options.event_type === 'push') {
        options.event_type = ['push', 'api', 'cron'];
      }
    }

    return options;
  },
});
