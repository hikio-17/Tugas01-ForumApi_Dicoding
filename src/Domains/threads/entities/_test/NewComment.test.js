const NewComment = require('../NewComment');

describe('NewComment entities', () => {
  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      content: 12345667890,
    };

    // Action and Assert
    expect(() => new NewComment(payload)).toThrowError('NEW_COMMENT.NOT_MEET_DATA_TYPE_SPESIFICATION');
  });

  it('should return value if payload correctly value', () => {
    // Arrange
    const payload = {
      content: 'berisi sebuah comment',
    };

    // Action
    const newComment = new NewComment(payload);

    // Assert
    expect(newComment.content).toEqual(payload.content);
  });
});
