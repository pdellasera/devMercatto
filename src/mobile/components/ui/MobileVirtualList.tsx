import React, { forwardRef, useMemo } from 'react';
import { cn } from '../../utils/cn';
import useMobileVirtualScroll from '../../hooks/useMobileVirtualScroll';

interface MobileVirtualListProps<T> {
  items: T[];
  itemHeight: number;
  containerHeight?: number;
  overscan?: number;
  threshold?: number;
  enableInfiniteScroll?: boolean;
  onLoadMore?: () => void;
  renderItem: (item: T, index: number, style: React.CSSProperties) => React.ReactNode;
  className?: string;
  containerClassName?: string;
  itemClassName?: string;
  showScrollIndicator?: boolean;
  onScroll?: (scrollTop: number) => void;
  onScrollEnd?: () => void;
}

const MobileVirtualList = <T,>(
  {
    items,
    itemHeight,
    containerHeight = 400,
    overscan = 5,
    threshold = 0.8,
    enableInfiniteScroll = false,
    onLoadMore,
    renderItem,
    className,
    containerClassName,
    itemClassName,
    showScrollIndicator = true,
    onScroll,
    onScrollEnd,
  }: MobileVirtualListProps<T>,
  ref: React.ForwardedRef<HTMLDivElement>
) => {
  const {
    virtualItems,
    totalHeight,
    containerRef,
    scrollToIndex,
    scrollToTop,
    isScrolling,
  } = useMobileVirtualScroll(items, {
    itemHeight,
    containerHeight,
    overscan,
    threshold,
    enableInfiniteScroll,
    onLoadMore,
  });

  // Memoizar el contenedor de scroll
  const scrollContainer = useMemo(() => (
    <div
      ref={containerRef}
      className={cn(
        'relative overflow-auto scrollbar-hide',
        containerClassName
      )}
      style={{ height: containerHeight }}
      onScroll={(e) => {
        const target = e.target as HTMLDivElement;
        const scrollTop = target.scrollTop;
        onScroll?.(scrollTop);
        
        // Detectar fin de scroll
        if (scrollTop + target.clientHeight >= target.scrollHeight - 10) {
          onScrollEnd?.();
        }
      }}
    >
      <div
        style={{ height: totalHeight }}
        className="relative"
      >
        {virtualItems.map(({ index, data, style, isVisible }) => (
          <div
            key={index}
            style={style}
            className={cn(
              'absolute left-0 right-0',
              itemClassName
            )}
          >
            {isVisible && renderItem(data, index, style)}
          </div>
        ))}
      </div>
    </div>
  ), [virtualItems, totalHeight, containerRef, containerClassName, itemClassName, renderItem, onScroll, onScrollEnd]);

  return (
    <div
      ref={ref}
      className={cn('relative', className)}
    >
      {scrollContainer}

      {/* Scroll indicator */}
      {showScrollIndicator && isScrolling && (
        <div className="absolute top-2 right-2 w-2 h-2 bg-primary-500 rounded-full animate-ping" />
      )}

      {/* Scroll to top button */}
      {showScrollIndicator && (
        <button
          onClick={scrollToTop}
          className="absolute bottom-4 right-4 w-10 h-10 bg-primary-600 hover:bg-primary-700 text-white rounded-full shadow-lg transition-all duration-200 opacity-0 hover:opacity-100"
          style={{
            opacity: isScrolling ? 1 : 0,
          }}
        >
          <svg className="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      )}
    </div>
  );
};

const MobileVirtualListWithRef = forwardRef(MobileVirtualList) as <T>(
  props: MobileVirtualListProps<T> & { ref?: React.ForwardedRef<HTMLDivElement> }
) => React.ReactElement;

MobileVirtualListWithRef.displayName = 'MobileVirtualList';

export default MobileVirtualListWithRef;
