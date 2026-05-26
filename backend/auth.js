const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { db } = require("./database");

const JWT_SECRET = process.env.JWT_SECRET || "your_fallback_secret";

const register = (req, res) => {
  const { username, password, role } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Username and password are required" });
  }

  try {
    const hashedPassword = bcrypt.hashSync(password, 10);
    const stmt = db.prepare(
      "INSERT INTO users (username, password, role) VALUES (?, ?, ?)",
    );
    const result = stmt.run(username, hashedPassword, role || "customer");

    res
      .status(201)
      .json({ id: result.lastInsertRowid, username, role: role || "customer" });
  } catch (error) {
    if (error.code === "SQLITE_CONSTRAINT_UNIQUE") {
      return res.status(400).json({ error: "Username already exists" });
    }
    res.status(500).json({ error: "Internal server error" });
  }
};

const login = (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Username and password are required" });
  }

  try {
    const user = db
      .prepare("SELECT * FROM users WHERE username = ?")
      .get(username);

    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: "24h" },
    );

    res.json({
      token,
      user: { id: user.id, username: user.username, role: user.role },
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

const authorizeAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Admin access required" });
  }
  next();
};

module.exports = { register, login, authenticateToken, authorizeAdmin };
