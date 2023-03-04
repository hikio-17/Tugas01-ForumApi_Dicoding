const CommentToModel = require('../CommentToModel');

describe('CommentToModel entities', () => {
  it('should throw error when payload did not meet data type spesification', () => {
    // Arrange
    const payload = {
      id: 123,
      username: true,
      created_at: 2023,
      content: 'sebuah comment',
      is_delete: 0,
    };

    // Action & Assert
    expect(() => new CommentToModel(payload, '')).toThrowError('COMMENT_TO_MODEL.NOT_MEET_DATA_TYPE_SPESIFICATION');
  });
});
