# Node.js CRUD API with JSON Server

This project demonstrates a RESTful API built with **Node.js** and **JSON Server**. It includes endpoints for **Books**, **Households**, **Users**, and **Wishlists**, supporting full CRUD operations: **Create**, **Read**, **Update**, and **Delete**.

## API Endpoints

### Books

- **GET** `/books`
  - Retrieve all books.
  
- **GET** `/books/:id`
  - Retrieve a book by its ID.

- **POST** `/books`
  - Create a new book.  
  - **Body**: `{ "title": "Book Title", "author": "Author", "isbn": "ISBN", "releaseDate": "Release Date" }`

- **PUT** `/books/:id`
  - Update a book by its ID.
  - **Body**: `{ "title": "Updated Title", "author": "Updated Author", "isbn": "Updated ISBN", "releaseDate": "Updated Release Date" }`

- **PATCH** `/books/:id`
  - Partially update a book by its ID.
  - **Body**: `{ "title": "Updated Title" }`

- **DELETE** `/books/:id`
  - Delete a book by its ID.

### Households

- **GET** `/households`
  - Retrieve all households.

- **GET** `/households/:id`
  - Retrieve a household by its ID.

- **POST** `/households`
  - Create a new household.
  - **Body**: `{ "name": "Household Name" }`

- **PUT** `/households/:id`
  - Update a household by its ID.
  - **Body**: `{ "name": "Updated Household Name" }`

- **PATCH** `/households/:id`
  - Partially update a household by its ID.
  - **Body**: `{ "name": "Updated Household Name" }`

- **DELETE** `/households/:id`
  - Delete a household by its ID.

### Users

- **GET** `/users`
  - Retrieve all users.

- **GET** `/users/:id`
  - Retrieve a user by its ID.

- **POST** `/users`
  - Create a new user.
  - **Body**: `{ "firstName": "John", "lastName": "Doe", "email": "johndoe@example.com" }`

- **PUT** `/users/:id`
  - Update a user by its ID.
  - **Body**: `{ "firstName": "Updated First Name", "lastName": "Updated Last Name", "email": "updatedemail@example.com" }`

- **PATCH** `/users/:id`
  - Partially update a user by its ID.
  - **Body**: `{ "email": "newemail@example.com" }`

- **DELETE** `/users/:id`
  - Delete a user by its ID.

### Wishlists

- **GET** `/wishlists`
  - Retrieve all wishlists.

- **GET** `/wishlists/:id`
  - Retrieve a wishlist by its ID.

- **POST** `/wishlists`
  - Create a new wishlist.
  - **Body**: `{ "name": "Wishlist Name", "books": [] }`

- **PUT** `/wishlists/:id`
  - Update a wishlist by its ID.
  - **Body**: `{ "name": "Updated Wishlist Name", "books": [] }`

- **PATCH** `/wishlists/:id`
  - Partially update a wishlist by its ID.
  - **Body**: `{ "name": "Updated Wishlist Name" }`

- **DELETE** `/wishlists/:id`
  - Delete a wishlist by its ID.

### Special Routes

- **POST** `/users`
  - Creates a new wishlist for the user and assigns it.

- **POST** `/wishlists/:wishlistId/books/:bookId`
  - Add a book to a wishlist.

- **GET** `/wishlists/:wishlistId/books`
  - Get all books for a specific wishlist.

- **GET** `/households/:householdId/wishlistBooks`
  - Get all books from users within a household.

- **GET** `/books/search`
  - Search for books by title or author.  
  - **Query Parameters**: `title` and/or `author`

## Authentication

Some routes require authentication:

- **Books** routes (`PUT`, `DELETE`)
- **Users** routes (`DELETE`)

To authenticate, send a **Basic Authentication** header with the following format:

Authorization: Basic <base64(username:password)>

yaml
Copy

For example:

Authorization: Basic YWRtaW46YWRtaW4=

markdown
Copy

Where `admin:admin` is the valid username and password (or `admin_test:admin_test` for test environments).

## Running the Project

### Prerequisites

- Node.js (v14 or later)
- npm (v6 or later)

### Install Dependencies

```bash
npm install
Start the Server
To start the server locally, run:

bash
Copy
npm start
The API will be available at http://localhost:3000.

Test Environment
To run the API in a test environment (with db.test.json as the database):

bash
Copy
NODE_ENV=test npm start
Example Requests
Create a New Book
bash
Copy
POST /books
Content-Type: application/json

{
  "title": "New Book",
  "author": "John Doe",
  "isbn": "1234567890",
  "releaseDate": "2025-01-01"
}
Update a Book
bash
Copy
PUT /books/1
Content-Type: application/json

{
  "title": "Updated Book",
  "author": "Jane Doe",
  "isbn": "0987654321",
  "releaseDate": "2025-02-01"
}
Delete a Book
bash
Copy
DELETE /books/1
License
This project is licensed under the MIT License - see the LICENSE file for details.


### Key Updates:

- **Books**, **Households**, **Users**, and **Wishlists** sections now include **GET All**, **GET by ID**, **POST**, **PUT**, **PATCH**, and **DELETE** CRUD operations.
- Added **Special Routes** for **POST `/users`** (creating a wishlist) and **POST `/wishlists/:wishlistId/books/:bookId`** (adding books to wishlists).
- Authentication notes have been added for protected routes.

Feel free to modify and extend the documentation further based on your project's needs. Let me know if you'd like further assistance!

## Contribution to shadyahmed9719@gmail.com


## After Cloning
After cloning the repo, make sure to run `npm install` in the root of the project directory.

## Running the application
From the command line, in the root of the project, run `npm run start:dev` this will start the server on port 3000
