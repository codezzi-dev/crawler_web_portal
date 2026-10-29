"use client";

import * as React from "react";
import { ChevronDown, Search, Check, X } from "lucide-react";
import { Popover as PopoverPrimitive } from "@base-ui/react/popover";
import { cn } from "@/lib/cn.util";

export interface SearchableOption {
  label: string;
  value: string;
  disabled?: boolean;
}

export interface SearchableSelectProps {
  options: SearchableOption[];
  value?: string;
  onChange: (value: string) => void;
  label?: string;
  error?: string;
  placeholder?: string;
  searchPlaceholder?: string;
  required?: boolean;
  disabled?: boolean;
  containerClassName?: string;
  className?: string;
  id?: string;
}

export function SearchableSelect({
  options,
  value,
  onChange,
  label,
  error,
  placeholder = "Select an option...",
  searchPlaceholder = "Search options...",
  required,
  disabled,
  containerClassName,
  className,
  id,
}: SearchableSelectProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");
  const searchInputRef = React.useRef<HTMLInputElement>(null);

  const generatedId = React.useId();
  const selectId = id || generatedId;
  const listboxId = `${selectId}-listbox`;

  // Filter options based on search query
  const filteredOptions = React.useMemo(() => {
    if (!searchTerm.trim()) return options;
    return options.filter((opt) =>
      opt.label.toLowerCase().includes(searchTerm.toLowerCase().trim()),
    );
  }, [options, searchTerm]);

  // Currently selected option object
  const selectedOption = React.useMemo(
    () => options.find((opt) => opt.value === value),
    [options, value],
  );

  // Auto-focus search input when opened
  React.useEffect(() => {
    if (isOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    } else {
      setSearchTerm("");
    }
  }, [isOpen]);

  const handleSelect = (val: string, isDisabled?: boolean) => {
    if (isDisabled || disabled) return;
    onChange(val);
    setIsOpen(false);
    setSearchTerm("");
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (disabled) return;
    onChange("");
  };

  return (
    <div
      className={cn(
        "relative flex flex-col justify-between w-full space-y-1.5",
        containerClassName,
      )}
    >
      {/* Label Section */}
      {label && (
        <label
          htmlFor={selectId}
          className={cn(
            "block text-sm font-medium text-foreground/90 transition-colors",
            disabled && "opacity-50 cursor-not-allowed",
          )}
        >
          {label}
          {required && (
            <span className="ml-1 text-destructive font-bold" aria-hidden="true">
              *
            </span>
          )}
        </label>
      )}

      {/* Popover Root with Portal */}
      <PopoverPrimitive.Root open={isOpen} onOpenChange={setIsOpen}>
        <PopoverPrimitive.Trigger
          id={selectId}
          disabled={disabled}
          className={cn(
            "flex h-10 w-full items-center justify-between rounded-md border px-3 py-2 text-sm transition-all cursor-pointer mt-auto outline-none select-none",
            "bg-field text-foreground",
            "border-input hover:border-primary/50",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:border-primary",
            error &&
              "border-destructive focus-visible:ring-destructive/30 focus-visible:border-destructive hover:border-destructive",
            disabled && "cursor-not-allowed opacity-50 bg-muted/30 hover:border-input",
            className,
          )}
        >
          <span
            className={cn(
              "truncate text-left flex-1",
              !selectedOption && "text-muted-foreground/60",
            )}
          >
            {selectedOption ? selectedOption.label : placeholder}
          </span>

          <div className="flex items-center gap-1.5 text-muted-foreground shrink-0 ml-2">
            {selectedOption && !disabled && (
              <button
                type="button"
                onClick={handleClear}
                className="p-0.5 rounded-sm hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                aria-label="Clear selection"
              >
                <X size={14} />
              </button>
            )}

            <ChevronDown
              size={18}
              className={cn(
                "transition-transform duration-200",
                isOpen && "rotate-180 text-primary",
              )}
            />
          </div>
        </PopoverPrimitive.Trigger>

        <PopoverPrimitive.Portal>
          <PopoverPrimitive.Positioner
            side="bottom"
            align="start"
            sideOffset={4}
            className="isolate z-[999] outline-none"
          >
            <PopoverPrimitive.Popup
              className={cn(
                "z-[999] w-(--anchor-width) min-w-48 max-w-sm rounded-md border border-border bg-popover text-popover-foreground shadow-xl overflow-hidden",
                "animate-in fade-in-0 zoom-in-95 duration-100",
              )}
            >
              {/* Search Input Header */}
              <div className="flex items-center border-b border-border px-3 py-2 bg-muted/20">
                <Search size={16} className="text-muted-foreground shrink-0 mr-2" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={searchPlaceholder}
                  className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => setSearchTerm("")}
                    className="text-muted-foreground hover:text-foreground text-xs cursor-pointer ml-1"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Options List */}
              <ul
                id={listboxId}
                role="listbox"
                className="max-h-60 overflow-y-auto p-1 space-y-0.5"
              >
                {filteredOptions.length === 0 ? (
                  <li className="px-3 py-2.5 text-xs text-muted-foreground text-center">
                    No matching options found.
                  </li>
                ) : (
                  filteredOptions.map((opt) => {
                    const isSelected = opt.value === value;
                    return (
                      <li
                        key={opt.value}
                        role="option"
                        aria-selected={isSelected}
                        aria-disabled={opt.disabled}
                        onClick={() => handleSelect(opt.value, opt.disabled)}
                        className={cn(
                          "flex items-center justify-between rounded-sm px-3 py-2 text-sm transition-colors cursor-pointer select-none",
                          isSelected
                            ? "bg-primary/10 text-primary font-medium"
                            : "text-foreground hover:bg-accent hover:text-accent-foreground",
                          opt.disabled &&
                            "opacity-50 cursor-not-allowed hover:bg-transparent text-muted-foreground",
                        )}
                      >
                        <span className="truncate">{opt.label}</span>
                        {isSelected && (
                          <Check size={16} className="text-primary shrink-0 ml-2" />
                        )}
                      </li>
                    );
                  })
                )}
              </ul>
            </PopoverPrimitive.Popup>
          </PopoverPrimitive.Positioner>
        </PopoverPrimitive.Portal>
      </PopoverPrimitive.Root>

      {/* Error Message */}
      {error && (
        <p
          id={`${selectId}-error`}
          className="text-xs font-medium text-destructive mt-1 animate-in fade-in"
        >
          {error}
        </p>
      )}
    </div>
  );
}

export default SearchableSelect;
