# Backend（Node.js + Express）

本目錄為點餐系統後端 API，使用 Express + SQLite（better-sqlite3），並提供 Swagger 文件。

## 需求

- Node.js 18+
- npm

## 安裝

```bash
npm install
```

## 啟動

開發模式（nodemon）：

```bash
npm run dev
```

正式啟動：

```bash
npm start
```

預設埠號：`5000`  
可用 `.env` 覆寫 `PORT`、`JWT_SECRET`。

## API 與文件

- API Base URL：`http://localhost:5000/api`
- Swagger：`http://localhost:5000/api-docs`

主要端點：

- `POST /api/register`：註冊
- `POST /api/login`：登入
- `GET /api/menu`：取得菜單
- `POST /api/menu`：新增菜單（admin）
- `DELETE /api/menu/:id`：刪除菜單（admin）
- `POST /api/orders`：建立訂單（需登入）
- `GET /api/orders/me`：取得我的訂單（需登入）

## 資料庫

啟動時會在 backend 目錄建立 SQLite 檔案：

- `order_system.db`

並自動建立：

- `users`
- `menu_items`
- `orders`
- `order_items`
