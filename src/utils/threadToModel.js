/* istanbul ignore file */
const threadToModel = ({
  id, title, body, created_at, username,
}) => ({
  id,
  title,
  body,
  date: created_at,
  username,
});

module.exports = threadToModel;
