import React from 'react';
import { clsx } from 'clsx';

interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full';
}

const Skeleton: React.FC<SkeletonProps> = ({ 
  className, 
  width, 
  height, 
  rounded = 'md' 
}) => {
  const roundedClasses = {
    none: '',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    full: 'rounded-full'
  };

  return (
    <div
      className={clsx(
        'animate-pulse bg-muted',
        roundedClasses[rounded],
        className
      )}
      style={{
        width: width,
        height: height
      }}
    />
  );
};

// Predefined skeleton components for common use cases
export const SkeletonText: React.FC<{ lines?: number; className?: string }> = ({ 
  lines = 1, 
  className 
}) => (
  <div className={clsx('space-y-2', className)}>
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton
        key={i}
        height="1rem"
        className={clsx(
          i === lines - 1 ? 'w-3/4' : 'w-full',
          'h-4'
        )}
      />
    ))}
  </div>
);

export const SkeletonCard: React.FC<{ className?: string }> = ({ className }) => (
  <div className={clsx('p-4 space-y-3', className)}>
    <div className="flex items-center space-x-3">
      <Skeleton width={40} height={40} rounded="full" />
      <div className="space-y-2 flex-1">
        <Skeleton height="1rem" className="w-3/4" />
        <Skeleton height="0.75rem" className="w-1/2" />
      </div>
    </div>
    <SkeletonText lines={2} />
  </div>
);

export const SkeletonList: React.FC<{ 
  items?: number; 
  className?: string;
  itemClassName?: string;
}> = ({ 
  items = 3, 
  className,
  itemClassName 
}) => (
  <div className={clsx('space-y-4', className)}>
    {Array.from({ length: items }).map((_, i) => (
      <SkeletonCard key={i} className={itemClassName} />
    ))}
  </div>
);

export const SkeletonGrid: React.FC<{ 
  items?: number; 
  columns?: number;
  className?: string;
  itemClassName?: string;
}> = ({ 
  items = 6, 
  columns = 3,
  className,
  itemClassName 
}) => (
  <div 
    className={clsx(
      'grid gap-4',
      className
    )}
    style={{
      gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`
    }}
  >
    {Array.from({ length: items }).map((_, i) => (
      <SkeletonCard key={i} className={itemClassName} />
    ))}
  </div>
);

export const SkeletonAvatar: React.FC<{ 
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}> = ({ 
  size = 'md',
  className 
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20'
  };

  return (
    <Skeleton 
      className={clsx(sizeClasses[size], 'rounded-full', className)} 
    />
  );
};

export const SkeletonButton: React.FC<{ 
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}> = ({ 
  size = 'md',
  className 
}) => {
  const sizeClasses = {
    sm: 'h-8 w-20',
    md: 'h-10 w-24',
    lg: 'h-12 w-32'
  };

  return (
    <Skeleton 
      className={clsx(sizeClasses[size], 'rounded-lg', className)} 
    />
  );
};

export const SkeletonImage: React.FC<{ 
  aspectRatio?: 'square' | 'video' | 'wide';
  className?: string;
}> = ({ 
  aspectRatio = 'square',
  className 
}) => {
  const aspectClasses = {
    square: 'aspect-square',
    video: 'aspect-video',
    wide: 'aspect-[16/9]'
  };

  return (
    <Skeleton 
      className={clsx(aspectClasses[aspectRatio], 'rounded-lg', className)} 
    />
  );
};

/** Shaped like ProjectCard/BlogCard: cover image, meta row, title, two text
 *  lines, one button. Use in a grid while the real list is loading so
 *  nothing jumps when it arrives. */
export const SkeletonProjectCard: React.FC<{ className?: string }> = ({ className }) => (
  <div className={clsx('rounded-lg border border-border overflow-hidden bg-card', className)}>
    <Skeleton className="aspect-video w-full" rounded="none" />
    <div className="p-4 space-y-3">
      <div className="flex items-center gap-2">
        <Skeleton height="1.25rem" width="4.5rem" rounded="full" />
        <Skeleton height="1.25rem" width="4.5rem" rounded="full" />
      </div>
      <Skeleton height="1.25rem" className="w-3/4" />
      <SkeletonText lines={2} />
      <Skeleton height="2.5rem" className="w-full mt-2" rounded="md" />
    </div>
  </div>
)

export const SkeletonBlogCard: React.FC<{ className?: string }> = ({ className }) => (
  <div className={clsx('rounded-lg border border-border overflow-hidden bg-card', className)}>
    <Skeleton className="aspect-video w-full" rounded="none" />
    <div className="p-4 space-y-3">
      <Skeleton height="0.875rem" width="6rem" />
      <Skeleton height="1.25rem" className="w-3/4" />
      <SkeletonText lines={2} />
    </div>
  </div>
)

/** Shaped like ListCard: leading avatar/logo, title + meta line, trailing actions. */
export const SkeletonListRow: React.FC<{ className?: string }> = ({ className }) => (
  <div className={clsx('flex items-center justify-between gap-4 p-4 border-b border-border', className)}>
    <div className="flex items-center gap-4 min-w-0">
      <SkeletonAvatar size="md" />
      <div className="space-y-2 min-w-0">
        <Skeleton height="1rem" width="10rem" />
        <Skeleton height="0.75rem" width="6rem" />
      </div>
    </div>
    <div className="flex items-center gap-2 shrink-0">
      <SkeletonButton size="sm" className="w-9" />
      <SkeletonButton size="sm" className="w-9" />
    </div>
  </div>
)

/** Shaped like a split hero: eyebrow, two headline lines, body line, two
 *  CTAs on one side; a large asset block on the other. */
export const SkeletonHero: React.FC<{ className?: string }> = ({ className }) => (
  <div className={clsx('flex items-center justify-between gap-10 max-md:flex-col', className)}>
    <div className="flex-1 w-full space-y-4">
      <Skeleton height="0.75rem" width="5rem" />
      <Skeleton height="3rem" className="w-4/5" />
      <Skeleton height="3rem" className="w-3/5" />
      <SkeletonText lines={2} className="max-w-md pt-2" />
      <div className="flex items-center gap-4 pt-2">
        <SkeletonButton size="lg" className="w-36" />
        <SkeletonButton size="lg" className="w-36" />
      </div>
    </div>
    <Skeleton className="flex-1 w-full aspect-4/3 max-md:aspect-video" />
  </div>
)

/** Drop-in replacement for the admin list pages' loading state: shaped like
 *  ListSection + a handful of ListCard rows, so the page title/search/add
 *  button (rendered by the caller, outside this) never disappear on load. */
export const AdminListSkeleton: React.FC<{ rows?: number; grid?: boolean; className?: string }> = ({
  rows = 5,
  grid = false,
  className,
}) => (
  <div className={clsx('bg-background rounded-lg p-4 mt-5 border border-border', className)}>
    <div className="flex items-center gap-4 mb-5">
      <Skeleton className="h-10 w-10 shrink-0" rounded="lg" />
      <div className="space-y-2">
        <Skeleton height="1.25rem" width="10rem" />
        <Skeleton height="0.875rem" width="7rem" />
      </div>
    </div>
    <div className={grid ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'divide-y divide-border'}>
      {Array.from({ length: rows }).map((_, i) => (
        <SkeletonListRow key={i} className={grid ? 'rounded-lg border border-border' : 'border-b-0'} />
      ))}
    </div>
  </div>
)

/** Shaped like a Timeline/TimelineItem row: dot + connecting line, then a
 *  card of content beside it. Used for Experience/Education while loading. */
export const SkeletonTimelineItem: React.FC<{ className?: string; isLast?: boolean }> = ({ className, isLast = false }) => (
  <div className={clsx('relative flex gap-6', !isLast && 'pb-10', className)}>
    <div className="flex flex-col items-center shrink-0 pt-1.5">
      <Skeleton className="h-3 w-3 shrink-0" rounded="full" />
      {!isLast && <span className="w-px flex-1 bg-border mt-2" />}
    </div>
    <div className="flex-1 min-w-0 p-8 max-sm:p-5 border border-border rounded-lg space-y-3">
      <div className="flex items-start gap-4">
        <Skeleton className="h-14 w-14 shrink-0" rounded="md" />
        <div className="w-full space-y-2">
          <Skeleton height="1.25rem" width="10rem" />
          <Skeleton height="0.875rem" width="8rem" />
          <Skeleton height="0.75rem" width="6rem" />
        </div>
      </div>
    </div>
  </div>
)

export default Skeleton; 