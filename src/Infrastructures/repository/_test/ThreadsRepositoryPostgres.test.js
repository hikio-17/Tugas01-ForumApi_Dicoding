const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const InvariantError = require('../../../Commons/exceptions/InvariantError');
const NewAddedThread = require('../../../Domains/threads/entities/NewAddedThread');
const NewThread = require('../../../Domains/threads/entities/NewThread');
const RegisterUser = require('../../../Domains/users/entities/RegisterUser');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const UserRepositoryPostgres = require('../UserRepositoryPostgres');

describe('ThreadsRepositoryPostgres', () => {
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });
  describe('addThread function', () => {
    it('should persist register user and return registered user correctly', async () => {
      // Arrange
      const registerUser = new RegisterUser({
        username: 'myUser',
        password: 'secret',
        fullname: 'userTesting',
      });
      const fakeIdGenerator = () => '1234'; // stub!
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await userRepositoryPostgres.addUser(registerUser);

      // Assert
      const users = await UsersTableTestHelper.findUsersById('user-1234');
      expect(users).toHaveLength(1);
    });
    it('should persist add new thread and return value correctly', async () => {
      // Arrange
      const newThread = new NewThread({
        title: 'ini title',
        body: 'ini body',
      });
      const credentialId = 'user-1234';
      const fakeIdGenerator = () => '123';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await threadRepositoryPostgres.addThread(newThread, credentialId);

      // Assert
      const thread = await ThreadsTableTestHelper.findThreadById('thread-123');
      expect(thread).toHaveLength(1);
    });

    it('should return addedThread correctly', async () => {
      // Arrange
      const newThread = new NewThread({
        title: 'ini title',
        body: 'ini body',
      });
      const credentialId = 'user-1234';
      const fakeIdGenerator = () => '1234';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const newAddedThread = await threadRepositoryPostgres.addThread(newThread, credentialId);

      // Assert
      expect(newAddedThread).toEqual(new NewAddedThread({
        id: 'thread-1234',
        title: 'ini title',
        owner: 'user-1234',
      }));
    });
  });

  describe('verifyAvailbaleThread function', () => {
    it('should throw new InvariantError when thread not available', async () => {
      // Arrange
      await ThreadsTableTestHelper.addThread({ id: 'thread-1234' });
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action and Assert
      await expect(threadRepositoryPostgres.verifyAvailableThread('thread-1234')).rejects.toThrowError(InvariantError);
    });

    it('shoul not throw InvariantError when thread available', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action and Assert
      await expect(threadRepositoryPostgres.verifyAvailableThread('thread-1234')).resolves.not.toThrowError(InvariantError);
    });
  });
});
