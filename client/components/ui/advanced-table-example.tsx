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
    {
      id: 4,
      name: "高橋美咲",
      email: "takahashi@example.com",
      age: 28,
      status: "active",
      department: "人事部",
      salary: 4800000,
      joinDate: "2020-08-12",
    },
    {
      id: 5,
      name: "山田健太",
      email: "yamada@example.com",
      age: 32,
      status: "active",
      department: "経理部",
      salary: 5200000,
      joinDate: "2018-11-05",
    },
    {
      id: 6,
      name: "佐々木恵",
      email: "sasaki@example.com",
      age: 27,
      status: "inactive",
      department: "総務部",
      salary: 4200000,
      joinDate: "2021-03-20",
    },
    {
      id: 7,
      name: "伊藤正人",
      email: "ito@example.com",
      age: 40,
      status: "active",
      department: "営業部",
      salary: 6500000,
      joinDate: "2015-06-01",
    },
    {
      id: 8,
      name: "渡辺真理",
      email: "watanabe@example.com",
      age: 29,
      status: "active",
      department: "開発部",
      salary: 5800000,
      joinDate: "2019-09-15",
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
          scrollable
          maxHeight="300px"
          bordered
          stickyHeader
          stickyColumns={2}
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
        <h2 className="text-2xl font-bold mb-4">スティッキーヘッダーテスト</h2>
        <div className="border border-red-200 p-4 rounded">
          <p className="text-sm text-gray-600 mb-2">
            このテーブルは高さ200pxに制限され、スクロール時にヘッダーが固定されるはずです。
          </p>
          <AdvancedTable
            data={users}
            columns={userColumns.slice(0, 4)}
            title=""
            description=""
            scrollable
            maxHeight="200px"
            bordered
            stickyHeader={true}
            colorSettings={{
              headerBg: "bg-red-50",
              headerText: "text-red-700",
              rowHover: "hover:bg-red-50",
            }}
          />
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">スティッキーカラムテーブル</h2>
        <AdvancedTable
          data={users}
          columns={userColumns}
          title="スティッキーカラム表示"
          description="最初の2列が固定されたテーブル"
          scrollable
          maxHeight="300px"
          bordered
          stickyHeader
          stickyColumns={2}
          colorSettings={{
            headerBg: "bg-green-50",
            headerText: "text-green-700",
            rowHover: "hover:bg-green-50",
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
