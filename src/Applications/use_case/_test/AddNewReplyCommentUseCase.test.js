const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const NewAddedReplyComment = require('../../../Domains/threads/entities/NewAddedReplyComment');
const AddNewReplyCommentUseCase = require('../AddNewReplyCommentUseCase');
const NewReplyComment = require('../../../Domains/threads/entities/NewReplyComment');

describe('AddNewReplyCommentUseCase', () => {
  it('should throw error if threadId, credentialId not string', async () => {
    // Arrange
    const newReplyComment = { content: 'sebuah reply comment' };
    const threadRepository = new ThreadRepository();
    const addNewReplyCommentUseCase = new AddNewReplyCommentUseCase({ threadRepository });
    const commentId = true;
    const credentialId = 1234;
    const threadId = 'thread-123';

    // Action & Assert
    await expect(addNewReplyCommentUseCase.execute(newReplyComment, threadId, commentId, credentialId)).rejects.toThrowError('NEW_REPLY_COMMENT_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should orchestrating the add reply comment action correctly', async () => {
    // Arrange
    const payload = {
      content: 'reply sebuah comment',
    };

    const mockAddNewReplyComment = new NewAddedReplyComment({
      id: 'reply-123',
      content: 'reply sebuah comment',
      owner: 'user-123',
    });

    const threadId = 'thread-123';
    const commentId = 'comment-123';
    const credentialId = 'userReply-123';

    // Creating dependency of use case
    const mockThreadRepository = new ThreadRepository();

    // mocking needed function
    mockThreadRepository.verifyAvailableThread = jest.fn().mockImplementation(() => Promise.resolve());
    mockThreadRepository.verifyAvailableComment = jest.fn().mockImplementation(() => Promise.resolve());
    mockThreadRepository.addNewReplyComment = jest.fn().mockImplementation(() => Promise.resolve(mockAddNewReplyComment));

    // creating use case intance
    const getAddNewReplyCommentUseCase = new AddNewReplyCommentUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action
    const newAddedReplyComment = await getAddNewReplyCommentUseCase.execute(payload, threadId, commentId, credentialId);

    // Assert
    expect(mockThreadRepository.verifyAvailableThread).toBeCalledWith(threadId);
    expect(mockThreadRepository.verifyAvailableComment).toBeCalledWith(commentId);
    expect(mockThreadRepository.addNewReplyComment).toBeCalledWith(new NewReplyComment({
      content: 'reply sebuah comment',
    }), threadId, commentId, credentialId);
  });
});
