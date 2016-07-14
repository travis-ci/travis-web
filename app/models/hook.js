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

  account: function () {
    return this.get('slug').split('/')[0];
  }.property('slug'),

  slug: function () {
    return (this.get('ownerName')) + '/' + (this.get('name'));
  }.property('ownerName', 'name'),

  urlGithub: function () {
    return config.sourceEndpoint + '/' + (this.get('slug'));
  }.property(),

  urlGithubAdmin: function () {
    return config.sourceEndpoint + '/' + (this.get('slug')) + '/settings/hooks#travis_minibucket';
  }.property(),

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
