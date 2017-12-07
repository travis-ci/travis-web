import Mixin from '@ember/object/mixin';

export default Mixin.create({
  beforeModel: function () {
    const modelFor = this.modelFor('repo');

    if (modelFor) {
      window.scrollTo(0, 0);
    }

    return this._super(...arguments);
  }
});
