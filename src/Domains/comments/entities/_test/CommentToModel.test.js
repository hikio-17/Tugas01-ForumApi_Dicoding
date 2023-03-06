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

    let content = '';

    const commentToModelFalseDelete = new CommentToModel(contentFalseDelete, []);
    const commentToModelTrueDelete = new CommentToModel(contentTrueDelete, []);

    // Action & Assert
    if (!contentFalseDelete.is_delete) {
      content = commentToModelFalseDelete.content;
      expect(content).toEqual('sebuah comment');
    }

    if (contentTrueDelete.is_delete) {
      content = commentToModelTrueDelete.content;
      expect(content).toEqual('**komentar telah dihapus**');
    }
  });
});
