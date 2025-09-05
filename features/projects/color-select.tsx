'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export const colors = [
  { value: '#93c5fd', name: 'Blue', className: 'bg-blue-300' },
  { value: '#86efac', name: 'Green', className: 'bg-green-300' },
  { value: '#fde047', name: 'Yellow', className: 'bg-yellow-300' },
  { value: '#c4b5fd', name: 'Violet', className: 'bg-violet-300' },
  { value: '#f9a8d4', name: 'Pink', className: 'bg-pink-300' },
  { value: '#fdba74', name: 'Orange', className: 'bg-orange-300' },
  { value: '#67e8f9', name: 'Cyan', className: 'bg-cyan-300' },
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
