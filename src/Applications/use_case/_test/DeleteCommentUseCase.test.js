const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const DeleteCommentUseCase = require('../DeleteComentUseCase');

describe('DeleteCommentUseCase', () => {
  it('should throw error if commentId, threadId, credentialId not string', async () => {
    // Arrange
    const commentId = false;
    const threadId = null;
    const credentialId = 1234;

    const threadRepository = new ThreadRepository();
    const deleteCommentUseCase = new DeleteCommentUseCase({ threadRepository });

    // Action & Assert
    await expect(deleteCommentUseCase.execute(commentId, threadId, credentialId)).rejects.toThrowError('DELETE_COMMENT_USE_CASE_NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should orchestrating the delete comment action correctly', async () => {
    // Arrange
    const commentId = 'comment-123';
    const threadId = 'thread-123';
    const credentialId = 'user-123';

    // creating dependency of use case
    const mockThreadRepository = new ThreadRepository();

    // mocking needed function
    mockThreadRepository.verifyAvailableThread = jest.fn().mockImplementation(() => Promise.resolve());
    mockThreadRepository.verifyAvailableComment = jest.fn().mockImplementation(() => Promise.resolve());
    mockThreadRepository.verifyCommentOwner = jest.fn().mockImplementation(() => Promise.resolve());
    mockThreadRepository.deleteCommentById = jest.fn().mockImplementation(() => Promise.resolve({ status: 'success' }));

    // creating use case instance
    const getDeleteCommentUseCase = new DeleteCommentUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action
    await getDeleteCommentUseCase.execute(commentId, threadId, credentialId);

    // Assert
    expect(mockThreadRepository.verifyAvailableThread).toBeCalledWith(threadId);
    expect(mockThreadRepository.verifyAvailableComment).toBeCalledWith(commentId);
    expect(mockThreadRepository.verifyCommentOwner).toBeCalledWith(commentId, credentialId);
    expect(mockThreadRepository.deleteCommentById).toBeCalledWith(commentId);
  });
});
