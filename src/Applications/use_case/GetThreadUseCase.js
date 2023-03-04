const ThreadToModel = require('../../Domains/threads/entities/ThreadToModel');
const CommentToModel = require('../../Domains/comments/entities/CommentToModel');
const ReplyToModel = require('../../Domains/replies/entities/ReplyToModel');

class GetThreadUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(threadId) {
    await this._threadRepository.verifyAvailableThread(threadId);
    const resultThread = await this._threadRepository.getThreadById(threadId);
    const thread = new ThreadToModel(resultThread);
    const resultComments = await this._commentRepository.getCommentByThreadId(threadId);
    const resultReplies = await this._replyRepository.getReplyCommentByThreadId(threadId);
    const comments = this._mapComments(resultComments, resultReplies);
    return {
      ...thread,
      comments,
    };
  }

  _mapComments(resultComments, resultReplies) {
    const comments = [];

    resultComments.map((comment) => {
      const replies = [];
      resultReplies.map((reply) => {
        if (comment.id === reply.comment_id) {
          replies.push(new ReplyToModel(reply));
        }
      });
      comments.push(new CommentToModel(comment, replies));
    });
    return comments;
  }
}

module.exports = GetThreadUseCase;
