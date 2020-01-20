import Model, { attr } from '@ember-data/model';
import { vcsConfig } from 'travis/utils/vcs';
import { computed } from '@ember/object';

export default Model.extend({
  vcsId: attr('number'),
  vcsType: attr('string'),

  vcsProvider: computed('vcsType', function () {
    return vcsConfig(this.vcsType);
  })
});
