import React, { FC, ReactNode } from 'react';

// Define the props for the ScrollArea component
interface ScrollAreaProps {
  children: ReactNode;
  className?: string;
}

const ScrollArea: FC<ScrollAreaProps> = ({ children, className }) => {
  return (
    <div
      className={`relative h-full w-full overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700`}
    >
      <div
        className={`h-full w-full overflow-y-auto p-4 ${className}`}
        style={{ scrollbarWidth: 'thin' }} // For Firefox
      >
        {children}
      </div>
    </div>
  );
};

export default ScrollArea;
