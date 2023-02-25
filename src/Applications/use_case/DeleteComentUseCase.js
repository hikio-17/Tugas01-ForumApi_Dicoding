class DeleteCommentUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(commentId, threadId, credentialId) {
    await this._threadRepository.verifyAvailableThread(threadId);
    await this._threadRepository.verifyAvailableComment(commentId);
    await this._threadRepository.verifyCommentOwner(commentId, credentialId);
    await this._threadRepository.deleteCommentById(commentId);
  }
}

module.exports = DeleteCommentUseCase;
