# DevStream Server

This is the server-side code for DevStream, a social media platform designed for developers to share knowledge, showcase projects, and learn through video courses.

## Live Domain

The server is live at: [https://devstream-server.onrender.com/posts/](https://devstream-server.onrender.com/posts/)

## Features

- Create and read text-based posts
- Update and delete posts
- User profile management
- Admin functionalities
- JWT token authentication

## Upcoming Features

We are constantly working on new features and improvements. Here are some of the upcoming features:

- **Live Streaming:** Enable creators to live stream their coding sessions, tutorials, and discussions.
- **Pre-recorded Video Playlists:** Allow creators to organize and share series of pre-recorded videos as playlists.
- **Enhanced Chat Functionality:** Improve chat features with real-time messaging, group chats, and more.
- **Notifications:** Implement a notification system to alert users about new posts, comments, and other activities.
- **Advanced Search:** Add advanced search capabilities to find posts, users, and content more efficiently.
- **User Analytics:** Provide analytics for creators to track engagement and performance of their posts and videos.

Stay tuned for these exciting updates!

## Installation

To install and run the server locally:

1. Clone the repository:

   ```sh
   git clone https://github.com/marjanhasan/DevStream-Server.git
   cd devstream-server
   ```

2. Install the dependencies:

   ```sh
   npm install
   ```

3. Set up environment variables:

   Create a `.env` file in the root directory and add your MongoDB connection string and JWT secret key:

   ```
   PORT=available_port
   USER=mongodb_username
   PASS=mongodb_project_password
   SECRET=jwt_token
   ```

4. Start the server:

   For production:

   ```sh
   npm start
   ```

   For development (must have nodemon install):

   ```sh
   npm run dev
   ```

The server will start on port `3000` by default. You can change this by setting the `PORT` variable in your `.env` file.

## API Endpoints

### Posts

1. **Create a post**

   - **URL:** `/posts`
   - **Method:** `POST`
   - **Description:** Create a text-based single post.
   - **Body:**
     ```json
     {
       "username": "username",
       "email": "user@example.com",
       "post": "post_content"
     }
     ```

2. **Read all posts**

   - **URL:** `/posts`
   - **Method:** `GET`
   - **Description:** Read all posts by the user and other users.

3. **Read a single post**

   - **URL:** `/posts/:id`
   - **Method:** `GET`
   - **Description:** Read a single post by its specific ID.

4. **Update a post**

   - **URL:** `/posts/:id`
   - **Method:** `PATCH`
   - **Description:** Update a post by its ID.
   - **Body:**
     ```json
     {
       "post": "post_content"
     }
     ```

5. **Delete a post**
   - **URL:** `/posts/:id`
   - **Method:** `DELETE`
   - **Description:** Delete a post by its ID.

### Profile

1. **Read user posts**
   - **URL:** `/profile/:email`
   - **Method:** `GET`
   - **Description:** Read all posts by the user based on their email.

### User

1. **Create a user**

   - **URL:** `/user`
   - **Method:** `POST`
   - **Description:** Save user information after successful Firebase authentication.
   - **Body:**
     ```json
     {
       "username": "username",
       "email": "user@example.com"
     }
     ```

2. **Read all users (Admin)**

   - **URL:** `/user`
   - **Method:** `GET`
   - **Description:** Admin can read all available users.

3. **Read a user by email**

   - **URL:** `/user/:email`
   - **Method:** `GET`
   - **Description:** Find a user by their email.

4. **Update a user**
   - **URL:** `/user/:email`
   - **Method:** `PATCH`
   - **Description:** Update user account information (currently only username).
   - **Body:**
     ```json
     {
       "username": "newusername"
     }
     ```

## Authentication

9 out of 10 routes are protected by JWT token verification except for the `/user` (POST method) route.

## Contributing

Feel free to submit issues and pull requests. For major changes, please open an issue first to discuss what you would like to change.

## License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## GitHub Repository

You can find the source code and contribute to the project at the GitHub repository:

[https://github.com/marjanhasan/DevStream-Server](https://github.com/marjanhasan/DevStream-Server)

## Author

- **Marjan**
