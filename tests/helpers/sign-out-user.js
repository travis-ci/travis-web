export default function signOutUser() {
  const clearStorage = (storage) => {
    storage.removeItem('travis.token');
    storage.removeItem('travis.user');
  };

  clearStorage(localStorage);
  clearStorage(sessionStorage);
}
