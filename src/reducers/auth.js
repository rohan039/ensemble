export default (state = {}, action) => {
  switch (action.type) {
    case 'LOGIN':
      return {
        uid: action.uid,
        isAdmin: action.isAdmin
      };
    case 'LOGOUT':
      return {};
    default:
      return state;
  }
};
