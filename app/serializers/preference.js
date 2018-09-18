import V3Serializer from './v3';

export default V3Serializer.extend({
  primaryKey: 'name',

  serialize() {
    const { value } = this._super(...arguments);
    return { 'preference.value': value };
  }
});
