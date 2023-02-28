/* istanbul ignore file */
const repliesToModel = ({
  id, content, created_at, username, is_delete,
}) => ({
  id,
  content: is_delete ? '**balasan telah dihapus**' : content,
  date: created_at,
  username,
});

module.exports = repliesToModel;
