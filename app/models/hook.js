import Ember from 'ember';
import Model from 'travis/models/model';
import config from 'travis/config/environment';
import attr from 'ember-data/attr';
import { hasMany, belongsTo } from 'ember-data/relationships';

export default Model.extend({
  name: attr(),
  ownerName: attr(),
  description: attr(),
  active: attr('boolean'),
  admin: attr('boolean'),
  "private": attr('boolean'),

  account: function() {
    return this.get('slug').split('/')[0];
  }.property('slug'),

  slug: function() {
    return (this.get('ownerName')) + "/" + (this.get('name'));
  }.property('ownerName', 'name'),

  urlGithub: function() {
    return config.sourceEndpoint + "/" + (this.get('slug'));
  }.property(),

  urlGithubAdmin: function() {
    return config.sourceEndpoint + "/" + (this.get('slug')) + "/settings/hooks#travis_minibucket";
  }.property(),

  toggle() {
    if (this.get('isSaving')) {
      return;
    }
    this.set('active', !this.get('active'));
    return this.save();
  }
});
