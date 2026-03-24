import { useState } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { useInventory } from './hooks/useInventory';

// --- Navigation Bar ---
const Navbar = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-100";
  return (
    <nav className="bg-white border-b border-gray-200 fixed w-full z-30 top-0">
      <div className="px-6 py-3 flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center font-bold text-xl text-gray-800 tracking-tight">
          <span className="mr-2 text-blue-600">📦</span> StockMaster
        </div>
        <div className="flex space-x-2">
          <Link to="/" className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isActive('/')}`}>Dashboard</Link>
          <Link to="/products" className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isActive('/products')}`}>คลังสินค้า</Link>
        </div>
      </div>
    </nav>
  );
};

// --- หน้า Dashboard ---
const Dashboard = ({ inv }: { inv: any }) => (
  <div className="space-y-6">
    <h1 className="text-2xl font-bold text-gray-800">สรุปสถานะปัจจุบัน</h1>
    
    {/* ใช้ grid-cols-3 เพื่อแบ่งเป็น 3 ส่วนในบรรทัดเดียว */}
    <div className="grid grid-cols-3 gap-6">
      
      {/* ฝั่งซ้าย: จำนวนรายการ */}
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm text-center">
        <p className="text-sm text-gray-500 font-medium mb-1">จำนวนรายการ</p>
        <p className="text-3xl font-bold text-gray-900">
          {inv.totalItems} <span className="text-sm font-normal text-gray-400">ชนิด</span>
        </p>
      </div>

      {/* ตรงกลาง: มูลค่ารวม */}
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm text-center">
        <p className="text-sm text-gray-500 font-medium mb-1">มูลค่ารวม (reduce)</p>
        <p className="text-3xl font-bold text-green-600">
          {inv.totalValue.toLocaleString()} <span className="text-sm font-normal text-gray-400">฿</span>
        </p>
      </div>

      {/* ฝั่งขวา: สินค้าที่หมด */}
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm text-center">
        <p className="text-sm text-gray-500 font-medium mb-1">สินค้าที่หมด</p>
        <p className="text-3xl font-bold text-red-600">
          {inv.outOfStockCount} <span className="text-sm font-normal text-gray-400">รายการ</span>
        </p>
      </div>

    </div>
  </div>
);

// --- หน้าตารางสินค้า (Row-based Table) ---
const ProductManagement = ({ inv }: { inv: any }) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [qty, setQty] = useState('');
  const [search, setSearch] = useState('');

  const filtered = inv.products.filter((p: any) => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      {/* Form สำหรับเพิ่มสินค้า */}
      <section className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <form className="flex flex-wrap gap-4" onSubmit={(e) => {
          e.preventDefault();
          if(!name || !price || !qty) return;
          inv.addProduct(name, Number(price), Number(qty));
          setName(''); setPrice(''); setQty('');
        }}>
          <input className="flex-1 min-w-[200px] border border-gray-200 p-2.5 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="ชื่อสินค้า..." value={name} onChange={e => setName(e.target.value)} required />
          <input className="w-32 border border-gray-200 p-2.5 rounded-lg text-sm outline-none" type="number" placeholder="ราคา (฿)" value={price} onChange={e => setPrice(e.target.value)} required />
          <input className="w-32 border border-gray-200 p-2.5 rounded-lg text-sm outline-none" type="number" placeholder="จำนวน" value={qty} onChange={e => setQty(e.target.value)} required />
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2.5 rounded-lg text-sm transition-all shadow-sm">เพิ่มข้อมูล</button>
        </form>
      </section>

      {/* ช่องค้นหา */}
      <div className="relative">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 text-sm">🔍</span>
        <input className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 shadow-sm outline-none focus:ring-2 focus:ring-blue-500" placeholder="ค้นหาตามชื่อสินค้า..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {/* ตารางแสดงผลแบบแนวนอน (ตรงตามรูปตัวอย่าง) */}
      <div className="overflow-hidden bg-white rounded-xl border border-gray-100 shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">สินค้า</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">สถานะ</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">ราคา</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">จำนวนสต็อก</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">จัดการ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map((p: any) => (
              <tr key={p.id} className={`transition-colors ${p.quantity === 0 ? 'bg-red-50' : 'hover:bg-gray-50/50'}`}>
                <td className="px-6 py-4 font-semibold text-gray-800">{p.name}</td>
                <td className="px-6 py-4 text-center">
                  {p.quantity === 0 ? (
                    <span className="text-[10px] font-bold px-2 py-1 bg-red-100 text-red-600 rounded-md uppercase">สินค้าหมด</span>
                  ) : (
                    <span className="text-[10px] font-bold px-2 py-1 bg-green-100 text-green-600 rounded-md uppercase">มีสินค้า</span>
                  )}
                </td>
                <td className="px-6 py-4 text-right font-medium text-gray-600">{p.price.toLocaleString()} ฿</td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-2">
                    <button className="w-7 h-7 bg-white border border-gray-200 rounded-md shadow-sm hover:bg-gray-50 font-bold active:scale-90 transition" onClick={() => inv.updateQuantity(p.id, -1)}>-</button>
                    <span className={`w-6 text-center font-bold ${p.quantity === 0 ? 'bg-red-50' : 'text-gray-700'}`}>{p.quantity}</span>
                    <button className="w-7 h-7 bg-white border border-gray-200 rounded-md shadow-sm hover:bg-gray-50 font-bold active:scale-90 transition" onClick={() => inv.updateQuantity(p.id, 1)}>+</button>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => inv.deleteProduct(p.id)} className="text-gray-300 hover:text-red-500 transition-colors px-2">🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="p-12 text-center text-gray-400 italic">ไม่พบรายการสินค้า</div>
        )}
      </div>
    </div>
  );
};

export default function App() {
  const inventory = useInventory();
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#FDFDFD]">
        <Navbar />
        <main className="max-w-7xl mx-auto px-6 pt-28 pb-12">
          <Routes>
            <Route path="/" element={<Dashboard inv={inventory} />} />
            <Route path="/products" element={<ProductManagement inv={inventory} />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}