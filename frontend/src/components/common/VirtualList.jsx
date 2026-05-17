import { useMemo, useState } from "react";

export function VirtualList({ items, rowHeight = 72, height = 420, renderItem }) {
  const [scrollTop, setScrollTop] = useState(0);
  const totalHeight = items.length * rowHeight;
  const startIndex = Math.max(0, Math.floor(scrollTop / rowHeight) - 4);
  const visibleCount = Math.ceil(height / rowHeight) + 8;
  const visibleItems = useMemo(
    () => items.slice(startIndex, startIndex + visibleCount),
    [items, startIndex, visibleCount],
  );

  return (
    <div
      className="scrollbar-premium overflow-auto"
      style={{ height }}
      onScroll={(event) => setScrollTop(event.currentTarget.scrollTop)}
    >
      <div className="relative" style={{ height: totalHeight }}>
        {visibleItems.map((item, index) => (
          <div
            key={item.id}
            className="absolute left-0 right-0"
            style={{ top: (startIndex + index) * rowHeight, height: rowHeight }}
          >
            {renderItem(item, startIndex + index)}
          </div>
        ))}
      </div>
    </div>
  );
}
