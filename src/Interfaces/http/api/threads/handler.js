const AddThreadUseCase = require('../../../../Applications/use_case/AddThreadsUserCase');
const AddCommentUseCase = require('../../../../Applications/use_case/AddCommentUseCase');
const DeleteCommentUseCase = require('../../../../Applications/use_case/DeleteComentUseCase');
const GetThreadUseCase = require('../../../../Applications/use_case/GetThreadUseCase');

class ThreadsHandler {
  constructor(container) {
    this._container = container;

    this.postThreadHandler = this.postThreadHandler.bind(this);
    this.postCommentHandler = this.postCommentHandler.bind(this);
    this.deleteCommentHandler = this.deleteCommentHandler.bind(this);
    this.getThreadHandler = this.getThreadHandler.bind(this);
  }

  async postThreadHandler(request, h) {
    const { id: credentialId } = request.auth.credentials;
    const addThreadUseCase = this._container.getInstance(AddThreadUseCase.name);

    const addedThread = await addThreadUseCase.execute(request.payload, credentialId);

    const response = h.response({
      status: 'success',
      data: {
        addedThread,
      },
    });
    response.code(201);
    return response;
  }

  async getThreadHandler(request, h) {
    const { threadId } = request.params;
    const getThreadUseCase = this._container.getInstance(GetThreadUseCase.name);

    const thread = await getThreadUseCase.execute(threadId);

    return {
      status: 'success',
      data: {
        thread,
      },
    };
  }

  async postCommentHandler(request, h) {
    const { threadId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    const addCommentUseCase = this._container.getInstance(AddCommentUseCase.name);

    const addedComment = await addCommentUseCase.execute(request.payload, threadId, credentialId);

    const response = h.response({
      status: 'success',
      data: {
        addedComment,
      },
    });
    response.code(201);
    return response;
  }

  async deleteCommentHandler(request, h) {
    const { threadId, commentId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    const deleteCommentUse = this._container.getInstance(DeleteCommentUseCase.name);

    await deleteCommentUse.execute(commentId, threadId, credentialId);

    return {
      status: 'success',
    };
  }
}

module.exports = ThreadsHandler;
