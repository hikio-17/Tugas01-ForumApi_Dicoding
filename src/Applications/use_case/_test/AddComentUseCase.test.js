const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const NewComment = require('../../../Domains/threads/entities/NewComment');
const NewAddedComment = require('../../../Domains/threads/entities/NewAddedComment');
const AddCommentUseCase = require('../AddCommentUseCase');

describe('AddComentUseCase', () => {
  it('should throw error if threadId, credentialId not string', async () => {
    // Arrange
    const newComment = { content: 'sebuah comment' };
    const threadReppository = new ThreadRepository();
    const addCommentUseCase = new AddCommentUseCase({ threadRepository: threadReppository });
    const credentialId = 1234;
    const threadId = 'thread-123';

    // Action & Assert
    await expect(addCommentUseCase.execute(newComment, threadId, credentialId)).rejects.toThrowError('ADD_COMMENT_USE_CASE_NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should orchestrating the add comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      content: 'sebuah comment',
    };

    const mockAddedComment = new NewAddedComment({
      id: 'comment-123',
      content: 'sebuah comment',
      owner: 'user-1234',
    });

    const threadId = 'thread-123';
    const credentialId = 'user-1234';

    // Creating dependency of use case
    const mockThreadRepository = new ThreadRepository();

    // mocking needed function
    mockThreadRepository.verifyAvailableThread = jest.fn().mockImplementation(() => Promise.resolve());
    mockThreadRepository.addComment = jest.fn().mockImplementation(() => Promise.resolve(mockAddedComment));

    // creating use case instance
    const getCommentUseCase = new AddCommentUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action
    const newAddedComent = await getCommentUseCase.execute(useCasePayload, threadId, credentialId);

    // Assert
    expect(newAddedComent).toStrictEqual(new NewAddedComment({
      id: 'comment-123',
      content: 'sebuah comment',
      owner: 'user-1234',
    }));

    expect(mockThreadRepository.verifyAvailableThread).toBeCalledWith(threadId);
    expect(mockThreadRepository.addComment).toBeCalledWith(new NewComment({
      content: 'sebuah comment',
    }), threadId, credentialId);
  });
});
