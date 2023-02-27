const NewReplyComment = require('../../Domains/threads/entities/NewReplyComment');

class AddNewReplyCommentUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(newReply, threadId, commentId, credentialId) {
    this._verifyParams(threadId, commentId, credentialId);
    await this._threadRepository.verifyAvailableThread(threadId);
    await this._threadRepository.verifyAvailableComment(commentId);
    const newReplyComment = new NewReplyComment(newReply);
    return this._threadRepository.addNewReplyComment(newReplyComment, threadId, commentId, credentialId);
  }

  _verifyParams(threadId, commentId, credentialId) {
    if (typeof threadId !== 'string' || typeof commentId !== 'string' || typeof credentialId !== 'string') {
      throw new Error('NEW_REPLY_COMMENT_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}
module.exports = AddNewReplyCommentUseCase;
