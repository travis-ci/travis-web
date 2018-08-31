import Controller from '@ember/controller';
import { fetch, Headers } from 'fetch';
import { task } from 'ember-concurrency';
import { get } from '@ember/object';

export default Controller.extend({
  selected: null,

  fetch: task(function* () {
    // FIXME obvs
    let url = `http://localhost:4567/${this.get('selected.repo.slug')}/${this.get('selected.commit.sha')}`;
    let headers = {
      'Accept': 'application/json'
    };

    let response = yield fetch(url, {
      headers: new Headers(headers)
    });

    let json = yield response.json();

    let yaml = get(json, 'request.yaml_config.yaml');

    if (yaml) {
      this.set('yaml', yaml);
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
