import Ember from 'ember';
import Model from 'travis/models/model';
import attr from 'ember-data/attr';

var indexOf = [].indexOf;

var Broadcast = Model.extend({
  message: attr(),

  toObject() {
    return {
      type: 'broadcast',
      id: this.get('id'),
      message: this.get('message')
    };
  },

  isSeen: function() {
    var ref;
    return ref = this.get('id'), indexOf.call(Ember.get(Broadcast, 'seen'), ref) >= 0;
  }.property(),

  setSeen() {
    Ember.get(Broadcast, 'seen').pushObject(this.get('id'));
    Travis.storage.setItem('travis.seen_broadcasts', JSON.stringify(Ember.get(Broadcast, 'seen')));
    return this.notifyPropertyChange('isSeen');
  }
});

Broadcast.reopenClass({
  seen: function() {
    var seenBroadcasts;
    seenBroadcasts = Travis.lookup('service:storage').getItem('travis.seen_broadcasts');
    if (seenBroadcasts != null) {
      seenBroadcasts = JSON.parse(seenBroadcasts);
    }
    return Ember.A(seenBroadcasts || []);
  }.property()
});

export default Broadcast;
