
🧪 Postman API Testing Project with Node.js Backend Support
This project is centered around API testing and automation using Postman and Newman. It leverages a sample CRUD API backend (developed by Eng. Shady Ahmed) to run test cases for Books, Households, Users, and Wishlists.

The backend is provided only as a reference server to support testing.
✅ All Postman collections, dynamic variables, test scripts, and automation setup (Newman, batch scripts, Jenkins integration) were created and maintained by me to demonstrate effective and reusable API testing practices.
---

## 🚀 API Endpoints

### 📘 Books
- `GET /books` – Retrieve all books  
- `GET /books/:id` – Retrieve a book by ID  
- `POST /books` – Create a new book  
  ```json
  {
    "title": "Book Title",
    "author": "Author",
    "isbn": "ISBN",
    "releaseDate": "Release Date"
  }
  ```
- `PUT /books/:id` – Update a book by ID  
- `PATCH /books/:id` – Partially update a book  
- `DELETE /books/:id` – Delete a book by ID

---

### 🏠 Households
- `GET /households` – Retrieve all households  
- `GET /households/:id` – Retrieve a household by ID  
- `POST /households` – Create a new household  
- `PUT /households/:id` – Update a household by ID  
- `PATCH /households/:id` – Partially update a household  
- `DELETE /households/:id` – Delete a household by ID

---

### 👤 Users
- `GET /users` – Retrieve all users  
- `GET /users/:id` – Retrieve a user by ID  
- `POST /users` – Create a new user  
  ```json
  {
    "firstName": "John",
    "lastName": "Doe",
    "email": "johndoe@example.com"
  }
  ```
- `PUT /users/:id` – Update a user by ID  
- `PATCH /users/:id` – Partially update a user  
- `DELETE /users/:id` – Delete a user by ID

---

### 🎁 Wishlists
- `GET /wishlists` – Retrieve all wishlists  
- `GET /wishlists/:id` – Retrieve a wishlist by ID  
- `POST /wishlists` – Create a new wishlist  
  ```json
  {
    "name": "Wishlist Name",
    "books": []
  }
  ```
- `PUT /wishlists/:id` – Update a wishlist by ID  
- `PATCH /wishlists/:id` – Partially update a wishlist  
- `DELETE /wishlists/:id` – Delete a wishlist by ID

---

### 🔧 Special Routes
- `POST /users` – Create a wishlist for the user and assign it  
- `POST /wishlists/:wishlistId/books/:bookId` – Add book to a wishlist  
- `GET /wishlists/:wishlistId/books` – Get books for a wishlist  
- `GET /households/:householdId/wishlistBooks` – Get all books from users in a household  
- `GET /books/search?title=...&author=...` – Search books

---

### 🔐 Authentication

Some routes require **Basic Auth**:

- Books (PUT, DELETE)
- Users (DELETE)

**Format:**

```http
Authorization: Basic <base64(username:password)>
```

Example:

```http
Authorization: Basic YWRtaW46YWRtaW4=
```

(Which is `admin:admin`)

---

## 🛠 Running the Project

### 📋 Prerequisites
- Node.js (v14+)
- npm (v6+)

### 📥 Install Dependencies

```bash
npm install
```

### ▶️ Start the Server

```bash
npm start
```

Server runs at: `http://localhost:3000`

---

### 🧪 Run in Test Mode

```bash
NODE_ENV=test npm start
```

Uses `db.test.json` as the test DB.

---

## 🧪 Postman Collection & Automation

This project includes a fully featured **Postman collection** with:
- Dynamic variables
- Pre-request and test scripts
- Executable via **Newman**
- Automatable in **Jenkins**

### 🗂 Project Structure

```text
📁 root/  
├── Postman_exports/                    # Postman collection & environment files  
├── newman/                             # Output folder for Newman reports  
├── DEV.postman_environment.json        # Postman environment file  
├── Library.postman_collection.json     # Postman collection with dynamic variables and test scripts  
├── Run.bat                             # Windows batch script to run Newman tests  
```

---

## 💡 Example Requests

### Create a Book

```http
POST /books
Content-Type: application/json

{
  "title": "New Book",
  "author": "John Doe",
  "isbn": "1234567890",
  "releaseDate": "2025-01-01"
}
```

### Update a Book

```http
PUT /books/1
Content-Type: application/json

{
  "title": "Updated Book",
  "author": "Jane Doe",
  "isbn": "0987654321",
  "releaseDate": "2025-02-01"
}
```

### Delete a Book

```http
DELETE /books/1
```

---

## 📜 License

This project is licensed under the **MIT License** – see the [LICENSE](./LICENSE) file for details.

---

