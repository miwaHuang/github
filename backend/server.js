const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const { initializeDb } = require('./database');

dotenv.config();
initializeDb();

const app = express();
app.use(cors());
app.use(express.json());

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Food Ordering System API',
      version: '1.0.0',
      description: 'API documentation for the Food Ordering System',
    },
    servers: [
      {
        url: 'http://localhost:5000',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        MenuItem: {
          type: 'object',
          required: ['name', 'price'],
          properties: {
            id: { type: 'integer' },
            name: { type: 'string' },
            description: { type: 'string' },
            price: { type: 'number' },
            image_url: { type: 'string' }
          }
        },
        Order: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            user_id: { type: 'integer' },
            total_price: { type: 'number' },
            created_at: { type: 'string', format: 'date-time' },
            details: { type: 'string', description: 'Summary of items in the order' }
          }
        }
      }
    },
  },
  apis: ['./server.js'], // Files containing annotations
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

const { register, login, authenticateToken, authorizeAdmin } = require('./auth');
const { getMenu, addMenuItem, deleteMenuItem, placeOrder, getMyOrders } = require('./controllers');

/**
 * @swagger
 * /api/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [admin, customer]
 *                 default: customer
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Bad request
 */
app.post('/api/register', register);

/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: Login and get a JWT token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */
app.post('/api/login', login);

/**
 * @swagger
 * /api/menu:
 *   get:
 *     summary: Get all menu items
 *     tags: [Menu]
 *     responses:
 *       200:
 *         description: A list of menu items
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/MenuItem'
 *   post:
 *     summary: Add a new menu item (Admin only)
 *     tags: [Menu]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MenuItem'
 *     responses:
 *       201:
 *         description: Menu item added
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MenuItem'
 */
app.get('/api/menu', getMenu);
app.post('/api/menu', authenticateToken, authorizeAdmin, addMenuItem);

/**
 * @swagger
 * /api/menu/{id}:
 *   delete:
 *     summary: Delete a menu item (Admin only)
 *     tags: [Menu]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Menu item deleted
 */
app.delete('/api/menu/:id', authenticateToken, authorizeAdmin, deleteMenuItem);

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Place a new order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - items
 *               - total_price
 *             properties:
 *               total_price:
 *                 type: number
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     quantity:
 *                       type: integer
 *                     price:
 *                       type: number
 *     responses:
 *       201:
 *         description: Order placed
 */
app.post('/api/orders', authenticateToken, placeOrder);

/**
 * @swagger
 * /api/orders/me:
 *   get:
 *     summary: Get my orders
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of user orders
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 */
app.get('/api/orders/me', authenticateToken, getMyOrders);

// Placeholder for routes
app.get('/', (req, res) => {
  res.send('Food Ordering system API is running');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
