const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const NewAddedThread = require('../../../Domains/threads/entities/NewAddedThread');
const NewThread = require('../../../Domains/threads/entities/NewThread');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');

describe('ThreadsRepositoryPostgres', () => {
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
  });
  afterAll(async () => {
    await pool.end();
  });

  describe('addThread function', () => {
    it('should persist add new thread and return value correctly', async () => {
      // Arrange
      const newThread = new NewThread({
        title: 'my title',
        body: 'body content',
      });
      const credentialId = 'user-123';
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
        title: 'my title',
        body: 'body content',
      });
      const credentialId = 'user-123';
      const fakeIdGenerator = () => '123';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const newAddedThread = await threadRepositoryPostgres.addThread(newThread, credentialId);

      // Assert
      expect(newAddedThread).toEqual(new NewAddedThread({
        id: 'thread-123',
        title: 'my title',
        owner: 'user-123',
      }));
    });
  });
});
