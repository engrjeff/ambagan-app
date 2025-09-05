'use client';

import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  CalendarDaysIcon,
  CarIcon,
  ChevronDownIcon,
  GiftIcon,
  GraduationCapIcon,
  HeartIcon,
  HomeIcon,
  MusicIcon,
  PiggyBankIcon,
  PlaneIcon,
  ShoppingCartIcon,
  UtensilsIcon,
  ZapIcon,
} from 'lucide-react';
import { useState } from 'react';

const icons = [
  { value: 'home', name: 'Home', icon: HomeIcon },
  { value: 'heart', name: 'Health', icon: HeartIcon },
  { value: 'graduation-cap', name: 'Education', icon: GraduationCapIcon },
  { value: 'car', name: 'Transportation', icon: CarIcon },
  { value: 'plane', name: 'Travel', icon: PlaneIcon },
  { value: 'utensils', name: 'Food', icon: UtensilsIcon },
  { value: 'music', name: 'Music', icon: MusicIcon },
  { value: 'calendar-days', name: 'Event', icon: CalendarDaysIcon },
  { value: 'zap', name: 'Utilities', icon: ZapIcon },
  { value: 'shopping-cart', name: 'Shopping', icon: ShoppingCartIcon },
  { value: 'piggy-bank', name: 'Savings', icon: PiggyBankIcon },
  { value: 'gift', name: 'Gift', icon: GiftIcon },
];

interface IconInputProps {
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function IconInput({
  value,
  onValueChange,
  placeholder = 'Select an icon',
  className,
}: IconInputProps) {
  const [open, setOpen] = useState(false);
  const selectedIcon = icons.find((icon) => icon.value === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={`justify-start ${className}`}
        >
          {selectedIcon ? (
            <div className="flex items-center gap-2">
              <selectedIcon.icon className="h-4 w-4" />
              {selectedIcon.name}
            </div>
          ) : (
            placeholder
          )}

          <ChevronDownIcon className="ml-auto" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-2">
        <div className="grid grid-cols-3 gap-2">
          {icons.map((icon) => {
            const IconComponent = icon.icon;
            return (
              <Button
                key={icon.value}
                variant={value === icon.value ? 'default' : 'ghost'}
                size="icon"
                onClick={() => {
                  onValueChange?.(icon.value);
                  setOpen(false);
                }}
              >
                <IconComponent />
              </Button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}
