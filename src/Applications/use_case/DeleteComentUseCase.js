class DeleteCommentUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(commentId, threadId, credentialId) {
    this._verifyParams(commentId, threadId, credentialId);
    await this._threadRepository.verifyAvailableThread(threadId);
    await this._threadRepository.verifyAvailableComment(commentId);
    await this._threadRepository.verifyCommentOwner(commentId, credentialId);
    await this._threadRepository.deleteCommentById(commentId);
  }

  _verifyParams(commentId, threadId, credentialId) {
    if (typeof commentId !== 'string' || typeof threadId !== 'string' || typeof credentialId !== 'string') {
      throw new Error('DELETE_COMMENT_USE_CASE_NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = DeleteCommentUseCase;
