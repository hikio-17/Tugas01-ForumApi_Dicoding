const ThreadsHandler = require("./handler");
const routes = require("./routes");

module.exports = {
   name: 'threads',
   register: async (server, {}) => {
      const threadsHandler = new ThreadsHandler();
      server.route(routes(threadsHandler));
   },
};