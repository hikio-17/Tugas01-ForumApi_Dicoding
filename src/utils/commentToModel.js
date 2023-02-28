/* istanbul ignore file */
const commentToModel = ({
  id, username, created_at, content, is_delete,
}, replies) => ({
  id,
  username,
  date: created_at,
  replies,
  content: is_delete ? '**komentar telah dihapus**' : content,
});

module.exports = commentToModel;
