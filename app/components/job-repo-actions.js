import Ember from 'ember';
import RepoActionsItemComponentMixin from 'travis/utils/repo-actions-item-component-mixin';

export default Ember.Component.extend(RepoActionsItemComponentMixin, {
  item: Ember.computed.alias('job'),
  type: 'job'
});
