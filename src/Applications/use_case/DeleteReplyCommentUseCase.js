class DeleteReplyCommentUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(threadId, commentId, replyId, credentialId) {
    await this._threadRepository.verifyAvailableThread(threadId);
    await this._threadRepository.verifyAvailableComment(commentId);
    await this._threadRepository.verifyReplyOwner(replyId, credentialId);
    await this._threadRepository.deleteReplyCommentById(replyId);
  }
}

module.exports = DeleteReplyCommentUseCase;
