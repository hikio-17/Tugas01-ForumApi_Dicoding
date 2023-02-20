class ThreadsHandler {
  constructor() {
    this.postThreadHandler = this.postThreadHandler.bind(this);
  }

  postThreadHandler(request, h) {
    const { id } = request.auth.credentials;

    const response = h.response({
      status: 'success',
      message: id,
    });
    response.code(201);
    return response;
  }
}

module.exports = ThreadsHandler;
