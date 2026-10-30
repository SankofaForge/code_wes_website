'use client';
import { useSyncExternalStore } from 'react';

const subscribe = () => () => {};
const path = () => location.pathname.replace(/^\/|\/$/g, '') || 'main';

// The path that was asked for. The static export renders a placeholder; the browser fills it in.
export function MissingRef() {
  return <>{useSyncExternalStore(subscribe, path, () => 'that-page')}</>;
}
