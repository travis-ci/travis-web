const initialState = {
  filter: null,
  org: null
};

export default ((state, action) => {
  if (action.type === 'CHANGE_FILTER') {
    return Object.assign({}, state, {
      filter: action.filter
    });
  }
  if (action.type === 'CHANGE_ORG') {
    return Object.assign({}, state, {
      org: action.org
    });
  }
  return state || initialState;
});
