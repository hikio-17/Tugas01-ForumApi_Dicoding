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
    expect(() => new CommentToModel(payload, [])).toThrowError('COMMENT_TO_MODEL.NOT_MEET_DATA_TYPE_SPESIFICATION');
  });

  it('should return value payload correctly', () => {
    // Arrange
    const contentFalseDelete = {
      id: 'comment-123',
      username: 'my user',
      created_at: '2023',
      content: 'sebuah comment',
      is_delete: false,
    };

    const contentTrueDelete = {
      id: 'comment-123',
      username: 'my user',
      created_at: '2023',
      content: 'sebuah comment',
      is_delete: true,
    };

    // Action
    const commentToModelFalseDelete = new CommentToModel(contentFalseDelete, []);
    const commentToModelTrueDelete = new CommentToModel(contentTrueDelete, []);

    // Assert
    expect(commentToModelFalseDelete).toEqual({
      id: 'comment-123',
      username: 'my user',
      date: '2023',
      content: 'sebuah comment',
      replies: [],
    });
    expect(commentToModelTrueDelete).toEqual({
      id: 'comment-123',
      username: 'my user',
      date: '2023',
      content: '**komentar telah dihapus**',
      replies: [],
    });
  });
});
