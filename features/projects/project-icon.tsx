import {
  CalendarDaysIcon,
  CarIcon,
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

const icons = new Map([
  ['home', HomeIcon],
  ['heart', HeartIcon],
  ['graduation-cap', GraduationCapIcon],
  ['car', CarIcon],
  ['plane', PlaneIcon],
  ['utensils', UtensilsIcon],
  ['music', MusicIcon],
  ['calendar-days', CalendarDaysIcon],
  ['zap', ZapIcon],
  ['shopping-cart', ShoppingCartIcon],
  ['piggy-bank', PiggyBankIcon],
  ['gift', GiftIcon],
]);

export function ProjectIcon({
  iconName,
  color,
}: {
  iconName: string;
  color: string;
}) {
  const Icon = icons.get(iconName);

  if (!Icon) {
    return null;
  }

  return (
    <div className="relative size-9 rounded-xl">
      <div
        className="opacity-30 size-full rounded-xl"
        style={{ backgroundColor: color }}
      ></div>
      <Icon
        size={16}
        color={color}
        className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2"
      />
    </div>
  );
}
