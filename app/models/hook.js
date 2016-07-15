import Ember from 'ember';
import Model from 'ember-data/model';
import config from 'travis/config/environment';
import attr from 'ember-data/attr';

export default Model.extend({
  name: attr(),
  ownerName: attr(),
  description: attr(),
  active: attr('boolean'),
  admin: attr('boolean'),
  'private': attr('boolean'),

  account: Ember.computed('slug', function () {
    return this.get('slug').split('/')[0];
  }),

  slug: Ember.computed('ownerName', 'name', function () {
    return (this.get('ownerName')) + '/' + (this.get('name'));
  }),

  urlGithub: Ember.computed(function () {
    return config.sourceEndpoint + '/' + (this.get('slug'));
  }),

  urlGithubAdmin: Ember.computed(function () {
    return config.sourceEndpoint + '/' + (this.get('slug')) + '/settings/hooks#travis_minibucket';
  }),

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
  }
});
