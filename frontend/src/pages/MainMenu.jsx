import React, { useState, useEffect } from "react";
import axios from "axios";
import { Trash2, PlusCircle, LogOut, ShoppingCart } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5000/api";

const MainMenu = () => {
  const [menu, setMenu] = useState([]);
  const [cart, setCart] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [newItem, setNewItem] = useState({
    name: "",
    price: "",
    description: "",
  });
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchMenu();
    if (user?.role === "admin") setIsAdmin(true);
  }, [user]);

  const fetchMenu = async () => {
    try {
      const res = await axios.get(`${API_URL}/menu`);
      setMenu(res.data);
    } catch (err) {
      console.error("Failed to fetch menu");
    }
  };

  const addItemToMenu = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/menu`, newItem);
      setNewItem({ name: "", price: "", description: "" });
      fetchMenu();
    } catch (err) {
      alert("Only admins can add items");
    }
  };

  const deleteItemFromMenu = async (id) => {
    try {
      await axios.delete(`${API_URL}/menu/${id}`);
      fetchMenu();
    } catch (err) {
      alert("Failed to delete item");
    }
  };

  const addToCart = (item) => {
    const existing = cart.find((c) => c.id === item.id);
    if (existing) {
      setCart(
        cart.map((c) =>
          c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c,
        ),
      );
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const checkout = async () => {
    if (cart.length === 0) return;
    try {
      const total_price = cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
      );
      await axios.post(`${API_URL}/orders`, { items: cart, total_price });
      setCart([]);
      alert("訂單已送出！");
    } catch (err) {
      alert("點餐失敗，請稍後再試");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-orange-600">快速點餐系統</h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-600">
            你好, {user?.username} ({user?.role})
          </span>
          <button
            onClick={logout}
            className="text-red-500 hover:text-red-700 flex items-center gap-1"
          >
            <LogOut size={18} /> 登出
          </button>
        </div>
      </header>

      <main className="flex-1 p-6 grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto w-full">
        {/* Menu Section */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            今日菜單{" "}
            <span className="text-sm font-normal text-gray-400">
              ({menu.length} 項產品)
            </span>
          </h2>

          {isAdmin && (
            <div className="bg-white p-4 rounded-lg shadow-sm border border-orange-100">
              <h3 className="font-bold mb-3">管理員功能：新增菜單</h3>
              <form onSubmit={addItemToMenu} className="grid grid-cols-2 gap-2">
                <input
                  placeholder="餐點名稱"
                  className="border p-2 rounded col-span-2 lg:col-span-1"
                  value={newItem.name}
                  onChange={(e) =>
                    setNewItem({ ...newItem, name: e.target.value })
                  }
                  required
                />
                <input
                  type="number"
                  placeholder="價格"
                  className="border p-2 rounded"
                  value={newItem.price}
                  onChange={(e) =>
                    setNewItem({ ...newItem, price: e.target.value })
                  }
                  required
                />
                <input
                  placeholder="描述"
                  className="border p-2 rounded col-span-2"
                  value={newItem.description}
                  onChange={(e) =>
                    setNewItem({ ...newItem, description: e.target.value })
                  }
                />
                <button className="bg-orange-500 text-white p-2 rounded hover:bg-orange-600 col-span-2 flex items-center justify-center gap-2">
                  <PlusCircle size={18} /> 加入菜單
                </button>
              </form>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {menu.map((item) => (
              <div
                key={item.id}
                className="bg-white p-4 rounded-lg shadow-sm border flex justify-between items-center"
              >
                <div>
                  <h4 className="font-bold text-lg">{item.name}</h4>
                  <p className="text-gray-500 text-sm">{item.description}</p>
                  <p className="text-orange-600 font-bold mt-2">
                    ${item.price}
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => addToCart(item)}
                    className="bg-blue-100 text-blue-600 p-2 rounded-full hover:bg-blue-200"
                  >
                    <PlusCircle size={24} />
                  </button>
                  {isAdmin && (
                    <button
                      onClick={() => deleteItemFromMenu(item.id)}
                      className="text-red-400 hover:text-red-600 p-2"
                    >
                      <Trash2 size={20} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cart/Orders Section */}
        <div className="bg-white p-6 rounded-lg shadow-md h-fit sticky top-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <ShoppingCart size={24} /> 您的訂單
          </h2>

          {cart.length === 0 ? (
            <p className="text-gray-400 text-center py-8">購物車是空的</p>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between text-sm border-b pb-2"
                >
                  <span>
                    {item.name} x {item.quantity}
                  </span>
                  <span className="font-bold">
                    ${item.price * item.quantity}
                  </span>
                </div>
              ))}
              <div className="pt-4 border-t flex justify-between font-bold text-lg">
                <span>總計</span>
                <span className="text-orange-600">
                  ${cart.reduce((sum, i) => sum + i.price * i.quantity, 0)}
                </span>
              </div>
              <button
                onClick={checkout}
                className="w-full bg-orange-500 text-white font-bold py-3 rounded-lg hover:bg-orange-600 transition"
              >
                確認結帳
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default MainMenu;
