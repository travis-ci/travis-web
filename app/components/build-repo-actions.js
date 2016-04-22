import Ember from 'ember';
import RepoActionsItemComponentMixin from 'travis/mixins/repo-actions-item-component-mixin';

export default Ember.Component.extend(RepoActionsItemComponentMixin, {
  item: Ember.computed.alias('build'),
  type: 'build'
});
