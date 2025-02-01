import { Loader2 } from 'lucide-react';

import { cn } from '@/lib/utils';

interface Props {
  screen?: boolean;
}

export const PageLoader = ({ screen }: Props) => {
  return (
    <div
      className={cn(
        'flex w-full flex-1 items-center justify-center',
        screen ? 'h-screen' : 'h-full',
      )}
    >
      <Loader2 className="h-10 w-10 animate-spin transition-all" />
    </div>
  );
};
