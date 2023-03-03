const AddThreadUseCase = require('../../../../Applications/use_case/AddThreadsUserCase');
const AddCommentUseCase = require('../../../../Applications/use_case/AddCommentUseCase');
const DeleteCommentUseCase = require('../../../../Applications/use_case/DeleteComentUseCase');
const GetThreadUseCase = require('../../../../Applications/use_case/GetThreadUseCase');
const AddNewReplyCommentUseCase = require('../../../../Applications/use_case/AddNewReplyCommentUseCase');
const DeleteReplyCommentUseCase = require('../../../../Applications/use_case/DeleteReplyCommentUseCase');

class ThreadsHandler {
  constructor(container) {
    this._container = container;

    this.postThreadHandler = this.postThreadHandler.bind(this);
    this.postnewReplyCommentHandler = this.postnewReplyCommentHandler.bind(this);
    this.deleteCommentHandler = this.deleteCommentHandler.bind(this);
    this.getThreadHandler = this.getThreadHandler.bind(this);
    this.deleteReplyCommentByIdHandler = this.deleteReplyCommentByIdHandler.bind(this);
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

  async postnewReplyCommentHandler(request, h) {
    const { threadId, commentId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    const addNewReplyCommentUseCase = this._container.getInstance(AddNewReplyCommentUseCase.name);

    const addedReply = await addNewReplyCommentUseCase.execute(request.payload, threadId, commentId, credentialId);

    const response = h.response({
      status: 'success',
      data: {
        addedReply,
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

  async deleteReplyCommentByIdHandler(request, h) {
    const { threadId, commentId, replyId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    const deleteReplyCommentUseCase = this._container.getInstance(DeleteReplyCommentUseCase.name);

    await deleteReplyCommentUseCase.execute(threadId, commentId, replyId, credentialId);

    return {
      status: 'success',
    };
  }
}

module.exports = ThreadsHandler;
