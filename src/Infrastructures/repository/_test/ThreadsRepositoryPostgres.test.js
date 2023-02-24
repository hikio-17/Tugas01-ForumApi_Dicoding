const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const NewAddedComment = require('../../../Domains/threads/entities/NewAddedComment');
const NewComment = require('../../../Domains/threads/entities/NewComment');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
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
      const fakeIdGenerator = () => '1234';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await threadRepositoryPostgres.addThread(newThread, credentialId);

      // Assert
      const thread = await ThreadsTableTestHelper.findThreadById('thread-1234');
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
      const registerUser = new RegisterUser({
        username: 'myUser1',
        password: 'secret',
        fullname: 'userTesting',
      });
      const threadId = 'thread-1234';
      const credentialId = 'user-12345';
      const fakeIdGenerator = () => '12345'; // stub!
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, fakeIdGenerator);

      await userRepositoryPostgres.addUser(registerUser);
      await ThreadsTableTestHelper.addThread({ threadId, credentialId });
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action and Assert
      await expect(threadRepositoryPostgres.verifyAvailableThread('fake_id')).rejects.toThrowError(NotFoundError);
    });

    it('should not throw  when thread available', async () => {
      // Arrange
      const threadId = 'thread-1234';
      const credentialId = 'user-12345';
      await ThreadsTableTestHelper.addThread(threadId, credentialId);
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action and Assert
      await expect(threadRepositoryPostgres.verifyAvailableThread('thread-1234')).resolves.not.toThrowError(NotFoundError);
    });
  });

  describe('addComment function', () => {
    it('should persist addcomment and return new added comment correctly', async () => {
      /** Arrange */
      // create user
      const user = {
        id: 'user-123456',
        username: 'user11',
        password: 'secret',
        fullname: 'User Secret',
      };
      // create newComment
      const newComment = new NewComment({
        content: 'berisi sebuah comment',
      });
      const credentialId = 'user-123456';
      const threadId = 'thread-1234';
      const fakeIdGenerator = () => 123; // stub
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      await UsersTableTestHelper.addUser(user);
      await ThreadsTableTestHelper.addThread(threadId, credentialId);

      // Action
      await threadRepositoryPostgres.addComment(newComment, threadId, credentialId);

      // Assert
      const comments = await CommentsTableTestHelper.findCommentById('comment-123');
      expect(comments).toHaveLength(1);
    });

    it('should return newAddedComment correctly', async () => {
      // Arrange
      const user = {
        id: 'user-2222',
        username: 'user22',
        password: 'secret',
        fullname: 'User Secret',
      };
      const newComment = {
        content: 'berisi sebuah comment',
      };
      const fakeIdGenerator = () => '123'; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      await ThreadsTableTestHelper.addThread({ id: 'thread-1234', credentialId: 'user-2222' }); // threadId = 'thread-1234' stub!
      await UsersTableTestHelper.addUser(user);

      // Action
      const newAddedComment = await threadRepositoryPostgres.addComment(newComment, 'thread-1234', 'user-2222');

      // Assert
      expect(newAddedComment).toStrictEqual(new NewAddedComment({
        id: 'comment-123',
        content: 'berisi sebuah comment',
        owner: 'user-2222',
      }));
    });
  });
});
