const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const NewAddedComment = require('../../../Domains/threads/entities/NewAddedComment');
const NewAddedReplyComment = require('../../../Domains/threads/entities/NewAddedReplyComment');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const NewAddedThread = require('../../../Domains/threads/entities/NewAddedThread');
const NewThread = require('../../../Domains/threads/entities/NewThread');
const RegisterUser = require('../../../Domains/users/entities/RegisterUser');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const UserRepositoryPostgres = require('../UserRepositoryPostgres');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');

describe('ThreadsRepositoryPostgres', () => {
  afterAll(async () => {
    await ThreadsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });
  describe('ThreadRepository', () => {
    // add user
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

    // user reply comment
    it('should persist register user and return registered user correctly', async () => {
      // Arrange
      const registerUser = new RegisterUser({
        username: 'userReply',
        password: 'secret',
        fullname: 'userTesting',
      });
      const fakeIdGenerator = () => 'replyComment'; // stub!
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await userRepositoryPostgres.addUser(registerUser);

      // Assert
      const users = await UsersTableTestHelper.findUsersById('user-replyComment');
      expect(users).toHaveLength(1);
    });

    describe('addThread function', () => {
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
        const newAddedThread = await threadRepositoryPostgres.addThread(newThread, credentialId);
        const thread = await ThreadsTableTestHelper.findThreadById('thread-1234');

        // Assert
        expect(thread).toHaveLength(1);
        expect(newAddedThread).toEqual(new NewAddedThread({
          id: 'thread-1234',
          title: 'ini title',
          owner: 'user-1234',
        }));
      });
    });
  });

  describe('addComment function', () => {
    it('should persist add new comment and return value correctly', async () => {
      // Arrange
      const newThread = new NewThread({
        title: 'ini title',
        body: 'ini body',
      });

      const comment = {
        content: 'berisi sebuah comment',
      };
      const threadId = 'thread-1234';
      const credentialId = 'user-1234';
      const fakeIdGenerator = () => 1234;
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const newComment = await threadRepositoryPostgres.addComment(comment, threadId, credentialId);
      const commentById = await CommentsTableTestHelper.findCommentById('comment-1234');

      // Assert
      expect(commentById).toHaveLength(1);
      expect(newComment).toEqual(new NewAddedComment({
        id: 'comment-1234',
        content: 'berisi sebuah comment',
        owner: 'user-1234',
      }));
    });
  });

  describe('verifyAvailbaleThread function', () => {
    it('should throw NotFoundError when threadId not available', async () => {
      // Arrange
      const threadId = 'threadid-fake';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(threadRepositoryPostgres.verifyAvailableThread(threadId)).rejects.toThrow(NotFoundError);
    });

    it('should not throw NotFoundError whent threadId available', async () => {
      // Arrange
      const threadId = 'thread-1234';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(threadRepositoryPostgres.verifyAvailableThread(threadId)).resolves.not.toThrow(NotFoundError);
    });
  });

  describe('verifyAvailableComment function', () => {
    it('should throw NotFoundError whent commentId not available', async () => {
      // Arrange
      const commentId = 'commentId-fake';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(threadRepositoryPostgres.verifyAvailableComment(commentId)).rejects.toThrow(NotFoundError);
    });

    it('should not throw NotFoundError when commentId available', async () => {
      // Action
      const commentId = 'comment-1234';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(threadRepositoryPostgres.verifyAvailableComment(commentId)).resolves.not.toThrow(NotFoundError);
    });
  });

  describe('verifyCommentOwner function', () => {
    it('should throw NotFoundError when commentId not available', async () => {
      // Arrange
      const commentId = 'commentId-fake';
      const credentialId = 'user-1234'; // owner comment
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(threadRepositoryPostgres.verifyCommentOwner(commentId, credentialId)).rejects.toThrow(NotFoundError);
    });

    it('should throw AutorizationError when credentialId not have commentOwner', async () => {
      // Arrrange
      const commentId = 'comment-1234';
      const credentialId = 'userId-fake';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(threadRepositoryPostgres.verifyCommentOwner(commentId, credentialId)).rejects.toThrow(AuthorizationError);
    });

    it('should not NotFoundError and AuthorizationError when valid commendId and CredentialId', async () => {
      // Arrange
      const commentId = 'comment-1234';
      const credentialId = 'user-1234'; // userId owner comment
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(threadRepositoryPostgres.verifyCommentOwner(commentId, credentialId)).resolves.not.toThrow(NotFoundError, AuthorizationError);
    });
  });

  describe('addNewReplyComment function', () => {
    it('should persist add new reply comment and return value correctly', async () => {
      // Arrange
      const commentId = 'comment-1234'; // from addComment funtion
      const threadId = 'thread-1234'; // from addThread function
      const credentialId = 'user-replyComment'; // from register user reply
      const newReply = {
        content: 'balasan sebuah komentar',
      };
      const fakeIdGenerator = () => 1234;
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const newReplyComment = await threadRepositoryPostgres.addNewReplyComment(newReply, threadId, commentId, credentialId);
      const reply = await RepliesTableTestHelper.getReplyById('reply-1234');

      // Assert
      expect(reply).toHaveLength(1);
      expect(newReplyComment).toEqual(new NewAddedReplyComment({
        id: 'reply-1234',
        content: 'balasan sebuah komentar',
        owner: 'user-replyComment',
      }));
    });
  });

  describe('verifyReplyOwner function', () => {
    it('should throw NotFoundError when replyId not available', async () => {
      // Arrange
      const replyId = 'replyId-fake';
      const credentialId = 'user-replyComment'; // from register user reply comment
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(threadRepositoryPostgres.verifyReplyOwner(replyId, credentialId)).rejects.toThrow(NotFoundError);
    });

    it('should throw AuthorizationError when credentialId not valid', async () => {
      // Arrange
      const replyId = 'reply-1234'; // from addNewReplyComment function
      const credentialId = 'userId-fake';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(threadRepositoryPostgres.verifyReplyOwner(replyId, credentialId)).rejects.toThrow(AuthorizationError);
    });

    it('should not throw NotFoundError and AuthorizationError when valida replyId and credentialId', async () => {
      // Arrange
      const replyId = 'reply-1234'; // from addNewReply function
      const credentialId = 'user-replyComment'; // from register user replyComment
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(threadRepositoryPostgres.verifyReplyOwner(replyId, credentialId)).resolves.not.toThrow(NotFoundError, AuthorizationError);
    });
  });

  describe('getThreadById function', () => {
    it('should persist getThreadById and return value correctly', async () => {
      // Arrange
      const threadId = 'thread-1234'; // from addThread function
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action
      const thread = await threadRepositoryPostgres.getThreadById(threadId);

      // Assert
      expect(thread).toBeDefined();
    });
  });

  describe('deleteCommentById function', () => {
    it('should persist deleteCommentById', async () => {
      // Arrange
      const commentId = 'comment-1234'; // from addComment function
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action
      await threadRepositoryPostgres.deleteCommentById(commentId);
      const comment = await CommentsTableTestHelper.findCommentById(commentId);

      // Assert
      expect(comment[0].is_delete).toEqual(true);
    });
  });

  describe('deleteReplyCommentById', () => {
    it('should persist deleteReplyCommentById', async () => {
      // Arrange
      const replyId = 'reply-1234';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action
      await threadRepositoryPostgres.deleteReplyCommentById(replyId);
      const reply = await RepliesTableTestHelper.getReplyById(replyId);

      // Assert
      expect(reply[0].is_delete).toEqual(true);
    });
  });
});
