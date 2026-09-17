"use client";

import React, { useCallback, useRef } from "react";
import Link, { LinkProps } from "next/link";
import { useRouter } from "next/navigation";

interface PrefetchLinkProps extends LinkProps {
  children: React.ReactNode;
  className?: string;
  onPrefetchData?: () => void;
  target?: string;
  rel?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

export function PrefetchLink({
  children,
  href,
  className = "",
  onPrefetchData,
  onClick,
  ...props
}: PrefetchLinkProps) {
  const router = useRouter();
  const prefetchedRef = useRef(false);

  const handlePrefetch = useCallback(() => {
    if (prefetchedRef.current) return;
    prefetchedRef.current = true;

    // Prefetch Next.js route JS & RSC payload
    if (typeof href === "string") {
      router.prefetch(href);
    }

    // Call custom data prefetch handler (e.g. API payload caching)
    if (onPrefetchData) {
      onPrefetchData();
    }
  }, [href, router, onPrefetchData]);

  return (
    <Link
      href={href}
      className={className}
      onMouseEnter={handlePrefetch}
      onTouchStart={handlePrefetch}
      onFocus={handlePrefetch}
      onClick={onClick}
      {...props}
    >
      {children}
    </Link>
  );
}
