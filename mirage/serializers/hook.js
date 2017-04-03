import V2Serializer from './v2';

export default V2Serializer.extend({
  keyForModel() { return 'hook'; },
  keyForCollection() { return 'hooks'; }
});
