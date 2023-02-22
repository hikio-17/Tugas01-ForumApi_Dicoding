const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const NewThread = require('../../../Domains/threads/entities/NewThread');
const AddThreadUseCase = require('../AddThreadsUserCase');
const NewAddedThread = require('../../../Domains/threads/entities/NewAddedThread');

describe('AddThreadUseCase', () => {
  /**
   * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
   */
  it('should orchestrating add thread action correctly', async () => {
    // Arrange
    const useCasePayload = {
      title: 'my title',
      body: 'content body',
    };

    const credentialId = 'user-123';

    const mockNewThread = {
      id: 'thread-123',
      title: useCasePayload.title,
      owner: 'user-123',
    };

    // creating dependency
    const mockThreadRepository = new ThreadRepository();

    // mocking needed function
    mockThreadRepository.addThread = jest.fn().mockImplementation(() => Promise.resolve(mockNewThread));

    // creating use case instance
    const getThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action
    const newAddedThread = await getThreadUseCase.execute(useCasePayload, credentialId);

    // Assert
    expect(newAddedThread).toEqual(new NewAddedThread({
      id: 'thread-123',
      title: useCasePayload.title,
      owner: 'user-123',
    }));

    expect(mockThreadRepository.addThread).toBeCalledWith(new NewThread({
      title: useCasePayload.title,
      body: useCasePayload.body,
    }), credentialId);
  });
});
