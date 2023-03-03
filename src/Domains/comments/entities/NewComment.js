class NewComment {
  constructor(payload) {
    this._verifyPayload(payload);

    const { content } = payload;
    this.content = content;
  }

  _verifyPayload({ content }) {
    if (typeof content !== 'string') {
      throw new Error('NEW_COMMENT.NOT_MEET_DATA_TYPE_SPESIFICATION');
    }
  }
}

module.exports = NewComment;
