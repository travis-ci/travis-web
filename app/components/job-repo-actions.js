import Ember from 'ember';
import RepoActionsItemComponentMixin from 'travis/mixins/repo-actions-item-component-mixin';

const { alias } = Ember.computed;

export default Ember.Component.extend(RepoActionsItemComponentMixin, {
  item: alias('job'),
  type: 'job',
  classNames: ['repo-main-tools'],
  classNameBindings: ['small']
});
