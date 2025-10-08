# Advanced Button Component Usage

The enhanced `Button` component provides extensive customization options for various use cases.

## Features

- ✨ **Loading States** - Built-in spinner and loading text
- 🎨 **Multiple Variants** - 9 pre-styled variants
- 📏 **Flexible Sizing** - 5 size options
- 🖼️ **Icon Support** - Left/right icons with auto-sizing
- 🔄 **Full Width Option** - Responsive button widths
- ♿ **Accessibility** - Proper disabled and loading states

## Basic Usage

```tsx
import { Button } from "@/components/ui/button"

<Button>Click me</Button>
```

## Variants

```tsx
// Success (green)
<Button variant="success">Save</Button>

// Destructive (red)
<Button variant="destructive">Delete</Button>

// Info (blue)
<Button variant="info">Info</Button>

// Warning (yellow)
<Button variant="warning">Warning</Button>

// Secondary (blue/gray)
<Button variant="secondary">Calculate</Button>

// Outline
<Button variant="outline">Cancel</Button>

// Ghost (transparent hover)
<Button variant="ghost">Link</Button>

// Export (gray)
<Button variant="export">Export</Button>

// Default (primary color)
<Button variant="default">Submit</Button>
```

## Sizes

```tsx
<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>
<Button size="xl">Extra Large</Button>
<Button size="icon">🔍</Button>
```

## Icons

### Using Lucide Icons

```tsx
import { Save, Trash, Download, Upload } from "lucide-react"

// Left icon
<Button leftIcon={Save}>Save</Button>

// Right icon
<Button rightIcon={Download}>Download</Button>

// Both icons
<Button leftIcon={Upload} rightIcon={Download}>
  Sync
</Button>

// Icon only
<Button iconOnly leftIcon={Trash} />
```

### Using Custom Icons

```tsx
<Button leftIcon={<MyCustomIcon />}>Custom</Button>
```

## Loading State

```tsx
// Basic loading
<Button loading>Processing...</Button>

// Loading with custom text
<Button loading loadingText="Saving...">Save</Button>

// Loading disables the button automatically
<Button loading leftIcon={Save}>Save</Button>
```

## Full Width

```tsx
<Button fullWidth>Full Width Button</Button>
```

## Combined Examples

### Save Button with Loading

```tsx
const [isSaving, setIsSaving] = useState(false)

<Button 
  variant="success"
  leftIcon={Save}
  loading={isSaving}
  loadingText="保存中..."
  onClick={handleSave}
>
  保存
</Button>
```

### Delete with Confirmation

```tsx
<Button 
  variant="destructive"
  leftIcon={Trash}
  size="sm"
  onClick={handleDelete}
>
  削除
</Button>
```

### Export Buttons

```tsx
// Excel Export
<Button
  variant="outline"
  leftIcon={FileSpreadsheet}
  className="border-green-500 text-green-700"
>
  Excel出力
</Button>

// PDF Export
<Button
  variant="outline"
  leftIcon={FileText}
  className="border-red-500 text-red-700"
>
  PDF出力
</Button>
```

### Icon-only Buttons

```tsx
import { Search, Settings, Bell } from "lucide-react"

<Button size="icon" iconOnly leftIcon={Search} />
<Button size="icon" iconOnly leftIcon={Settings} variant="ghost" />
<Button size="icon" iconOnly leftIcon={Bell} variant="outline" />
```

### Button Group

```tsx
<div className="flex gap-2">
  <Button variant="success" leftIcon={Save}>保存</Button>
  <Button variant="outline" leftIcon={FileSpreadsheet}>Excel</Button>
  <Button variant="outline" leftIcon={FileText}>PDF</Button>
</div>
```

### Disabled State

```tsx
<Button disabled>Disabled Button</Button>
<Button disabled leftIcon={Save}>Can't Save</Button>
```

### Responsive Full Width

```tsx
<div className="w-full md:w-auto">
  <Button fullWidth variant="success">
    Submit Form
  </Button>
</div>
```

## Props Reference

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'default' \| 'destructive' \| 'outline' \| 'secondary' \| 'ghost' \| 'link' \| 'export' \| 'success' \| 'warning' \| 'info'` | `'default'` | Button style variant |
| `size` | `'default' \| 'sm' \| 'lg' \| 'xl' \| 'icon'` | `'default'` | Button size |
| `loading` | `boolean` | `false` | Show loading spinner and disable button |
| `loadingText` | `string` | `undefined` | Text to show while loading |
| `leftIcon` | `LucideIcon \| ReactNode` | `undefined` | Icon to show on the left |
| `rightIcon` | `LucideIcon \| ReactNode` | `undefined` | Icon to show on the right |
| `iconOnly` | `boolean` | `false` | Hide text, show only icon |
| `fullWidth` | `boolean` | `false` | Make button full width |
| `disabled` | `boolean` | `false` | Disable button |
| `asChild` | `boolean` | `false` | Render as Slot component |
| `className` | `string` | `undefined` | Additional CSS classes |

## Best Practices

1. **Use semantic variants**: Choose variants that match the action (success for save, destructive for delete)
2. **Icon consistency**: Use icons consistently across your application
3. **Loading states**: Always show loading state for async operations
4. **Accessibility**: Ensure buttons have clear text labels (avoid icon-only when possible)
5. **Size appropriateness**: Use smaller sizes in tight spaces, larger for primary actions
6. **Color contrast**: Ensure custom className colors maintain good contrast ratios

## Migration from Old Pattern

### Before
```tsx
<Button className="bg-green-600 hover:bg-green-700">
  <Save className="h-4 w-4 mr-2" />
  保存
</Button>
```

### After
```tsx
<Button variant="success" leftIcon={Save}>
  保存
</Button>
```

## TypeScript Support

The component is fully typed with TypeScript. IDE autocomplete will help you discover all available props and variants.

```tsx
import { Button, type ButtonProps } from "@/components/ui/button"

const MyCustomButton: React.FC<ButtonProps> = (props) => {
  return <Button {...props} />
}
```

