import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { reads, or } from '@ember/object/computed';

export default Controller.extend({
  repositories: service(),

  latestCurrentBuild: reads('repositories.accessible.firstObject.currentBuild'),

  build: or('model', 'latestCurrentBuild')
});
