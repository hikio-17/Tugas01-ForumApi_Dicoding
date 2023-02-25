class GetThreadUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(threadId) {
    await this._threadRepository.verifyAvailableThread(threadId);
    return this._threadRepository.getThreadById(threadId);
  }
}

module.exports = GetThreadUseCase;
