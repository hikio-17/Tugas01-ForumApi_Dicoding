const ThreadRepository = require('../../Domains/threads/ThreadRepository');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addThread(newThread, userId) {
    const { title, body } = newThread;

    const id = `thread-${this._idGenerator()}`;
    const createdAt = new Date().toISOString();

    const query = {
      text: 'INSERT INTO threads VALUES($1, $2, $3, $4, $5) RETURNING id, title, owner',
      values: [id, title, body, createdAt, userId],
    };

    const { rows } = await this._pool.query(query);

    return rows[0];
  }

  async getThreadById(threadId) {
    const queryThread = {
      text: 'SELECT threads.id, threads.title, threads.body, threads.created_at, users.username FROM threads INNER JOIN users ON users.id = threads.owner WHERE threads.id = $1',
      values: [threadId],
    };

    const queryComments = {
      text: 'SELECT comments.id, username, comments.created_at, comments.content, comments.is_delete FROM comments INNER JOIN users ON users.id = comments.owner WHERE comments.thread_id = $1',
      values: [threadId],
    };

    const queryReplies = {
      text: 'SELECT replies.id, username, replies.created_at, replies.content, replies.comment_id, replies.is_delete FROM replies INNER JOIN users ON users.id = replies.owner WHERE replies.thread_id = $1 ORDER BY created_at',
      values: [threadId],
    };

    const { rows: resultReplies } = await this._pool.query(queryReplies);

    const { rows: resultComments } = await this._pool.query(queryComments);

    const comments = [];

    resultComments.map((comment) => {
      const replies = [];
      resultReplies.map((reply) => {
        if (comment.id === reply.comment_id) {
          replies.push({
            id: reply.id,
            content: reply.is_delete ? '**balasan telah dihapus**' : reply.content,
            date: reply.created_at,
            username: reply.username,
          });
        }
      });
      comments.push({
        id: comment.id,
        username: comment.username,
        date: comment.created_at,
        replies,
        content: comment.is_delete ? '**komentar telah dihapus**' : comment.content,
      });
    });

    const { rows: resultThread } = await this._pool.query(queryThread);

    const {
      id, title, body, created_at, username,
    } = resultThread[0];

    const thread = {
      id,
      title,
      body,
      date: created_at,
      username,
    };

    return {
      ...thread,
      comments,
    };
  }

  async verifyAvailableThread(id) {
    const query = {
      text: 'SELECT * FROM threads WHERE id = $1',
      values: [id],
    };

    const { rowCount } = await this._pool.query(query);

    if (!rowCount) {
      throw new NotFoundError('Thread tidak ditemukan');
    }
  }

  async addComment(newComment, threadId, credentialId) {
    const { content } = newComment;
    const id = `comment-${this._idGenerator()}`;
    const createdAt = new Date().toISOString();
    const isDelete = false;

    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5, $6) RETURNING id, content, owner',
      values: [id, content, createdAt, credentialId, threadId, isDelete],
    };

    const { rows } = await this._pool.query(query);

    return rows[0];
  }

  async verifyCommentOwner(commentId, credentialId) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [commentId],
    };

    const { rows, rowCount } = await this._pool.query(query);

    if (!rowCount) {
      throw new NotFoundError('comment tidak ditemukan');
    }

    const { owner } = rows[0];

    if (rowCount && owner !== credentialId) {
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini!');
    }
  }

  async verifyAvailableComment(id) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [id],
    };

    const { rowCount } = await this._pool.query(query);

    if (!rowCount) {
      throw new NotFoundError('Comment tidak ditemukan');
    }
  }

  async verifyReplyOwner(replyId, credentialId) {
    const query = {
      text: 'SELECT * FROM replies WHERE id = $1',
      values: [replyId],
    };

    const { rows: reply, rowCount } = await this._pool.query(query);

    if (!rowCount) {
      throw new NotFoundError('reply comment tidak ditemukan');
    }

    if (rowCount && reply[0].owner !== credentialId) {
      throw new AuthorizationError('anda tidak berhak mengakses resource ini');
    }
  }

  async addNewReplyComment(newReply, threadId, commentId, credentialId) {
    const id = `reply-${this._idGenerator()}`;
    const createdAt = new Date().toISOString();
    const isDelete = false;

    const { content } = newReply;

    const query = {
      text: 'INSERT INTO replies VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id, content, owner',
      values: [id, content, createdAt, credentialId, threadId, commentId, isDelete],
    };

    const { rows } = await this._pool.query(query);

    return rows[0];
  }

  async deleteCommentById(id) {
    const query = {
      text: 'UPDATE comments SET is_delete = $1 WHERE id =$2',
      values: [true, id],
    };

    await this._pool.query(query);
  }

  async deleteReplyCommentById(replyId) {
    const query = {
      text: 'UPDATE replies SET is_delete = $1 WHERE id =$2',
      values: [true, replyId],
    };

    await this._pool.query(query);
  }
}

module.exports = ThreadRepositoryPostgres;
