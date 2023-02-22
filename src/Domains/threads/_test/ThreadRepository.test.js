const ThreadRepository = require('../ThreadRepository');

describe('ThreadsRepository interface', () => {
  it('should throw error when invoke abstract behavior', async () => {
    // Arrange
    const threadsRepository = new ThreadRepository();

    // Action and Assert
    await expect(() => threadsRepository.addThread({})).rejects.toThrowError('THREADS_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});
