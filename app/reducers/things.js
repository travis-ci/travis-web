import { uniq, remove } from 'travis/utils/array-helpers';

const initialState = {
    all: [{ foo: 1, id: 1 }],
    index: 2
};

export default ((state, action) => {
    if (action.type === 'ADD_THING') {
        return Object.assign({}, state, {
            all: uniq(state.all, [action.thing])
        });
    }
    if (action.type === 'INCR') {
      console.log(state);
        return Object.assign({}, state, {
            index: state.index + 1
        });
    }
    return state || initialState;
});
