// routes/articles.js
const express = require("express");
const router = express.Router();
const db = require("./dbSingleton").getConnection();

// Add new article
router.post("/", (req, res, next) => {
  const { title, content, author } = req.body;
  if (!title || !content || !author)
    return res.status(400).json({ message: "Missing required fields" });

  const query =
    "INSERT INTO articles (title, content, author) VALUES (?, ?, ?)";
  db.query(query, [title, content, author], (err, result) => {
    if (err) return next(err);
    res.json({
      message: "Article added successfully",
      articleId: result.insertId,
    });
  });
});

// Delete article by ID
router.delete("/:id", (req, res, next) => {
  const query = "DELETE FROM articles WHERE id = ?";
  db.query(query, [req.params.id], (err, result) => {
    if (err) return next(err);
    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Article not found" });
    res.json({ message: "Article deleted successfully" });
  });
});

// Get articles by author
router.get("/author/:author", (req, res, next) => {
  const query = "SELECT * FROM articles WHERE author = ?";
  db.query(query, [req.params.author], (err, results) => {
    if (err) return next(err);
    res.json(results);
  });
});

// Get articles created after a certain date
router.get("/after/:date", (req, res, next) => {
  const query = "SELECT * FROM articles WHERE created_at > ?";
  db.query(query, [req.params.date], (err, results) => {
    if (err) return next(err);
    res.json(results);
  });
});

// Get articles sorted by creation date (newest first)
router.get("/sorted", (req, res, next) => {
  const query = "SELECT * FROM articles ORDER BY created_at DESC";
  db.query(query, (err, results) => {
    if (err) return next(err);
    res.json(results);
  });
});

// Get total count of articles
router.get("/count", (req, res, next) => {
  const query = "SELECT COUNT(*) AS total FROM articles";
  console.log(`The Query is : ${query}`);
  db.query(query, (err, results) => {
    console.log(`The error is :${err}`);
    console.log(`The result is : ${results}`);
    if (err) return next(err);
    res.json(results[0]);
  });
});

// Search articles by keyword in title
router.get("/search/:keyword", (req, res, next) => {
  const query = "SELECT * FROM articles WHERE title LIKE ?";
  db.query(query, [`%${req.params.keyword}%`], (err, results) => {
    if (err) return next(err);
    res.json(results);
  });
});

// Get unique authors
router.get("/authors", (req, res, next) => {
  const query = "SELECT DISTINCT author FROM articles";
  db.query(query, (err, results) => {
    if (err) return next(err);
    res.json(results);
  });
});
// Get all articles
router.get("/", (req, res, next) => {
  const query = "SELECT * FROM articles";
  db.query(query, (err, results) => {
    if (err) return next(err);
    res.json(results);
  });
});

// Get article by ID
router.get("/:id", (req, res, next) => {
  const query = "SELECT * FROM articles WHERE id = ?";
  db.query(query, [req.params.id], (err, results) => {
    if (err) return next(err);
    if (results.length === 0)
      return res.status(404).json({ message: "Article not found" });
    res.json(results[0]);
  });
});

module.exports = router;
