import React from 'react';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/utils';

interface PriceDisplayProps {
  price: number;
  originalPrice?: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function PriceDisplay({
  price,
  originalPrice,
  size = 'md',
  className,
}: PriceDisplayProps) {
  const hasDiscount = originalPrice && originalPrice > price;
  const discountPercentage = hasDiscount
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-2xl',
  };

  return (
    <div className={cn('flex items-center', className)}>
      <span className={cn('font-semibold text-gray-900', sizeClasses[size])}>
        {formatCurrency(price)}
      </span>
      
      {hasDiscount && (
        <>
          <span className={cn('ml-2 text-gray-500 line-through', 
            size === 'sm' ? 'text-xs' : 
            size === 'md' ? 'text-sm' : 
            size === 'lg' ? 'text-base' :
            'text-lg'
          )}>
            {formatCurrency(originalPrice)}
          </span>
          
          <span className={cn('ml-2 text-red-600 font-medium', 
            size === 'sm' ? 'text-xs' : 
            size === 'md' ? 'text-sm' : 
            size === 'lg' ? 'text-base' :
            'text-lg'
          )}>
            ({discountPercentage}% off)
          </span>
        </>
      )}
    </div>
  );
}