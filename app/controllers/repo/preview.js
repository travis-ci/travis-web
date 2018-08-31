import Controller from '@ember/controller';
import { fetch, Headers } from 'fetch';
import { task } from 'ember-concurrency';
import { get } from '@ember/object';
import { service } from 'ember-decorators/service';
import EmberObject from '@ember/object';

export default Controller.extend({
  @service store: null,

  selected: null,

  fetch: task(function* () {
    // FIXME obvs
    let url = new URL(`http://localhost:4567/${this.get('selected.repo.slug')}/${this.get('selected.commit.sha')}`);
    let headers = {
      'Accept': 'application/json'
    };

    if (this.get('eventType')) {
      url.searchParams.append('event_type', this.get('eventType'));
    }

    let response = yield fetch(url, {
      headers: new Headers(headers)
    });

    let json = yield response.json();

    let yaml = get(json, 'request.yaml_config.yaml');

    if (yaml) {
      this.set('yaml', yaml);

      let jobs;

      if (json.stages) {
        jobs = json.stages.reduce((jobs, stage) => jobs.concat(stage.jobs.map(jobJson => {
          let job = EmberObject.create(jobJson);
          job.set('stage', {id: stage.number});
          return job;
        })), []);
      }

      let build = EmberObject.create({
        jobs
      });
      this.set('build', build);
      this.set('eventType', json.event_type);

      this.set('stages', json.stages.map(stageJson => {
        let stage = this.get('store').createRecord('stage', stageJson);
        stage.set('id', stage.number);
        return stage;
      }));
    } else {
      this.set('yaml', 'error?');
    }
  }),

  actions: {
    chooseRequest(request) {
      this.set('selected', request);

      this.set('yaml', undefined);
      this.get('fetch').perform();
    }
  }
});
