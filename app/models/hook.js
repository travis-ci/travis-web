import Ember from 'ember';
import Model from 'ember-data/model';
import config from 'travis/config/environment';
import { computed } from 'ember-decorators/object';
import attr from 'ember-data/attr';

export default Model.extend({
  name: attr(),
  ownerName: attr(),
  description: attr(),
  active: attr('boolean'),
  admin: attr('boolean'),
  'private': attr('boolean'),

  @computed('slug')
  account(slug) {
    return slug.split('/')[0];
  },

  @computed('ownerName', 'name')
  slug(ownerName, name) {
    return `${ownerName}/${name}`;
  },

  @computed('slug')
  urlGithub(slug) {
    return `${config.sourceEndpoint}/${slug}`;
  },

  @computed('slug')
  urlGithubAdmin(slug) {
    return `${config.sourceEndpoint}/${slug}/settings/hooks#travis_minibucket`;
  },

  toggle() {
    if (this.get('isSaving')) {
      return;
    }
    this.toggleProperty('active');
    return this.save().then((record) => {
      this.updateRepositoryStatus();
      return record;
    });
  },

  updateRepositoryStatus() {
    Ember.run(this, () => {
      if (this.get('active')) {
        return this.get('store').push({
          data: {
            id: this.get('id'),
            type: 'repo',
            attributes: {
              active: true,
              slug: `${this.get('ownerName')}/${this.get('name')}`
            }
          }
        });
      } else {
        let record = this.get('store').peekRecord('repo', this.get('id'));
        if (record) {
          return this.get('store').unloadRecord(record);
        }
      }
    });
  },
});
