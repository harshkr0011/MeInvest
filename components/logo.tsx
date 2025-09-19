import { Shapes } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/">
        <div
        className={cn(
            'group flex items-center gap-2 transition-opacity duration-200 group-data-[collapsible=icon]:w-8',
            className
        )}
        >
        <Shapes className="size-6 shrink-0 text-primary" />
        <h1 className="truncate text-lg font-semibold text-foreground group-data-[collapsible=icon]:hidden">
            Meinvest
        </h1>
        </div>
    </Link>
  );
}
