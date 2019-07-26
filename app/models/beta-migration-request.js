import Model, { hasMany, attr } from '@ember-data/model';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

export default Model.extend({
  store: service(),

  ownerId: attr('number'),
  ownerType: attr('string'),
  acceptedAt: attr('date'),
  organizations: hasMany('organization'),

  owner: computed('ownerId', 'ownerType', function () {
    const { ownerId, ownerType = '', store } = this;
    return ownerId && ownerType ? store.peekRecord(ownerType.toLowerCase(), ownerId) : null;
  })

});
