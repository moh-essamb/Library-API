const express = require("express");
const logger = require("morgan");
const jsonServer = require("json-server");
const url = require("url");
const env = process.env.NODE_ENV || "development";
const { flatten } = require("ramda");

const server = jsonServer.create();
const router =
  env === "test"
    ? jsonServer.router("db.test.json")
    : jsonServer.router("db.json");

const middlewares = jsonServer.defaults();

server.use(middlewares);

server.use(logger("dev"));

server.use(express.json());
server.use(express.urlencoded({ extended: false }));

require("./server/routes/")(server, express);

function isAuthorized(req) {
  if (req.headers.authorization) {
    const user_and_password = new Buffer.from(
      req.headers.authorization.split(" ")[1],
      "base64"
    ).toString();

    const user = user_and_password.split(":")[0];
    const pw = user_and_password.split(":")[1];

    return (
      user === "admin" &&
      ((env === "test" && pw === "admin_test") || pw === "admin")
    );
  } else {
    return false;
  }
}

const bookRouteNeedsAuth = (req) =>
  req.url.match(/books/) && (req.method === "DELETE" || req.method === "PUT" || req.method === "PATCH");

const userRouteNeedsAuth = (req) =>
  req.url.match(/users/) && req.method === "DELETE";

server.use((req, res, next) => {
  if (
    (bookRouteNeedsAuth(req) || userRouteNeedsAuth(req)) &&
    !isAuthorized(req)
  ) {
    res.sendStatus(401);
  } else {
    next();
  }
});

server.use((req, res, next) => {
  if (req.method === "POST") {
    if ((req.path === "/books" || req.path === "/books/") && !req.body.title) {
      res.status(500).send({ error: "Title cannot be null" });
      return;
    }
    req.body.createdAt = new Date().toISOString();
    req.body.updatedAt = new Date().toISOString();
    next();
  } else if (req.method === "PUT") {
    req.body.updatedAt = new Date().toISOString();
    req.method = "PATCH";
    next();
  } else {
    next();
  }
});

function fullUrl(req) {
  return url.format({
    protocol: req.protocol,
    host: req.get("host"),
    pathname: req.originalUrl,
  });
}

router.render = (req, res) => {
  if (req.method === "DELETE") {
    res.status(204);
  }

  if (req.method === "POST" && res.statusCode === 201) {
    res.locals.data.links = [
      {
        rel: "self",
        href: `${fullUrl(req)}/${res.locals.data.id}`,
      },
    ];
  }
  res.jsonp(res.locals.data);
};

// Books CRUD

// Get all books
server.get("/books", (req, res) => {
  const db = router.db;
  const books = db.get("books").value();
  res.status(200).json(books);
});

// Get a book by ID
server.get("/books/:id", (req, res) => {
  const db = router.db;
  const book = db.get("books").find({ id: parseInt(req.params.id) }).value();
  if (book) {
    res.status(200).json(book);
  } else {
    res.status(404).send({ message: "Book not found" });
  }
});

// Create a new book
server.post("/books", (req, res) => {
  const db = router.db;
  const book = db.get("books").insert(req.body).write();
  res.status(201).json(book);
});

// Update a book (PUT)
server.put("/books/:id", (req, res) => {
  const db = router.db;
  const book = db.get("books").find({ id: parseInt(req.params.id) }).assign(req.body).write();
  res.status(200).json(book);
});

// Partially update a book (PATCH)
server.patch("/books/:id", (req, res) => {
  const db = router.db;
  const book = db.get("books").find({ id: parseInt(req.params.id) }).value();
  
  if (!book) {
    return res.status(404).json({ error: "Book not found" });
  }
  
  // Partially update the book
  const updatedBook = db.get("books").find({ id: parseInt(req.params.id) }).assign(req.body).write();
  
  res.status(200).json(updatedBook);
});


// Delete a book
server.delete("/books/:id", (req, res) => {
  const db = router.db;
  const book = db.get("books").find({ id: parseInt(req.params.id) }).value();
  if (book) {
    db.get("books").remove({ id: parseInt(req.params.id) }).write();
    res.status(204).send();
  } else {
    res.status(404).send({ message: "Book not found" });
  }
});

// Households CRUD

// Get all households
server.get("/households", (req, res) => {
  const db = router.db;
  const households = db.get("households").value();
  res.status(200).json(households);
});

// Get a household by ID
server.get("/households/:id", (req, res) => {
  const db = router.db;
  const household = db.get("households").find({ id: parseInt(req.params.id) }).value();
  if (household) {
    res.status(200).json(household);
  } else {
    res.status(404).send({ message: "Household not found" });
  }
});

// Create a new household
server.post("/households", (req, res) => {
  const db = router.db;
  const household = db.get("households").insert(req.body).write();
  res.status(201).json(household);
});

// Update a household (PUT)
server.put("/households/:id", (req, res) => {
  const db = router.db;
  const household = db.get("households").find({ id: parseInt(req.params.id) }).assign(req.body).write();
  res.status(200).json(household);
});

// Partially update a household (PATCH)
server.patch("/households/:id", (req, res) => {
  const db = router.db;
  const household = db.get("households").find({ id: parseInt(req.params.id) }).assign(req.body).write();
  res.status(200).json(household);
});

// Delete a household
server.delete("/households/:id", (req, res) => {
  const db = router.db;
  const household = db.get("households").find({ id: parseInt(req.params.id) }).value();
  if (household) {
    db.get("households").remove({ id: parseInt(req.params.id) }).write();
    res.status(204).send();
  } else {
    res.status(404).send({ message: "Household not found" });
  }
});

// Users CRUD

// Get all users
server.get("/users", (req, res) => {
  const db = router.db;
  const users = db.get("users").value();
  res.status(200).json(users);
});

// Get a user by ID
server.get("/users/:id", (req, res) => {
  const db = router.db;
  const user = db.get("users").find({ id: parseInt(req.params.id) }).value();
  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404).send({ message: "User not found" });
  }
});

// Create a new user
server.post("/users", (req, res) => {
  const db = router.db;
  const user = db.get("users").insert(req.body).write();
  res.status(201).json(user);
});

// Update a user (PUT)
server.put("/users/:id", (req, res) => {
  const db = router.db;
  const user = db.get("users").find({ id: parseInt(req.params.id) }).assign(req.body).write();
  res.status(200).json(user);
});

// Partially update a user (PATCH)
server.patch("/users/:id", (req, res) => {
  const db = router.db;
  const user = db.get("users").find({ id: parseInt(req.params.id) }).assign(req.body).write();
  res.status(200).json(user);
});

// Delete a user
server.delete("/users/:id", (req, res) => {
  const db = router.db;
  const user = db.get("users").find({ id: parseInt(req.params.id) }).value();
  if (user) {
    db.get("users").remove({ id: parseInt(req.params.id) }).write();
    res.status(204).send();
  } else {
    res.status(404).send({ message: "User not found" });
  }
});

// Wishlists CRUD

// Get all wishlists
server.get("/wishlists", (req, res) => {
  const db = router.db;
  const wishlists = db.get("wishlists").value();
  res.status(200).json(wishlists);
});

// Get a wishlist by ID
server.get("/wishlists/:id", (req, res) => {
  const db = router.db;
  const wishlist = db.get("wishlists").find({ id: parseInt(req.params.id) }).value();
  if (wishlist) {
    res.status(200).json(wishlist);
  } else {
    res.status(404).send({ message: "Wishlist not found" });
  }
});

// Create a new wishlist
server.post("/wishlists", (req, res) => {
  const db = router.db;
  const wishlist = db.get("wishlists").insert(req.body).write();
  res.status(201).json(wishlist);
});

// Update a wishlist (PUT)
server.put("/wishlists/:id", (req, res) => {
  const db = router.db;
  const wishlist = db.get("wishlists").find({ id: parseInt(req.params.id) }).assign(req.body).write();
  res.status(200).json(wishlist);
});

// Partially update a wishlist (PATCH)
server.patch("/wishlists/:id", (req, res) => {
  const db = router.db;
  const wishlist = db.get("wishlists").find({ id: parseInt(req.params.id) }).assign(req.body).write();
  res.status(200).json(wishlist);
});

// Delete a wishlist
server.delete("/wishlists/:id", (req, res) => {
  const db = router.db;
  const wishlist = db.get("wishlists").find({ id: parseInt(req.params.id) }).value();
  if (wishlist) {
    db.get("wishlists").remove({ id: parseInt(req.params.id) }).write();
    res.status(204).send();
  } else {
    res.status(404).send({ message: "Wishlist not found" });
  }
});

// Server initialization
server.use(router);

server.get("*", (req, res) => res.status(404).send());

server.listen(process.env.PORT || 3000, () => {
  console.log(`Server running: ${process.env.PORT || 3000}`);
});

module.exports = server;

// const express = require("express");
// const logger = require("morgan");
// const jsonServer = require("json-server");
// const url = require("url");
// const env = process.env.NODE_ENV || "development";
// const { flatten } = require("ramda");

// const server = jsonServer.create();
// const router =
//   env === "test"
//     ? jsonServer.router("db.test.json")
//     : jsonServer.router("db.json");

// const middlewares = jsonServer.defaults();

// server.use(middlewares);

// server.use(logger("dev"));

// server.use(express.json());
// server.use(express.urlencoded({ extended: false }));

// require("./server/routes/")(server, express);

// function isAuthorized(req) {
//   if (req.headers.authorization) {
//     const user_and_password = new Buffer.from(
//       req.headers.authorization.split(" ")[1],
//       "base64"
//     ).toString();

//     const user = user_and_password.split(":")[0];
//     const pw = user_and_password.split(":")[1];

//     return (
//       user === "admin" &&
//       ((env === "test" && pw === "admin_test") || pw === "admin")
//     );
//   } else {
//     return false;
//   }
// }

// const bookRouteNeedsAuth = (req) =>
//   req.url.match(/books/) && (req.method === "DELETE" || req.method === "PUT");

// const userRouteNeedsAuth = (req) =>
//   req.url.match(/users/) && req.method === "DELETE";

// server.use((req, res, next) => {
//   if (
//     (bookRouteNeedsAuth(req) || userRouteNeedsAuth(req)) &&
//     !isAuthorized(req)
//   ) {
//     res.sendStatus(401);
//   } else {
//     next();
//   }
// });

// server.use((req, res, next) => {
//   if (req.method === "POST") {
//     if ((req.path === "/books" || req.path === "/books/") && !req.body.title) {
//       res.status(500).send({ error: "Title cannot be null" });
//       return;
//     }
//     req.body.createdAt = new Date().toISOString();
//     req.body.updatedAt = new Date().toISOString();
//     next();
//   } else if (req.method === "PUT") {
//     req.body.updatedAt = new Date().toISOString();
//     req.method = "PATCH";
//     next();
//   } else {
//     next();
//   }
// });

// function fullUrl(req) {
//   return url.format({
//     protocol: req.protocol,
//     host: req.get("host"),
//     pathname: req.originalUrl,
//   });
// }

// router.render = (req, res) => {
//   if (req.method === "DELETE") {
//     res.status(204);
//   }

//   if (req.method === "POST" && res.statusCode === 201) {
//     res.locals.data.links = [
//       {
//         rel: "self",
//         href: `${fullUrl(req)}/${res.locals.data.id}`,
//       },
//     ];
//   }
//   res.jsonp(res.locals.data);
// };

// server.post("/users", (req, res, next) => {
//   const db = router.db;

//   const collection = db.defaults({ wishlists: [] }).get("wishlists");

//   const newWishlist = collection
//     .insert({ name: `${req.body.firstName}'s List`, books: [] })
//     .write();

//   req.body.wishlistId = newWishlist.id;

//   next();
// });

// server.post("/wishlists/:wishlistId/books/:bookId", (req, res) => {
//   const db = router.db;

//   const wishlist = db
//     .defaults({ wishlists: [] })
//     .get("wishlists")
//     .find({ id: parseInt(req.params.wishlistId, 10) })
//     .value();

//   wishlist.books = wishlist.books || [];
//   const bookId = parseInt(req.params.bookId, 10);

//   const indexOf = wishlist.books.indexOf(bookId);

//   if (indexOf < 0) {
//     wishlist.books.push(bookId);
//   }

//   db.write();

//   res.sendStatus(204);
// });

// const getBooksForWishlist = (wishlistId, db) => {
//   const wishlist = db
//     .defaults({ wishlists: [] })
//     .get("wishlists")
//     .find({ id: wishlistId })
//     .cloneDeep()
//     .value();

//   const fullBooks = wishlist.books
//     ? wishlist.books.map((b) =>
//       db.get("books").find({ id: b }).cloneDeep().value()
//     )
//     : [];
//   wishlist.books = fullBooks;

//   return wishlist;
// };

// server.get("/wishlists/:wishlistId/books", (req, res) => {
//   const wishlist = getBooksForWishlist(
//     parseInt(req.params.wishlistId),
//     router.db
//   );
//   res.status(200).jsonp(wishlist);
// });

// server.get("/households/:householdId/wishlistBooks", (req, res) => {
//   const db = router.db;

//   const users = db
//     .get("users")
//     .filter({ householdId: parseInt(req.params.householdId, 10) })
//     .cloneDeep()
//     .value();

//   const wishlists = users.map((u) => getBooksForWishlist(u.wishlistId, db));

//   const books = wishlists.map((w) => w.books.map((b) => b));

//   res.status(200).jsonp(flatten(books));
// });

// server.get("/books/search", (req, res) => {
//   const db = router.db;

//   const books = db
//     .get("books")
//     .filter(
//       (r) =>
//         (req.query.title
//           ? r.title.toLowerCase().includes(req.query.title.toLowerCase())
//           : true) &&
//         (req.query.author
//           ? r.author.toLowerCase().includes(req.query.author.toLowerCase())
//           : true)
//     )
//     .value();

//   res.status(200).send(books);
// });

// server.use(router);

// server.get("*", (req, res) => res.status(404).send());

// server.listen(process.env.PORT || 3000, () => {
//   console.log(`Server running: ${process.env.PORT || 3000}`);
// });

// module.exports = server;
