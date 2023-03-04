const ReplyToModel = require('../ReplyToModel');

describe('ReplyToModel entities', () => {
  it('should throw error when payload did not meet data type spesification', () => {
    // Arrange
    const payload = {
      id: 123,
      username: true,
      created_at: 2023,
      content: 'sebuah balsan comment',
      is_delete: 0,
    };

    // Action & Assert
    expect(() => new ReplyToModel(payload, '')).toThrowError('REPLY_TO_MODEL.NOT_MEET_DATA_TYPE_SPESIFICATION');
  });
});
