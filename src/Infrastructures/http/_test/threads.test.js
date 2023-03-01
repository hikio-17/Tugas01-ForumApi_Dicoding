const pool = require('../../database/postgres/pool');
const ThreadsTableTestHandler = require('../../../../tests/ThreadsTableTestHelper');
const createServer = require('../createServer');
const container = require('../../container');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');

describe('/threads endpoint', () => {
  afterAll(async () => {
    await ThreadsTableTestHandler.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  // create variable global
  let accessTokenUserA = '';
  let accessTokenUserB = '';
  let threadId = '';
  let commentId = '';
  let replyId = '';

  it('create user and user login', async () => {
    /** create user and user login */
    const server = await createServer(container);

    // User A
    const createUserALoginPayload = {
      username: 'usera',
      password: 'secret',
    };

    // add user A
    await server.inject({
      method: 'POST',
      url: '/users',
      payload: {
        username: 'usera',
        password: 'secret',
        fullname: 'User A',
      },
    });
    // user A login
    const responseUserALogin = await server.inject({
      method: 'POST',
      url: '/authentications',
      payload: createUserALoginPayload,
    });

    const responseJsonUserALogin = JSON.parse(responseUserALogin.payload);
    const { accessToken: resultTokenUserA } = responseJsonUserALogin.data;
    accessTokenUserA = resultTokenUserA;

    // User B
    const createUserBLoginPayload = {
      username: 'userb',
      password: 'secret',
    };

    // add user B
    await server.inject({
      method: 'POST',
      url: '/users',
      payload: {
        username: 'userb',
        password: 'secret',
        fullname: 'User B',
      },
    });

    // user B login
    const responseUserBLogin = await server.inject({
      method: 'POST',
      url: '/authentications',
      payload: createUserBLoginPayload,
    });

    const responseJsonUserBLogin = JSON.parse(responseUserBLogin.payload);
    const { accessToken: resultTokenUserB } = responseJsonUserBLogin.data;
    accessTokenUserB = resultTokenUserB;
  });

  describe('when POST /threads endpoint', () => {
    it('should response 401 when reqeust payload not authentication', async () => {
      // Arrange
      const requestPayload = {
        title: 'ini title',
        body: 'ini body',
      };
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.message).toEqual('Missing authentication');
    });

    it('should response 400 when request payload not countain needed property', async () => {
      // Arrange
      const requestBadPayload = {
        title: 'ini title',
      };
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestBadPayload,
        headers: {
          Authorization: `Bearer ${accessTokenUserA}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson).toHaveProperty('status');
      expect(responseJson).toHaveProperty('message');
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat thread baru karena properti yang dibutuhkan tidak ada');
    });

    /** POST THREAD VALID PAYLOAD AND AUTHENTICATION */
    it('should response 201 and persisted thread', async () => {
      // Arrange
      const requestPayload = {
        title: 'ini title',
        body: 'ini body',
      };
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessTokenUserA}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data).toHaveProperty('addedThread');
      expect(responseJson.data.addedThread).toBeDefined();
      expect(responseJson.data.addedThread).toHaveProperty('id');
      expect(responseJson.data.addedThread).toHaveProperty('title');
      expect(responseJson.data.addedThread).toHaveProperty('owner');

      // set Variable threadId
      threadId = responseJson.data.addedThread.id;
    });

    it('should response 400 when title more than 50 character', async () => {
      // Arrange
      const requestPayload = {
        title: 'fake title fake titikele kaaklhfa akhahjhg kha kahgkahg lhgjkfshhgfdhghfjhgfffgg',
        body: 'body',
      };
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessTokenUserA}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat thread baru karena karakter title melebihi batas limit');
    });

    it('should response 400 when request payload not meet data type spesification', async () => {
      // Arrange
      const requestPayload = {
        title: true,
        body: 12345,
      };
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessTokenUserA}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat thread baru karena tipe data tidak seusai');
    });
  });

  /** POST COMMENT ENDPOINT */
  describe('when POST /threads/{threadId}/comments', () => {
    it('should response 401 when post comment not authentication', async () => {
      // Arrange
      const requestPayload = {
        content: 'balasan sebuah komentar',
      };
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.message).toEqual('Missing authentication');
    });

    it('should response 404 when threadId not available', async () => {
      // Arrange
      const requestPayload = {
        content: 'berisi sebuah comment',
      };
      const fakeThreadId = 'fakeThreadId';
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${fakeThreadId}/comments`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessTokenUserB}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('Thread tidak ditemukan');
    });

    it('should response 400 when request payload not meet data type spesification', async () => {
    // Arrange
      const requestPayload = {
        content: true,
      };
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessTokenUserB}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('comment harus berupa string');
    });

    it('should response 201 and persisted comment', async () => {
      // Arrange
      const requestPayload = {
        content: 'berisi sebuah comment',
      };
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessTokenUserB}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson).toHaveProperty('status');
      expect(responseJson.status).toEqual('success');
      expect(responseJson).toHaveProperty('data');
      expect(responseJson.data).toHaveProperty('addedComment');
      expect(responseJson.data.addedComment).toBeDefined();
      expect(responseJson.data.addedComment).toHaveProperty('id');
      expect(responseJson.data.addedComment).toHaveProperty('content');
      expect(responseJson.data.addedComment).toHaveProperty('owner');

      // set variable commentId
      commentId = responseJson.data.addedComment.id;
    });
  });

  /** POST REPLIES ENDPOINT */
  describe('when POST /threads/{threadId}/comments/{commentId}/replies', () => {
    it('should response 401 when post new reply comment not authentication', async () => {
      // Arrange
      const requestPayload = {
        content: 'balasan sebuah komentar',
      };
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.message).toEqual('Missing authentication');
    });

    it('should response 404 when threadId not available', async () => {
      // Arrange
      const requestPayload = {
        content: 'sebuah balasan comment',
      };
      const fakeThreadId = 'fakeThreadId';
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${fakeThreadId}/comments/${commentId}/replies`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessTokenUserA}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('Thread tidak ditemukan');
    });

    it('should response 404 when commentId not available', async () => {
      // Arrange
      const requestPayload = {
        content: 'sebuah balasan comment',
      };
      const fakeCommentId = 'fakeCommentId';
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${fakeCommentId}/replies`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessTokenUserA}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('Comment tidak ditemukan');
    });

    it('should response 400 when request payload not meet data type spesification', async () => {
    // Arrange
      const requestPayload = {
        content: true,
      };
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessTokenUserA}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('reply comment harus berupa string');
    });

    it('should response 201 and persisted comment', async () => {
      // Arrange
      const requestPayload = {
        content: 'sebuah balasan comment',
      };
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessTokenUserA}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson).toHaveProperty('status');
      expect(responseJson.status).toEqual('success');
      expect(responseJson).toHaveProperty('data');
      expect(responseJson.data).toHaveProperty('addedReply');
      expect(responseJson.data.addedReply).toBeDefined();
      expect(responseJson.data.addedReply).toHaveProperty('id');
      expect(responseJson.data.addedReply).toHaveProperty('content');
      expect(responseJson.data.addedReply).toHaveProperty('owner');

      // set variable replyId
      replyId = responseJson.data.addedReply.id;
    });
  });

  /** GET THREAD ENDPOINT */
  describe('when GET /threads/{threadId}', () => {
    it('should response 20o and persisted thread', async () => {
      // Arrange
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'GET',
        url: `/threads/${threadId}`,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data).toHaveProperty('thread');
      expect(responseJson.data.thread).toBeDefined();
    });
  });

  /** DELETE REPLY COMMENT ENDPOINT */
  describe('when DELETE /threads/{threadId}/comments/{commentId}/replies/{replyId}', () => {
    it('should response 401 when not authentication', async () => {
      // Arrange
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}/replies/${replyId}`,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.message).toEqual('Missing authentication');
    });

    it('should response 404 when replyId not available', async () => {
      // Arrange
      const fakeReplyId = 'fakeReplyId';
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}/replies/${fakeReplyId}`,
        headers: {
          Authorization: `Bearer ${accessTokenUserA}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('reply comment tidak ditemukan');
    });

    it('should response 403 when delete not owner reply comment', async () => {
      // Arrange
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}/replies/${replyId}`,
        headers: {
          Authorization: `Bearer ${accessTokenUserB}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(403);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('anda tidak berhak mengakses resource ini');
    });

    it('should response 200 when replyId available and valid owner replycomment', async () => {
      // Arrange
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}/replies/${replyId}`,
        headers: {
          Authorization: `Bearer ${accessTokenUserA}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });
  });

  /** DELETE COMMENT ENDPOINT */
  describe('when DELETE /threads/{threadId}/comments/{commentId}', () => {
    it('should response 401 when not authentication', async () => {
      // Arrange
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}`,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.message).toEqual('Missing authentication');
    });

    it('should response 404 when commentId not available', async () => {
      // Arrange
      const fakeCommentId = 'fakeCommentId';
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${fakeCommentId}`,
        headers: {
          Authorization: `Bearer ${accessTokenUserB}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('Comment tidak ditemukan');
    });

    it('should response 403 when delete not owner comment', async () => {
      // Arrange
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}`,
        headers: {
          Authorization: `Bearer ${accessTokenUserA}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(403);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('Anda tidak berhak mengakses resource ini!');
    });

    it('should response 200 when commentId available and valid owner comment', async () => {
      // Arrange
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}`,
        headers: {
          Authorization: `Bearer ${accessTokenUserB}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });
  });
});
