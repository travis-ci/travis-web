import Component from '@ember/component';
import SelectableRepositoriesList from 'travis/mixins/components/selectable-repositories-list';

export default Component.extend(SelectableRepositoriesList, {

  isShowingRepositoryMigrationModal: false,

  init() {
    this._super(...arguments);

    const { selectedRepositories, repositories } = this;
    if (repositories.length === 1) {
      selectedRepositories.addObjects(repositories);
    }
  }

});
