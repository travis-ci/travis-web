import Component from '@ember/component';
import { reads } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import CanTriggerBuild from 'travis/mixins/components/can-trigger-build';

export default Component.extend(CanTriggerBuild, {
  tagName: '',

  features: service(),

  showNewConfigView: reads('features.showNewConfigView'),

});
