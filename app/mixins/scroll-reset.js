import Mixin from '@ember/object/mixin';

export default Mixin.create({
  beforeModel: function () {
    window.scrollTo(0, 0);
    return this._super(...arguments);
  }
});
