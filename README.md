# 快速點餐系統（Food Ordering System）

這是一個前後端分離的點餐系統範例專案，支援：
- 使用者註冊與登入（JWT 驗證）
- 角色權限（admin / customer）
- 菜單瀏覽、加入購物車、送出訂單
- 管理員新增 / 刪除菜單項目
- Swagger API 文件

---

## 專案結構

```text
github/
├─ backend/    # Node.js + Express + SQLite API 服務
└─ frontend/   # React + Vite 前端介面
```

---

## 技術棧

### Frontend
- React 19
- Vite
- React Router
- Axios
- lucide-react

### Backend
- Node.js
- Express
- better-sqlite3
- JWT（jsonwebtoken）
- bcryptjs
- Swagger（swagger-jsdoc + swagger-ui-express）

---

## 功能說明

### 使用者端（customer）
- 註冊帳號
- 登入系統
- 瀏覽菜單
- 加入購物車
- 送出訂單

### 管理員（admin）
- 具備所有使用者端功能
- 新增菜單項目
- 刪除菜單項目

> 註冊時可指定 `role: admin` 或 `role: customer`。

---

## 安裝與啟動

## 1) 安裝後端

```bash
cd backend
npm install
```

## 2) 安裝前端

```bash
cd ../frontend
npm install
```

## 3) 啟動後端

```bash
cd ../backend
npm run dev
```

預設會啟動在：
- `http://localhost:5000`

## 4) 啟動前端（新開一個終端）

```bash
cd frontend
npm run dev
```

Vite 預設為：
- `http://localhost:5173`

---

## API 與文件

後端主要 API（Base URL）：
- `http://localhost:5000/api`

Swagger 文件：
- `http://localhost:5000/api-docs`

### 主要端點

- `POST /api/register`：註冊
- `POST /api/login`：登入
- `GET /api/menu`：取得菜單
- `POST /api/menu`：新增菜單（admin）
- `DELETE /api/menu/:id`：刪除菜單（admin）
- `POST /api/orders`：建立訂單（需登入）
- `GET /api/orders/me`：取得我的訂單（需登入）

---

## 資料庫

- 使用 SQLite（`better-sqlite3`）
- 資料庫檔案位於：
  - `backend/order_system.db`
- 後端啟動時會自動建立資料表：
  - `users`
  - `menu_items`
  - `orders`
  - `order_items`

---

## 身分驗證流程

1. 使用者登入後取得 JWT Token
2. 前端將 Token 存入 localStorage
3. 後續 API 請求自動附帶 `Authorization: Bearer <token>`
4. 後端中介層驗證 Token 與角色權限

---

## 開發指令速查

### Backend

```bash
npm run dev    # nodemon server.js
npm start      # node server.js
```

### Frontend

```bash
npm run dev
npm run build
npm run preview
npm run lint
```

---

## 常見問題

### 1) 前端連不到後端
- 確認後端是否已啟動在 `5000` 埠
- 確認前端 API URL 目前為：`http://localhost:5000/api`

### 2) 無法進行管理員操作
- 確認登入帳號的 `role` 為 `admin`

### 3) Swagger 打不開
- 確認後端已啟動
- 開啟 `http://localhost:5000/api-docs`

---

## 未來可擴充方向

- 菜單圖片上傳（目前欄位有 `image_url`，前端尚未完整使用）
- 訂單狀態流程（已下單 / 製作中 / 完成）
- 管理後台儀表板
- E2E 測試與單元測試
- Docker 化與 CI/CD

---

## 授權

目前未明確指定授權條款，如需開源建議補上 LICENSE（例如 MIT）。
