# Advanced Table Component

A highly flexible and reusable table component for React applications with TypeScript support.

## Features

- **Flexible Column Configuration**: Define columns with custom rendering, sorting, filtering, and styling
- **Advanced Styling**: Customizable colors, themes, and responsive design
- **Built-in Functionality**: Search, sort, filter, pagination, and export capabilities
- **Custom Rendering**: Define custom cell renderers for any column
- **Responsive Design**: Dense mode, scrolling, and mobile-friendly layouts
- **TypeScript Support**: Full type safety with generic types
- **Performance Optimized**: Efficient rendering with memoization

## Basic Usage

```tsx
import { AdvancedTable, Column } from "@/components/ui/advanced-table";

interface User {
  id: number;
  name: string;
  email: string;
  age: number;
}

const columns: Column<User>[] = [
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
  },
  {
    key: "age",
    title: "年齢",
    dataIndex: "age",
    width: 80,
    align: "center",
    sortable: true,
  },
];

const data: User[] = [
  { id: 1, name: "田中太郎", email: "tanaka@example.com", age: 30 },
  { id: 2, name: "佐藤花子", email: "sato@example.com", age: 25 },
];

function MyComponent() {
  return (
    <AdvancedTable
      data={data}
      columns={columns}
      title="ユーザー一覧"
      description="ユーザー情報の管理"
      searchable
      sortable
      pagination
      pageSize={10}
    />
  );
}
```

## Column Configuration

### Basic Column Properties

```tsx
interface Column<T = any> {
  key: string;                    // Unique identifier
  title: string;                  // Column header text
  dataIndex?: string;             // Property name in data object
  width?: string | number;        // Column width
  align?: "left" | "center" | "right"; // Text alignment
  sortable?: boolean;             // Enable sorting
  filterable?: boolean;           // Enable filtering
  render?: (value: any, record: T, index: number) => React.ReactNode;
  className?: string;             // Custom CSS class
  headerClassName?: string;      // Header CSS class
  cellClassName?: string;        // Cell CSS class
}
```

### Custom Rendering

```tsx
const columns: Column<User>[] = [
  {
    key: "status",
    title: "ステータス",
    dataIndex: "status",
    render: (value: string) => (
      <Badge variant={value === "active" ? "default" : "secondary"}>
        {value === "active" ? "アクティブ" : "非アクティブ"}
      </Badge>
    ),
  },
  {
    key: "salary",
    title: "給与",
    dataIndex: "salary",
    align: "right",
    render: (value: number) => `¥${value.toLocaleString()}`,
  },
  {
    key: "actions",
    title: "操作",
    render: (value: any, record: User) => (
      <div className="flex space-x-2">
        <Button size="sm" onClick={() => editUser(record.id)}>
          編集
        </Button>
        <Button size="sm" variant="destructive" onClick={() => deleteUser(record.id)}>
          削除
        </Button>
      </div>
    ),
  },
];
```

## Advanced Features

### Color Customization

```tsx
<AdvancedTable
  data={data}
  columns={columns}
  colorSettings={{
    headerBg: "bg-blue-50",
    headerText: "text-blue-700",
    rowBg: "bg-white",
    rowHover: "hover:bg-blue-50",
    border: "border-blue-200",
    striped: true,
    stripedColor: "bg-blue-25",
  }}
/>
```

### Search and Filtering

```tsx
<AdvancedTable
  data={data}
  columns={columns}
  searchable
  searchPlaceholder="ユーザーを検索..."
  filterable
  onFilterChange={(filters) => console.log("Filters:", filters)}
/>
```

### Pagination

```tsx
<AdvancedTable
  data={data}
  columns={columns}
  pagination
  pageSize={20}
  onPageChange={(page) => console.log("Page:", page)}
/>
```

### Dense Mode

```tsx
<AdvancedTable
  data={data}
  columns={columns}
  dense
  scrollable
  maxHeight="400px"
/>
```

### Custom Actions

```tsx
<AdvancedTable
  data={data}
  columns={columns}
  onRowClick={(record, index) => console.log("Row clicked:", record)}
  onCellChange={(value, record, column) => console.log("Cell changed:", value)}
  onSave={(data) => console.log("Save data:", data)}
  onExport={(data) => console.log("Export data:", data)}
/>
```

## Props Reference

### AdvancedTableProps

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | `T[]` | - | Array of data objects |
| `columns` | `Column<T>[]` | - | Column configuration |
| `title` | `string` | - | Table title |
| `description` | `string` | - | Table description |
| `loading` | `boolean` | `false` | Show loading state |
| `dense` | `boolean` | `false` | Enable dense mode |
| `scrollable` | `boolean` | `true` | Enable scrolling |
| `maxHeight` | `string \| number` | `"400px"` | Maximum table height |
| `searchable` | `boolean` | `false` | Enable search |
| `sortable` | `boolean` | `true` | Enable sorting |
| `filterable` | `boolean` | `false` | Enable filtering |
| `pagination` | `boolean` | `false` | Enable pagination |
| `pageSize` | `number` | `10` | Items per page |
| `onRowClick` | `(record: T, index: number) => void` | - | Row click handler |
| `onCellChange` | `(value: any, record: T, column: Column<T>) => void` | - | Cell change handler |
| `onSave` | `(data: T[]) => void` | - | Save handler |
| `onExport` | `(data: T[]) => void` | - | Export handler |

### ColorSettings

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `headerBg` | `string` | `"bg-slate-50"` | Header background color |
| `headerText` | `string` | `"text-slate-700"` | Header text color |
| `rowBg` | `string` | `"bg-white"` | Row background color |
| `rowHover` | `string` | `"hover:bg-slate-50"` | Row hover color |
| `border` | `string` | `"border-slate-200"` | Border color |
| `striped` | `boolean` | `false` | Enable striped rows |
| `stripedColor` | `string` | `"bg-slate-25"` | Stripe color |

## Examples

### User Management Table

```tsx
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
    key: "status",
    title: "ステータス",
    dataIndex: "status",
    width: 120,
    align: "center",
    render: (value: string) => (
      <Badge variant={value === "active" ? "default" : "secondary"}>
        {value === "active" ? "アクティブ" : "非アクティブ"}
      </Badge>
    ),
  },
  {
    key: "actions",
    title: "操作",
    width: 150,
    render: (value: any, record: User) => (
      <div className="flex space-x-2">
        <Button size="sm">編集</Button>
        <Button size="sm" variant="destructive">削除</Button>
      </div>
    ),
  },
];

<AdvancedTable
  data={users}
  columns={userColumns}
  title="ユーザー管理"
  description="ユーザー情報の管理と編集"
  searchable
  sortable
  filterable
  pagination
  pageSize={20}
  onSave={handleSave}
  onExport={handleExport}
  colorSettings={{
    headerBg: "bg-blue-50",
    headerText: "text-blue-700",
    rowHover: "hover:bg-blue-50",
    striped: true,
  }}
/>
```

### Product Inventory Table

```tsx
const productColumns: Column<Product>[] = [
  {
    key: "name",
    title: "商品名",
    dataIndex: "name",
    width: 200,
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
    render: (value: number) => `¥${value.toLocaleString()}`,
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
];

<AdvancedTable
  data={products}
  columns={productColumns}
  title="商品在庫"
  description="商品の在庫管理"
  dense
  searchable
  sortable
  scrollable
  maxHeight="500px"
  onCellChange={handleCellChange}
  colorSettings={{
    headerBg: "bg-green-50",
    headerText: "text-green-700",
    rowHover: "hover:bg-green-50",
    striped: true,
    stripedColor: "bg-green-25",
  }}
/>
```

## Best Practices

1. **Use TypeScript**: Always define proper types for your data and columns
2. **Optimize Performance**: Use `useMemo` for expensive calculations
3. **Handle Loading States**: Show loading indicators for better UX
4. **Responsive Design**: Use appropriate widths and dense mode for mobile
5. **Accessibility**: Ensure proper keyboard navigation and screen reader support
6. **Error Handling**: Implement proper error handling for data operations

## Migration from CustomTable

To migrate from the old `CustomTable` component:

1. Replace `ExcelForm` with `AdvancedTable`
2. Convert cell definitions to column definitions
3. Update data structure to use standard objects
4. Implement custom rendering for calculated values
5. Add proper TypeScript types

```tsx
// Old way
<ExcelForm
  sheetName="users"
  sheetTitle="ユーザー"
  cells={cellDefinitions}
  dense
/>

// New way
<AdvancedTable
  data={userData}
  columns={userColumns}
  title="ユーザー"
  dense
  searchable
  sortable
/>
```
