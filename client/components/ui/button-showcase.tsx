"use client";

import React, { useState } from "react";
import { Button } from "./button";
import { 
  Save, 
  Trash, 
  Download, 
  Upload, 
  Search, 
  Settings, 
  Bell,
  FileSpreadsheet,
  FileText,
  Plus,
  Edit,
  RefreshCw
} from "lucide-react";

/**
 * Button Showcase Component
 * Demonstrates all the features of the advanced Button component
 * 
 * Usage: Import this component into any page to see all button variations
 */
export default function ButtonShowcase() {
  const [loading1, setLoading1] = useState(false);
  const [loading2, setLoading2] = useState(false);

  const simulateLoading = (setter: (val: boolean) => void) => {
    setter(true);
    setTimeout(() => setter(false), 2000);
  };

  return (
    <div className="p-8 space-y-12 max-w-6xl">
      <div>
        <h1 className="text-3xl font-bold mb-2">Button Component Showcase</h1>
        <p className="text-gray-600">
          Comprehensive examples of all button variants and features
        </p>
      </div>

      {/* Variants */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Variants</h2>
        <div className="flex flex-wrap gap-3">
          <Button variant="default">Default</Button>
          <Button variant="success">Success</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="info">Info</Button>
          <Button variant="warning">Warning</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="export">Export</Button>
          <Button variant="link">Link</Button>
        </div>
      </section>

      {/* Sizes */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Sizes</h2>
        <div className="flex flex-wrap items-center gap-3">
          <Button size="sm">Small</Button>
          <Button size="default">Default</Button>
          <Button size="lg">Large</Button>
          <Button size="xl">Extra Large</Button>
          <Button size="icon" iconOnly leftIcon={Search} />
        </div>
      </section>

      {/* Left Icons */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Left Icons</h2>
        <div className="flex flex-wrap gap-3">
          <Button variant="success" leftIcon={Save}>Save</Button>
          <Button variant="destructive" leftIcon={Trash}>Delete</Button>
          <Button variant="info" leftIcon={Download}>Download</Button>
          <Button variant="secondary" leftIcon={Upload}>Upload</Button>
          <Button variant="outline" leftIcon={Plus}>Add New</Button>
          <Button variant="ghost" leftIcon={Edit}>Edit</Button>
        </div>
      </section>

      {/* Right Icons */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Right Icons</h2>
        <div className="flex flex-wrap gap-3">
          <Button variant="default" rightIcon={Download}>Download File</Button>
          <Button variant="outline" rightIcon={Upload}>Upload File</Button>
          <Button variant="secondary" rightIcon={RefreshCw}>Refresh Data</Button>
        </div>
      </section>

      {/* Icon Only */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Icon Only</h2>
        <div className="flex flex-wrap gap-3">
          <Button size="icon" iconOnly leftIcon={Search} variant="default" />
          <Button size="icon" iconOnly leftIcon={Settings} variant="secondary" />
          <Button size="icon" iconOnly leftIcon={Bell} variant="outline" />
          <Button size="icon" iconOnly leftIcon={Edit} variant="ghost" />
          <Button size="icon" iconOnly leftIcon={Trash} variant="destructive" />
          <Button size="icon" iconOnly leftIcon={Plus} variant="success" />
        </div>
      </section>

      {/* Loading States */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Loading States</h2>
        <div className="flex flex-wrap gap-3">
          <Button loading>Loading</Button>
          <Button loading loadingText="Saving...">Save</Button>
          <Button 
            variant="success" 
            leftIcon={Save}
            loading={loading1}
            loadingText="保存中..."
            onClick={() => simulateLoading(setLoading1)}
          >
            保存 (Click Me)
          </Button>
          <Button 
            variant="info" 
            leftIcon={Download}
            loading={loading2}
            loadingText="Downloading..."
            onClick={() => simulateLoading(setLoading2)}
          >
            Download (Click Me)
          </Button>
        </div>
      </section>

      {/* Disabled States */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Disabled States</h2>
        <div className="flex flex-wrap gap-3">
          <Button disabled>Disabled</Button>
          <Button variant="success" leftIcon={Save} disabled>
            Can't Save
          </Button>
          <Button variant="destructive" leftIcon={Trash} disabled>
            Can't Delete
          </Button>
        </div>
      </section>

      {/* Full Width */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Full Width</h2>
        <div className="space-y-3">
          <Button fullWidth variant="success" leftIcon={Save}>
            Full Width Button
          </Button>
          <Button fullWidth variant="outline" leftIcon={Download}>
            Another Full Width
          </Button>
        </div>
      </section>

      {/* Real World Examples */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Real World Examples</h2>
        
        {/* Action Group */}
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-3">Action Button Group (Japanese)</h3>
          <div className="flex flex-wrap gap-2">
            <Button variant="success" leftIcon={Save}>
              保存
            </Button>
            <Button variant="outline" leftIcon={FileSpreadsheet} className="border-green-500 text-green-700">
              Excel出力
            </Button>
            <Button variant="outline" leftIcon={FileText} className="border-red-500 text-red-700">
              PDF出力
            </Button>
          </div>
        </div>

        {/* Form Buttons */}
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-3">Form Actions</h3>
          <div className="flex gap-2">
            <Button variant="default" leftIcon={Save}>
              Submit
            </Button>
            <Button variant="outline">Cancel</Button>
            <Button variant="ghost" leftIcon={RefreshCw}>
              Reset
            </Button>
          </div>
        </div>

        {/* Confirmation Dialog */}
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-3">Confirmation Dialog</h3>
          <div className="flex gap-2">
            <Button variant="destructive" leftIcon={Trash}>
              Yes, Delete
            </Button>
            <Button variant="outline">Cancel</Button>
          </div>
        </div>

        {/* Size Variations */}
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-3">Different Sizes with Icons</h3>
          <div className="flex flex-wrap items-center gap-2">
            <Button size="sm" leftIcon={Save}>
              Small Save
            </Button>
            <Button size="default" leftIcon={Save}>
              Default Save
            </Button>
            <Button size="lg" leftIcon={Save}>
              Large Save
            </Button>
            <Button size="xl" leftIcon={Save}>
              Extra Large Save
            </Button>
          </div>
        </div>
      </section>

      {/* Combined Features */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Combined Features</h2>
        <div className="flex flex-wrap gap-3">
          <Button 
            variant="success" 
            size="lg" 
            leftIcon={Save}
            rightIcon={RefreshCw}
          >
            Save & Sync
          </Button>
          <Button 
            variant="info" 
            size="sm" 
            leftIcon={Download}
            loading
          >
            Small Loading
          </Button>
          <Button 
            variant="outline" 
            size="xl" 
            rightIcon={Upload}
          >
            Extra Large Upload
          </Button>
        </div>
      </section>

      {/* Color Customization */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Custom Colors</h2>
        <div className="flex flex-wrap gap-3">
          <Button className="bg-purple-600 hover:bg-purple-700 text-white" leftIcon={Save}>
            Purple Custom
          </Button>
          <Button className="bg-pink-600 hover:bg-pink-700 text-white" leftIcon={Plus}>
            Pink Custom
          </Button>
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white" leftIcon={Download}>
            Indigo Custom
          </Button>
        </div>
      </section>
    </div>
  );
}

