const CommentRepository = require('../../../Domains/comments/CommentRepository');
const CommentToModel = require('../../../Domains/comments/entities/CommentToModel');
const ReplyToModel = require('../../../Domains/replies/entities/ReplyToModel');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const GetThreadUseCase = require('../GetThreadUseCase');

describe('GetThreadUseCase', () => {
  it('should orchestrating Get Thread action correctly', async () => {
    /** Arrange */
    const threadId = 'thread-1234';

    const mockThread = {
      id: 'thread-1234',
      title: 'sebuah title',
      body: 'sebuah body',
      created_at: new Date().toISOString(),
      username: 'my user',
    };

    const mockComments = [
      {
        id: 'comment-1234',
        username: 'dicoding',
        created_at: '2023-03-04T14:30:58.819Z',
        content: 'sebuah comment',
        is_delete: false,
      },
    ];

    const mockReplies = [
      {
        id: 'reply-22HnFn-O3vYNXF72MIsj8',
        username: 'johndoe',
        created_at: '2023-03-04T14:31:13.935Z',
        content: 'sebuah balasan',
        comment_id: 'comment-1234',
        is_delete: true,
      },
      {
        id: 'reply-HzPGY838l2MlS4i7MaFdv',
        username: 'dicoding',
        created_at: '2023-03-04T14:31:18.569Z',
        content: 'sebuah balasan',
        comment_id: 'comment-1234',
        is_delete: false,
      },
    ];

    // creating dependency
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    // mocking needed function
    mockThreadRepository.verifyAvailableThread = jest.fn().mockImplementation(() => Promise.resolve());
    mockThreadRepository.getThreadById = jest.fn().mockImplementation(() => Promise.resolve(mockThread));
    mockCommentRepository.getCommentByThreadId = jest.fn().mockImplementation(() => Promise.resolve(mockComments));
    mockReplyRepository.getReplyCommentByThreadId = jest.fn().mockImplementation(() => Promise.resolve(mockReplies));

    // creating use case instance
    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    // Action
    const getThreadById = await getThreadUseCase.execute(threadId);

    const comment = {
      id: 'comment-1234',
      username: 'dicoding',
      created_at: '2023-03-04T14:30:58.819Z',
      content: 'sebuah comment',
      is_delete: false,
    };

    const reply = {
      id: 'reply-HzPGY838l2MlS4i7MaFdv',
      username: 'dicoding',
      created_at: '2023-03-04T14:31:18.569Z',
      content: 'sebuah balasan',
      comment_id: 'comment-1234',
      is_delete: false,
    };

    const replies = [];

    if (comment.id === reply.comment_id) {
      replies.push(reply);
      expect(replies[0]).toEqual(reply);
    }

    // Assert
    expect(mockThreadRepository.verifyAvailableThread).toBeCalledWith(threadId);
    expect(mockThreadRepository.getThreadById).toBeCalledWith(threadId);
    expect(mockCommentRepository.getCommentByThreadId).toBeCalledWith(threadId);
    expect(mockReplyRepository.getReplyCommentByThreadId).toBeCalledWith(threadId);
    expect(getThreadById).toBeDefined();
  });
});
