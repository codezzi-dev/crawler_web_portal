"use client";

import * as React from "react";
import { Check, ChevronDown, type LucideIcon } from "lucide-react";
import { Select as SelectPrimitive } from "@base-ui/react/select";
import { cn } from "@/lib/cn.util";
import { InputErrorMsg } from "@/hooks/inputErrorMsg";

export interface SelectOption {
  label: string;
  value: string | number;
  disabled?: boolean;
}

export interface SelectProps {
  options: SelectOption[];
  label?: React.ReactNode;
  error?: boolean | React.ReactNode;
  placeholder?: string;
  description?: React.ReactNode;
  icon?: LucideIcon;
  containerClassName?: string;
  className?: string;
  value?: string | number;
  defaultValue?: string | number;
  disabled?: boolean;
  required?: boolean;
  id?: string;
  name?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onValueChange?: (val: string) => void;
}

function toValueString(
  raw: string | number | readonly string[] | undefined,
): string {
  if (raw == null) return "";
  if (Array.isArray(raw)) return String(raw[0] ?? "");
  return String(raw);
}

const Select = React.forwardRef<HTMLButtonElement, SelectProps>(
  (
    {
      className,
      containerClassName,
      options,
      label,
      error,
      description,
      icon: Icon,
      placeholder = "Select an option",
      required,
      id,
      name,
      disabled,
      defaultValue = "",
      value,
      onChange,
      onValueChange: onValueChangeProp,
    },
    ref,
  ) => {
    const generatedId = React.useId();
    const selectId = id || generatedId;
    const errorId = `${selectId}-error`;
    const hasError = Boolean(error);
    const showErrorMessage = hasError && typeof error !== "boolean";

    const isControlled = value !== undefined;
    const [internalValue, setInternalValue] = React.useState(() =>
      toValueString(value ?? defaultValue),
    );

    React.useEffect(() => {
      if (isControlled) {
        setInternalValue(toValueString(value));
      }
    }, [isControlled, value]);

    const currentValue = isControlled ? toValueString(value) : internalValue;

    const handleValueChange = (nextValue: string | null) => {
      const stringVal = nextValue ?? "";
      if (!isControlled) {
        setInternalValue(stringVal);
      }
      onValueChangeProp?.(stringVal);
      if (onChange) {
        onChange({
          target: { value: stringVal, name: name || "" },
        } as unknown as React.ChangeEvent<HTMLSelectElement>);
      }
    };

    return (
      <div
        className={cn(
          "relative flex flex-col justify-between w-full space-y-1.5",
          containerClassName,
        )}
      >
        {label ? (
          <label
            htmlFor={selectId}
            className={cn(
              "block text-sm font-medium text-foreground/90 transition-colors",
              disabled && "cursor-not-allowed opacity-50",
            )}
          >
            {label}
            {required ? (
              <span className="ml-1 font-bold text-destructive" aria-hidden="true">
                *
              </span>
            ) : null}
          </label>
        ) : null}

        <SelectPrimitive.Root
          value={currentValue ? currentValue : undefined}
          defaultValue={toValueString(defaultValue) ? toValueString(defaultValue) : undefined}
          onValueChange={handleValueChange}
          disabled={disabled}
          required={required}
          name={name}
        >
          <SelectPrimitive.Trigger
            ref={ref}
            id={selectId}
            className={cn(
              "group relative flex h-10 w-full cursor-pointer items-center justify-between rounded-md border px-3 py-2 text-sm transition-all select-none mt-auto outline-none",
              "border-input bg-field text-foreground hover:border-primary/50",
              "focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:outline-none",
              hasError &&
                "border-destructive hover:border-destructive focus-visible:border-destructive focus-visible:ring-destructive/30",
              disabled &&
                "cursor-not-allowed bg-muted/30 opacity-50 hover:border-input",
              Icon && "pl-10",
              className,
            )}
          >
            {Icon ? (
              <Icon
                size={18}
                strokeWidth={2}
                className="pointer-events-none absolute left-3 text-muted-foreground group-data-[popup-open]:text-primary"
              />
            ) : null}

            <SelectPrimitive.Value
              placeholder={placeholder}
              className="truncate text-left flex-1"
            >
              {(val: string | null) => {
                const opt = options.find((o) => String(o.value) === String(val));
                return opt ? opt.label : placeholder;
              }}
            </SelectPrimitive.Value>

            <SelectPrimitive.Icon className="shrink-0 text-muted-foreground transition-transform duration-200 group-data-[popup-open]:rotate-180 group-data-[popup-open]:text-primary">
              <ChevronDown size={18} />
            </SelectPrimitive.Icon>
          </SelectPrimitive.Trigger>

          <SelectPrimitive.Portal>
            <SelectPrimitive.Positioner
              side="bottom"
              align="start"
              sideOffset={4}
              alignItemWithTrigger={false}
              className="isolate z-[999] outline-none"
            >
              <SelectPrimitive.Popup
                className={cn(
                  "z-[999] max-h-60 min-w-(--anchor-width) w-max max-w-sm overflow-x-hidden overflow-y-auto rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-xl duration-100 outline-none",
                  "data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
                )}
              >
                <SelectPrimitive.List className="space-y-0.5">
                  {options.map((opt) => (
                    <SelectPrimitive.Item
                      key={opt.value}
                      value={String(opt.value)}
                      disabled={opt.disabled}
                      className={cn(
                        "group/item flex cursor-pointer items-center justify-between gap-3 rounded-sm px-3 py-2 text-sm outline-none transition-colors select-none",
                        "text-popover-foreground hover:bg-accent hover:text-accent-foreground data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground",
                        "data-[selected]:bg-primary/10 data-[selected]:text-primary data-[selected]:font-medium",
                        "data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50",
                      )}
                    >
                      <SelectPrimitive.ItemText className="truncate">
                        {opt.label}
                      </SelectPrimitive.ItemText>
                      <SelectPrimitive.ItemIndicator className="shrink-0 text-primary">
                        <Check size={16} />
                      </SelectPrimitive.ItemIndicator>
                    </SelectPrimitive.Item>
                  ))}
                </SelectPrimitive.List>
              </SelectPrimitive.Popup>
            </SelectPrimitive.Positioner>
          </SelectPrimitive.Portal>
        </SelectPrimitive.Root>

        <InputErrorMsg
          id={errorId}
          when={showErrorMessage}
          className="animate-in fade-in slide-in-from-top-1"
        >
          {error}
        </InputErrorMsg>

        {description ? (
          <span className="block text-xs text-muted-foreground">
            {description}
          </span>
        ) : null}
      </div>
    );
  },
);

Select.displayName = "Select";

const CustomSelect = Select;
export { Select, CustomSelect };
