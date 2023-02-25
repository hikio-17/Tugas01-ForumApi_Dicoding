const NewReplyComment = require('../../Domains/threads/entities/NewReplyComment');

class AddNewReplyCommentUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(newReply, threadId, commentId, credentialId) {
    await this._threadRepository.verifyAvailableThread(threadId);
    await this._threadRepository.verifyAvailableComment(commentId);
    const newReplyComment = new NewReplyComment(newReply);
    return this._threadRepository.addNewReplyComment(newReplyComment, threadId, commentId, credentialId);
  }
}
module.exports = AddNewReplyCommentUseCase;
