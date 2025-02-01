import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import React from 'react';

const cardVariants = cva('flex items-center', {
  variants: {
    variant: {
      'dark-gray': 'bg-dark-gray',
      'light-gray': 'bg-light-gray',
      purple: 'bg-purple',
      dark: 'bg-dark',
    },
    radius: {
      20: 'rounded-[20px]',
      8: 'rounded-[8px]',
    },
  },
});

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, radius, ...props }, ref) => {
    return (
      <div
        className={cn(cardVariants({ variant, radius, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);

Card.displayName = 'Card';

export { Card, cardVariants };
