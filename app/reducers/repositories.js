import { uniq, remove } from 'travis/utils/array-helpers';
import Immutable from 'npm:immutable';

const initialState = new Immutable.Map({
  all: new Immutable.List()
});

export default ((state, action) => {
  if (action.type === 'DESERIALIZE_REPOSITORIES') {
    let repositoriesData = action.response.repositories;
    repositoriesData.forEach(function(repositoryData) {
      let index = state.get('all').findKey( repo => repo.get('id') === repositoryData.id + '' );
      if(index) {
        state = state.mergeIn(['all', index], repositoryData);
      } else {
        state = state.set('all', state.get('all').push(Immutable.fromJS(repositoryData)));
      }
    });
    return state;
  }

  if (action.type === 'REMOVE_REPOSITORY') {
    return Object.assign({}, state, {
      all: remove(state.all, action.id)
    });
  }
  return state || initialState;
});
