import Service from "@ember/service";
import {A} from "@ember/array";
import {task} from "ember-concurrency";
import {inject as service} from '@ember/service';


export default class RefreshService extends Service {
  @service store;

  @task( function* (arg) {
    const repo = arg.get ? arg : this.store.peekRecord('repo', arg);
    const offset = repo.builds.length;
    yield this.store.query('build', {offset: offset, repository_id: repo.id, event_type: ['push', 'api', 'cron']});
    repo.set('buildsRefreshToken', Date.now());
  })
  refreshBuildsInRepos;
  
}
