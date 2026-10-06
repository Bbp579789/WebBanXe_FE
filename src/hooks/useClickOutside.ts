import { useEffect, type RefObject } from 'react';

export const useClickOutside = <T extends HTMLElement = HTMLElement>(
  ref: RefObject<T | null>,
  handler: (event: MouseEvent) => void
) => {
  useEffect(() => {
    const listener = (event: MouseEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) return;
      handler(event);
    };
    document.addEventListener('click', listener);
    return () => document.removeEventListener('click', listener);
  }, [ref, handler]);
};