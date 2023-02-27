const DeleteReplyCommentUseCase = require('../DeleteReplyCommentUseCase');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');

describe('DeleteReplyCommentUseCase', () => {
  it('should throw error when commentId, threadId, replyId, credentialId not string', async () => {
    // Arrange
    const commentId = false;
    const threadId = null;
    const replyId = [];
    const credentialId = 123;

    const deleteReplyCommentUseCase = new DeleteReplyCommentUseCase({});

    // Action & Assert
    await expect(deleteReplyCommentUseCase.execute(threadId, commentId, replyId, credentialId)).rejects.toThrowError('DELETE_REPLY_COMMENT_USE_CASE_NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should orchestrating the delete reply comment action correctly', async () => {
    // Arrange
    const commentId = 'comment-123';
    const threadId = 'thread-123';
    const credentialId = 'user-123';
    const replyId = 'reply-123';

    // creating dependency of use case
    const mockThreadRepository = new ThreadRepository();

    // mocking needed function
    mockThreadRepository.verifyAvailableThread = jest.fn().mockImplementation(() => Promise.resolve());
    mockThreadRepository.verifyAvailableComment = jest.fn().mockImplementation(() => Promise.resolve());
    mockThreadRepository.verifyReplyOwner = jest.fn().mockImplementation(() => Promise.resolve());
    mockThreadRepository.deleteReplyCommentById = jest.fn().mockImplementation(() => Promise.resolve({ status: 'success' }));

    // creating use case instance
    const getDeleteReplyCommentUseCase = new DeleteReplyCommentUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action
    await getDeleteReplyCommentUseCase.execute(threadId, commentId, replyId, credentialId);

    // Assert
    expect(mockThreadRepository.verifyAvailableThread).toBeCalledWith(threadId);
    expect(mockThreadRepository.verifyAvailableComment).toBeCalledWith(commentId);
    expect(mockThreadRepository.verifyReplyOwner).toBeCalledWith(replyId, credentialId);
    expect(mockThreadRepository.deleteReplyCommentById).toBeCalledWith(replyId);
  });
});
