'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const colors = [
  { value: '#dc2626', name: 'Red', className: 'bg-red-600' },
  { value: '#2563eb', name: 'Blue', className: 'bg-blue-600' },
  { value: '#16a34a', name: 'Green', className: 'bg-green-600' },
  { value: '#ca8a04', name: 'Yellow', className: 'bg-yellow-600' },
  { value: '#7c3aed', name: 'Violet', className: 'bg-violet-600' },
  { value: '#db2777', name: 'Pink', className: 'bg-pink-600' },
  { value: '#ea580c', name: 'Orange', className: 'bg-orange-600' },
  { value: '#0891b2', name: 'Cyan', className: 'bg-cyan-600' },
];

interface ColorSelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function ColorSelect({
  value,
  onValueChange,
  placeholder = 'Select a color',
  className,
}: ColorSelectProps) {
  const selectedColor = colors.find((color) => color.value === value);

  return (
    <Select onValueChange={onValueChange} value={value}>
      <SelectTrigger className={className}>
        <div className="flex items-center gap-2">
          <SelectValue placeholder={placeholder} />
        </div>
      </SelectTrigger>
      <SelectContent>
        {colors.map((color) => (
          <SelectItem key={color.value} value={color.value}>
            <div className="flex items-center gap-2">
              <div className={`w-4 h-4 rounded-full ${color.className}`} />
              {color.name}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
