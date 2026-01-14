# Forum API (Dicoding)

A sample Forum API implemented for the Dicoding Node.js backend course. This project provides basic forum functionality including user registration/authentication, threads, comments, and comment likes. It includes validation, error handling, and tests.

## Features

- User registration and authentication (JWT)
- Create, read, update, and delete threads
- Add comments to threads
- Like/unlike comments
- Input validation and structured error responses
- Unit and integration tests

## Requirements

- Node.js >= 16
- npm or yarn
- PostgreSQL (or the database configured via environment variables)
- Optional: Docker & docker-compose for a quick local DB

## Quick start

1. Clone the repository
   ```bash
   git clone https://github.com/hikio-17/Tugas01-ForumApi_Dicoding.git
   cd Tugas01-ForumApi_Dicoding
   ```

2. Install dependencies
   ```bash
   npm install
   # or
   yarn install
   ```

3. Environment variables

   Copy the example env file and update the values:
   ```bash
   cp .env.example .env
   ```
   Example .env values (adjust to your setup):
   ```
   NODE_ENV=development
   PORT=3000
   DATABASE_HOST=localhost
   DATABASE_PORT=5432
   DATABASE_USER=postgres
   DATABASE_PASSWORD=yourpassword
   DATABASE_NAME=forum_api
   JWT_SECRET=your_jwt_secret_here
   ```

4. Prepare the database

   - Create the database described in your .env (e.g., `forum_api`)
   - Run migrations/seeds if your project has migration scripts:
     ```bash
     npm run migrate
     npm run seed
     ```

5. Run the application
   ```bash
   npm start
   # or for development with automatic restarts
   npm run dev
   ```

6. Run tests
   ```bash
   npm test
   ```

## API overview

- POST /users — register a new user
- POST /authentications — login and receive a JWT
- POST /threads — create a thread (requires auth)
- GET /threads/:id — get details for a thread (includes comments)
- POST /threads/:threadId/comments — add a comment (requires auth)
- PUT /comments/:id/likes — toggle like/unlike on a comment (requires auth)

Refer to the implementation and test files for input/response shapes and error cases.

## Development tips

- Keep secrets out of the repository. Use `.env` or a secrets manager.
- Run the test suite frequently while changing logic related to threads/comments/likes.
- Use eslint/prettier if configured.

## Contributing

Contributions are welcome. Open issues for bugs or feature requests and provide clear descriptions. For code contributions, create a branch, open a PR, and describe your changes.

## License

This repository is for learning purposes. Check the LICENSE file (if present) for licensing details.
