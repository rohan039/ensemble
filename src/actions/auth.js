export const login = (uid, isAdmin) => ({
  type: 'LOGIN',
  uid,
  isAdmin
});

export const logout = () => ({
  type: 'LOGOUT'
});
