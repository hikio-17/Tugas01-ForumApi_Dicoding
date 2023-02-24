/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const CommentsTableTestHelper = {
  async findCommentById(id) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = id',
      values: [id],
    };

    const { rows } = await pool.query(query);

    return rows[0];
  },
};

module.exports = CommentsTableTestHelper;
