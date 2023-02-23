const NewComment = require('../../Domains/threads/entities/NewComment');

class AddComentUseCase {
  constructor({ threadRepository }) {
    this._threadRespository = threadRepository;
  }

  async execute(useCasePayload, threadId, credentialId) {
    await this._threadRespository.verifyAvailableThread(threadId);
    const newComment = new NewComment(useCasePayload);
    return this._threadRespository.addComment(newComment, threadId, credentialId);
  }
}

module.exports = AddComentUseCase;
