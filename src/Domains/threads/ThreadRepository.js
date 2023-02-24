class ThreadRepository {
  async addThread(newThread, credentialId) {
    throw new Error('THREADS_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async getThreadById(id) {
    throw new Error('THREADS_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async addComment(newComment, threadId, credentialId) {
    throw new Error('THREADS_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async verifyAvailableThread(id) {
    throw new Error('THREADS_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async verifyCommentOwner(commentId, credentialId) {
    throw new Error('THREADS_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async deleteCommentById(id) {
    throw new Error('THREADS_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }
}

module.exports = ThreadRepository;
