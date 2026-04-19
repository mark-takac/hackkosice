import { Fuel, MoreHorizontal, ShoppingCart, UtensilsCrossed, type LucideIcon } from 'lucide-react-native';

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  potraviny: ShoppingCart,
  palivo: Fuel,
  restauracie: UtensilsCrossed,
  ostatne: MoreHorizontal,
};

export function CategoryExpenseIcon({
  categoryKey,
  color,
  size = 18,
  strokeWidth = 2.2,
}: {
  categoryKey: string;
  color: string;
  size?: number;
  strokeWidth?: number;
}) {
  const Icon = CATEGORY_ICONS[categoryKey] ?? MoreHorizontal;
  return <Icon color={color} size={size} strokeWidth={strokeWidth} />;
}
