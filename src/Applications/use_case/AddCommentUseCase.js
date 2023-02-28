const NewComment = require('../../Domains/threads/entities/NewComment');

class AddComentUseCase {
  constructor({ threadRepository }) {
    this._threadRespository = threadRepository;
  }

  async execute(useCasePayload, threadId, credentialId) {
    this._verifyParams(threadId, credentialId);
    await this._threadRespository.verifyAvailableThread(threadId);
    const newComment = new NewComment(useCasePayload);
    return this._threadRespository.addComment(newComment, threadId, credentialId);
  }

  _verifyParams(threadId, credentialId) {
    if (typeof threadId !== 'string' || typeof credentialId !== 'string') {
      throw new Error('ADD_COMMENT_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = AddComentUseCase;
