const ThreadRepository = require('../ThreadRepository');

describe('ThreadsRepository interface', () => {
  it('should throw error when invoke abstract behavior', async () => {
    // Arrange
    const threadsRepository = new ThreadRepository();

    // Action and Assert
    await expect(() => threadsRepository.addThread({})).rejects.toThrowError('THREADS_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });

  it('should throw error when invoke abstract bahavior', async () => {
    // Arrange
    const threadsRepository = new ThreadRepository();

    // Action and Assert
    expect(() => threadsRepository.getThreadById('')).rejects.toThrowError('THREADS_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });

  it('should throw error when invoke abstract bahavior', async () => {
    // Arrange
    const threadsRepository = new ThreadRepository();

    // Action and Assert
    expect(() => threadsRepository.verifyAvailableThread('')).rejects.toThrowError('THREADS_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });

  it('should throw error when invoke abstract behavior', async () => {
    // Arrange
    const threadRepository = new ThreadRepository();

    // Action and Assert
    expect(() => threadRepository.verifyReplyOwner('', '')).rejects.toThrowError('THREADS_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });

  it('should throw error when invoke abstract behavior', async () => {
    // Arrange
    const threadRepository = new ThreadRepository();

    // Action and Assert
    expect(() => threadRepository.addNewReplyComment('')).rejects.toThrowError('THREADS_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });

  it('should throw error when invoke abstract behavior', async () => {
    // Arrange
    const threadRepository = new ThreadRepository();

    // Action and Assert
    expect(() => threadRepository.deleteReplyCommentById('')).rejects.toThrowError('THREADS_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});
