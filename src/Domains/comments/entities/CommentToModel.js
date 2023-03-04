class CommentToModel {
  constructor(comment, replies) {
    this._verifyComment(comment);

    this.id = comment.id;
    this.username = comment.username;
    this.date = comment.created_at;
    this.replies = replies;
    this.content = comment.is_delete ? '**komentar telah dihapus**' : comment.content;
  }

  _verifyComment({
    id, username, created_at, content,
  }) {
    if (typeof id !== 'string' || typeof username !== 'string' || typeof created_at !== 'string' || typeof content !== 'string') {
      throw new Error('COMMENT_TO_MODEL.NOT_MEET_DATA_TYPE_SPESIFICATION');
    }
  }
}

module.exports = CommentToModel;
