"use client";

import React, { useState } from "react";
import { AdvancedTable, Column } from "./advanced-table";
import { Input } from "./input";
import { Badge } from "./badge";

// Example data types
interface User {
  id: number;
  name: string;
  email: string;
  age: number;
  status: "active" | "inactive";
  department: string;
  salary: number;
  joinDate: string;
}

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  rating: number;
  featured: boolean;
}

// Example usage of AdvancedTable
export function AdvancedTableExample() {
  const [users] = useState<User[]>([
    {
      id: 1,
      name: "田中太郎",
      email: "tanaka@example.com",
      age: 30,
      status: "active",
      department: "営業部",
      salary: 5000000,
      joinDate: "2020-01-15",
    },
    {
      id: 2,
      name: "佐藤花子",
      email: "sato@example.com",
      age: 25,
      status: "active",
      department: "開発部",
      salary: 6000000,
      joinDate: "2019-03-20",
    },
    {
      id: 3,
      name: "鈴木一郎",
      email: "suzuki@example.com",
      age: 35,
      status: "inactive",
      department: "マーケティング部",
      salary: 4500000,
      joinDate: "2021-06-10",
    },
  ]);

  const [products] = useState<Product[]>([
    {
      id: 1,
      name: "ノートパソコン",
      category: "電子機器",
      price: 120000,
      stock: 50,
      rating: 4.5,
      featured: true,
    },
    {
      id: 2,
      name: "ワイヤレスマウス",
      category: "アクセサリー",
      price: 3000,
      stock: 200,
      rating: 4.2,
      featured: false,
    },
    {
      id: 3,
      name: "モニター",
      category: "電子機器",
      price: 45000,
      stock: 30,
      rating: 4.8,
      featured: true,
    },
  ]);

  // User table columns with custom rendering
  const userColumns: Column<User>[] = [
    {
      key: "id",
      title: "ID",
      width: 80,
      align: "center",
      sortable: true,
    },
    {
      key: "name",
      title: "名前",
      dataIndex: "name",
      width: 150,
      sortable: true,
      filterable: true,
    },
    {
      key: "email",
      title: "メール",
      dataIndex: "email",
      width: 200,
      sortable: true,
      filterable: true,
    },
    {
      key: "age",
      title: "年齢",
      dataIndex: "age",
      width: 80,
      align: "center",
      sortable: true,
    },
    {
      key: "status",
      title: "ステータス",
      dataIndex: "status",
      width: 120,
      align: "center",
      sortable: true,
      render: (value: string) => (
        <Badge variant={value === "active" ? "default" : "secondary"}>
          {value === "active" ? "アクティブ" : "非アクティブ"}
        </Badge>
      ),
    },
    {
      key: "department",
      title: "部署",
      dataIndex: "department",
      width: 150,
      sortable: true,
      filterable: true,
    },
    {
      key: "salary",
      title: "給与",
      dataIndex: "salary",
      width: 120,
      align: "right",
      sortable: true,
      render: (value: number) => `¥${value.toLocaleString()}`,
    },
    {
      key: "joinDate",
      title: "入社日",
      dataIndex: "joinDate",
      width: 120,
      align: "center",
      sortable: true,
    },
  ];

  // Product table columns with editable cells
  const productColumns: Column<Product>[] = [
    {
      key: "id",
      title: "ID",
      width: 80,
      align: "center",
      sortable: true,
    },
    {
      key: "name",
      title: "商品名",
      dataIndex: "name",
      width: 200,
      sortable: true,
      filterable: true,
    },
    {
      key: "category",
      title: "カテゴリ",
      dataIndex: "category",
      width: 120,
      sortable: true,
      filterable: true,
    },
    {
      key: "price",
      title: "価格",
      dataIndex: "price",
      width: 120,
      align: "right",
      sortable: true,
      render: (value: number, record: Product) => (
        <Input
          type="number"
          value={value}
          onChange={(e) => {
            // Handle price change
            console.log("Price changed:", e.target.value);
          }}
          className="w-24 h-8 text-sm"
        />
      ),
    },
    {
      key: "stock",
      title: "在庫",
      dataIndex: "stock",
      width: 100,
      align: "center",
      sortable: true,
      render: (value: number) => (
        <span className={value < 10 ? "text-red-600 font-bold" : "text-green-600"}>
          {value}
        </span>
      ),
    },
    {
      key: "rating",
      title: "評価",
      dataIndex: "rating",
      width: 100,
      align: "center",
      sortable: true,
      render: (value: number) => (
        <div className="flex items-center">
          <span className="text-yellow-500">★</span>
          <span className="ml-1">{value}</span>
        </div>
      ),
    },
    {
      key: "featured",
      title: "おすすめ",
      dataIndex: "featured",
      width: 100,
      align: "center",
      sortable: true,
      render: (value: boolean) => (
        <Badge variant={value ? "default" : "outline"}>
          {value ? "おすすめ" : "通常"}
        </Badge>
      ),
    },
  ];


  const handleRowClick = (record: User | Product, index: number) => {
    console.log("Row clicked:", record, index);
  };

  return (
    <div className="space-y-8 p-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">ユーザーテーブル</h2>
        <AdvancedTable
          data={users}
          columns={userColumns}
          title="ユーザー管理"
          description="ユーザー情報の管理と編集"
          searchable
          sortable
          filterable
          pagination
          pageSize={10}
          onRowClick={handleRowClick}
          colorSettings={{
            headerBg: "bg-blue-50",
            headerText: "text-blue-700",
            rowHover: "hover:bg-blue-50",
            striped: true,
            stripedColor: "bg-blue-25",
          }}
        />
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">商品テーブル</h2>
        <AdvancedTable
          data={products}
          columns={productColumns}
          title="商品管理"
          description="商品情報の管理と編集"
          dense
          searchable
          sortable
          filterable
          scrollable
          maxHeight="300px"
          onRowClick={handleRowClick}
          colorSettings={{
            headerBg: "bg-green-50",
            headerText: "text-green-700",
            rowHover: "hover:bg-green-50",
            striped: true,
            stripedColor: "bg-green-25",
          }}
        />
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">シンプルテーブル</h2>
        <AdvancedTable
          data={users.slice(0, 2)}
          columns={userColumns.slice(0, 4)}
          title="シンプル表示"
          description="基本的なテーブル表示"
          showHeader={false}
          showFooter={false}
          colorSettings={{
            headerBg: "bg-gray-50",
            headerText: "text-gray-700",
            rowHover: "hover:bg-gray-50",
          }}
        />
      </div>
    </div>
  );
}
