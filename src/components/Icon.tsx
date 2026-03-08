import React from 'react';
import * as LucideIcons from 'lucide-react';
import type { LucideProps } from 'lucide-react';
import { cn } from '../utils/cn';

// Mapping Material names to Lucide names for backward compatibility
const iconMap: Record<string, string> = {
    'sports_bar': 'Beer',
    'grid_view': 'LayoutGrid',
    'inventory_2': 'Package',
    'bar_chart': 'BarChart3',
    'admin_panel_settings': 'ShieldCheck',
    'search': 'Search',
    'light_mode': 'Sun',
    'dark_mode': 'Moon',
    'notifications': 'Bell',
    'person': 'User',
    'arrow_back': 'ArrowLeft',
    'table_bar': 'Armchair',
    'add': 'Plus',
    'receipt_long': 'FileText',
    'receipt': 'Receipt',
    'edit': 'Pencil',
    'delete': 'Trash2',
    'shopping_cart': 'ShoppingCart',
    'add_shopping_cart': 'ShoppingBag',
    'payments': 'CreditCard',
    'check_circle': 'CheckCircle2',
    'cloud_off': 'CloudOff',
    'close': 'X',
    'trending_up': 'TrendingUp',
    'group': 'Users',
    'print': 'Printer',
    'fastfood': 'Utensils',
    'chevron_left': 'ChevronLeft',
    'chevron_right': 'ChevronRight',
    'event': 'Calendar',
    'call_split': 'Split',
    'add_circle': 'PlusCircle',
    'login': 'LogIn',
    'logout': 'LogOut',
    'search_off': 'SearchX',
    'add_circle_outline': 'PlusCircle'
};

interface IconProps extends Omit<LucideProps, 'fill'> {
    name: string;
    fill?: boolean; // We keep it boolean for our app logic
}

export const Icon: React.FC<IconProps> = ({ name, className = "", fill = false, size = 20, ...props }) => {
    // Resolve Lucide component name
    const lucideName = iconMap[name] || name;

    // Get the component from LucideIcons
    // @ts-ignore - dynamic access
    const LucideIcon = LucideIcons[lucideName] || LucideIcons.HelpCircle;

    return (
        <LucideIcon
            size={size}
            className={cn(className)}
            {...(fill ? { fill: 'currentColor' } : {})}
            strokeWidth={fill ? 1.5 : 2}
            {...props}
        />
    );
};
