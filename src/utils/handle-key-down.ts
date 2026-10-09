import type { KeyboardEvent } from "react";

interface HandleSearchKeyDownOptions<T> {
  event: KeyboardEvent<HTMLInputElement>;
  open: boolean;
  options: T[];
  highlight: number;
  setOpen: (open: boolean) => void;
  setHighlight: (updater: (previous: number) => number) => void;
  onSelect: (option: T) => void;
  onEscape?: () => void;
}

export function handleSearchKeyDown<T>({
  event,
  open,
  options,
  highlight,
  setOpen,
  setHighlight,
  onSelect,
  onEscape,
}: HandleSearchKeyDownOptions<T>) {
  switch (event.key) {
    case "ArrowDown": {
      event.preventDefault();
      event.stopPropagation();

      if (!open) {
        setOpen(true);
        setHighlight(() => 0);
        return;
      }

      if (options.length > 0) {
        setHighlight(previous => (previous + 1) % options.length);
      }
      return;
    }

    case "ArrowUp": {
      if (!open || options.length === 0) return;

      event.preventDefault();
      event.stopPropagation();

      setHighlight(previous => (previous - 1 + options.length) % options.length);
      return;
    }

    case "Enter": {
      event.preventDefault();
      event.stopPropagation();

      if (open && options[highlight] !== undefined) {
        onSelect(options[highlight]);
      }
      return;
    }

    case "Escape": {
      if (!open) return;

      event.preventDefault();
      event.stopPropagation();

      if (onEscape) {
        onEscape();
      } else {
        setOpen(false);
      }
      return;
    }
  }
}
