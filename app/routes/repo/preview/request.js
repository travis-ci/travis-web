import TravisRoute from 'travis/routes/basic';
import { fetch, Headers } from 'fetch';
import config from 'travis/config/environment';
import EmberObject, { get } from '@ember/object';

export default TravisRoute.extend({
  queryParams: {
    yaml: {
      refreshModel: true,
      replace: true
    },
    eventType: {
      refreshModel: true,
      replace: true
    },
    commitMessage: {
      refreshModel: true,
      replace: true
    }
  },

  model(params) {
    return this.store.findRecord('request', params.request_id).then(request => {
      let url = new URL(`${config.previewEndpoint}/` +
      `requests/${request.id}`);
      let headers = {
        'Accept': 'application/json'
      };

      if (params.eventType) {
        url.searchParams.append('event_type', params.eventType);
      }

      if (params.commitMessage) {
        url.searchParams.append('commit_message', params.commitMessage);
      }

      if (params.yaml) {
        url.searchParams.append('yml', params.yaml);
      }

      return fetch(url, {
        headers: new Headers(headers)
      });
    }).then(response => response.json()).then(json => {
      let yaml = params.yaml || get(json, 'request.yaml_config.yaml');

      if (yaml) {
        let jobs;

        if (json.stages && json.stages.length) {
          jobs = json.stages.reduce((jobs, stage) => jobs.concat(stage.jobs.map(jobJson => {
            let job = EmberObject.create(jobJson);
            job.set('stage', {id: stage.number});
            job.set('config', {content: JSON.parse(jobJson.config)});
            return job;
          })), []);
        } else {
          jobs = json.jobs.reduce((jobs, jobJson) => {
            let job = EmberObject.create(jobJson);
            job.set('config', {content: JSON.parse(jobJson.config)});
            jobs.push(job);
            return jobs;
          }, []);
        }

        let build = EmberObject.create({
          jobs,
          request: json.request
        });
        this.set('build', build);
        this.set('eventType', json.event_type);
        this.set('commitMessage', get(json, 'commit.message'));

        let stages = json.stages.map(stageJson => {
          let stage = this.get('store').createRecord('stage', stageJson);
          stage.set('id', stage.number);
          return stage;
        });

        return {
          yaml,
          build,
          eventType: json.event_type,
          commitMessage: get(json, 'commit.message'),
          stages
        };
      } else {
        return {
          yaml: 'error?'
        };
      }
    });
  },

  setupController(controller, model) {
    controller.setProperties(model);
  }
});
