const { db } = require("./database");

// Menu Controller
const getMenu = (req, res) => {
  try {
    const items = db.prepare("SELECT * FROM menu_items").all();
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch menu" });
  }
};

const addMenuItem = (req, res) => {
  const { name, description, price, image_url } = req.body;
  try {
    const stmt = db.prepare(
      "INSERT INTO menu_items (name, description, price, image_url) VALUES (?, ?, ?, ?)",
    );
    const result = stmt.run(name, description, price, image_url);
    res
      .status(201)
      .json({
        id: result.lastInsertRowid,
        name,
        description,
        price,
        image_url,
      });
  } catch (error) {
    res.status(500).json({ error: "Failed to add menu item" });
  }
};

const deleteMenuItem = (req, res) => {
  const { id } = req.params;
  try {
    db.prepare("DELETE FROM menu_items WHERE id = ?").run(id);
    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ error: "Failed to delete menu item" });
  }
};

// Order Controller
const placeOrder = (req, res) => {
  const { items, total_price } = req.body;
  const user_id = req.user.id;

  try {
    const transaction = db.transaction(() => {
      const orderStmt = db.prepare(
        "INSERT INTO orders (user_id, total_price) VALUES (?, ?)",
      );
      const orderResult = orderStmt.run(user_id, total_price);
      const orderId = orderResult.lastInsertRowid;

      const itemStmt = db.prepare(
        "INSERT INTO order_items (order_id, menu_item_id, quantity, price_at_time) VALUES (?, ?, ?, ?)",
      );
      for (const item of items) {
        itemStmt.run(orderId, item.id, item.quantity, item.price);
      }
      return orderId;
    });

    const orderId = transaction();
    res.status(201).json({ id: orderId, message: "Order placed successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to place order" });
  }
};

const getMyOrders = (req, res) => {
  try {
    const orders = db
      .prepare(
        `
      SELECT o.*, GROUP_CONCAT(mi.name || ' x' || oi.quantity) as details
      FROM orders o
      JOIN order_items oi ON o.id = oi.order_id
      JOIN menu_items mi ON oi.menu_item_id = mi.id
      WHERE o.user_id = ?
      GROUP BY o.id
      ORDER BY o.created_at DESC
    `,
      )
      .all(req.user.id);
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
};

module.exports = {
  getMenu,
  addMenuItem,
  deleteMenuItem,
  placeOrder,
  getMyOrders,
};
