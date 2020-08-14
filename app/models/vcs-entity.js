import Model, { attr } from '@ember-data/model';
import { vcsConfig } from 'travis/utils/vcs';
import { computed } from '@ember/object';
import { reads } from '@ember/object/computed';

export default Model.extend({
  vcsId: attr('string'),
  vcsType: attr('string'),

  vcsProvider: computed('vcsType', function () {
    return vcsConfig(this.vcsType);
  }),

  provider: reads('vcsProvider.urlPrefix')
});
