import { useState } from 'react';
import type { Product } from '../types';

export const useInventory = () => {
  const [products, setProducts] = useState<Product[]>([]);

  // เพิ่มสินค้า
  const addProduct = (name: string, price: number, quantity: number) => {
    const newProduct: Product = { id: Date.now(), name, price, quantity };
    setProducts([...products, newProduct]);
  };

  // อัปเดตจำนวน (+1 หรือ -1)
  const updateQuantity = (id: number, amount: number) => {
    setProducts(products.map(p => 
      p.id === id ? { ...p, quantity: Math.max(0, p.quantity + amount) } : p
    ));
  };

  // ลบสินค้า
  const deleteProduct = (id: number) => {
    setProducts(products.filter(p => p.id !== id));
  };

  // สรุปข้อมูล (Dashboard) ใช้ Array Methods ตามโจทย์
  const totalItems = products.length; // จำนวนรายการทั้งหมด
  const totalValue = products.reduce((sum, p) => sum + (p.price * p.quantity), 0); // มูลค่ารวม
  const outOfStockCount = products.filter(p => p.quantity === 0).length; // สินค้าหมด

  return { products, addProduct, updateQuantity, deleteProduct, totalItems, totalValue, outOfStockCount };
};