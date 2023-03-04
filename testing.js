function addUser({ username = 'fajri', id = 'user-1234' }) {
  console.log(username, id);
}

addUser({ username: 'tio', id: 'fajri' });
