import { formatCurrency } from '../../lib/utils';

interface PriceDisplayProps {
  price: number;
  originalPrice?: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function PriceDisplay({ price, originalPrice, size = 'md', className = '' }: PriceDisplayProps) {
  const hasDiscount = originalPrice && originalPrice > price;
  
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-2xl',
  };
  
  const discountPercentage = hasDiscount 
    ? Math.round(((originalPrice - price) / originalPrice) * 100) 
    : 0;
  
  return (
    <div className={`flex items-center ${className}`}>
      <span className={`font-semibold ${sizeClasses[size]}`}>
        {formatCurrency(price)}
      </span>
      
      {hasDiscount && (
        <>
          <span className={`line-through text-gray-500 ml-2 ${size === 'sm' ? 'text-xs' : 'text-sm'}`}>
            {formatCurrency(originalPrice)}
          </span>
          <span className={`text-red-600 ml-2 ${size === 'sm' ? 'text-xs' : 'text-sm'}`}>
            Save {discountPercentage}%
          </span>
        </>
      )}
    </div>
  );
}