const ThreadToModel = require('../ThreadToModel');

describe('ThreadToModel entities', () => {
  it('should throw error when payload did not meet data type spesification', () => {
    // Arrange
    const payload = {
      id: 123,
      username: true,
      created_at: 2023,
      title: 'sebuah title',
      body: 0,
    };

    // Action & Assert
    expect(() => new ThreadToModel(payload, '')).toThrowError('THREAD_TO_MODEL.NOT_MEET_DATA_TYPE_SPESIFICATION');
  });
});
