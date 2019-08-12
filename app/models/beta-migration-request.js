import Model, { hasMany, attr } from '@ember-data/model';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

export default Model.extend({
  store: service(),

  ownerId: attr('number'),
  ownerName: attr('string'),
  ownerType: attr('string'),
  acceptedAt: attr('date'),
  organizations: hasMany('organization'),

  owner: computed('ownerName', 'ownerType', function () {
    const { ownerName, ownerType = '', store } = this;
    return ownerName && ownerType ? store.peekRecord(ownerType.toLowerCase(), ownerName) : null;
  })

});
