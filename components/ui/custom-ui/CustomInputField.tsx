"use client";

import {
  ElementType,
  ReactNode,
  forwardRef,
  ForwardedRef,
} from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn.util";
import { useId } from "@/hooks/useId";
import { InputErrorMsg } from "@/hooks/inputErrorMsg";
import { PolymorphicComponentProps, PolymorphicRef } from "@/hooks/polymorphic";

export type InputOwnProps<T extends ElementType = "input"> = {
  component?: T;
  label?: ReactNode;
  required?: boolean;
  prefix?: ReactNode;
  suffix?: ReactNode;
  icon?: LucideIcon;
  description?: string;
  className?: string;
  placeholder?: string;
  containerClassName?: string;
  classNames?: {
    root?: string;
    label?: string;
    labelText?: string;
    wrapper?: string;
    input?: string;
    prefix?: string;
    suffix?: string;
    error?: string;
    description?: string;
  };
  error?: boolean | ReactNode;
  unstyled?: boolean;
  disabled?: boolean;
  type?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rootProps?: Record<string, any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  labelProps?: Record<string, any>;
  id?: string;
};

export type InputProps<E extends ElementType = "input"> =
  PolymorphicComponentProps<E, InputOwnProps<E>>;

const InputInner = forwardRef(
  <T extends ElementType = "input">(
    props: InputProps<T>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: ForwardedRef<any>,
  ) => {
    const {
      component,
      label,
      required,
      prefix,
      suffix,
      icon: Icon,
      description,
      className,
      containerClassName,
      classNames = {},
      error,
      unstyled,
      disabled,
      type = "text",
      rootProps,
      labelProps,
      id,
      ...rest
    } = props;

    const Component: ElementType = component || "input";
    const inputId = useId(id, "input");
    const errorId = `${inputId}-error`;
    const hasError = Boolean(error);
    const showErrorMessage = hasError && typeof error !== "boolean";
    const startAffix = prefix ?? (Icon ? <Icon size={18} strokeWidth={2} /> : null);
    const hasStartAffix = Boolean(startAffix);
    const hasEndAffix = Boolean(suffix);

    return (
      <div
        className={cn(
          "flex flex-col justify-between w-full space-y-1.5",
          containerClassName,
          classNames.root,
        )}
        {...rootProps}
      >
        {label ? (
          <label
            htmlFor={inputId}
            className={cn(
              "block text-sm font-medium text-foreground/90 transition-colors",
              disabled && "cursor-not-allowed opacity-50",
              classNames.label,
            )}
            {...labelProps}
          >
            <span className={cn(classNames.labelText)}>
              {label}
              {required ? (
                <span className="ml-1 font-bold text-destructive" aria-hidden="true">
                  *
                </span>
              ) : null}
            </span>
          </label>
        ) : null}

        <div
          className={cn(
            "group relative flex items-center mt-auto",
            classNames.wrapper,
          )}
        >
          {startAffix ? (
            <div
              className={cn(
                "pointer-events-none absolute left-3 z-10 flex items-center justify-center text-muted-foreground transition-colors group-focus-within:text-primary",
                hasError && "text-destructive group-focus-within:text-destructive",
                classNames.prefix,
              )}
            >
              {startAffix}
            </div>
          ) : null}

          <Component
            className={cn(
              !unstyled && [
                "flex h-10 w-full rounded-md border px-3 py-2 text-sm transition-all",
                "bg-field text-foreground",
                "border-input placeholder:text-muted-foreground/60",
                "focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:outline-none",
                hasError &&
                  "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/30",
                "disabled:cursor-not-allowed disabled:bg-muted/30 disabled:opacity-50",
              ],
              hasStartAffix && "pl-10",
              hasEndAffix && "pr-10",
              className,
              classNames.input,
            )}
            type={type}
            id={inputId}
            ref={ref}
            disabled={disabled}
            required={required}
            aria-invalid={hasError || undefined}
            aria-describedby={showErrorMessage ? errorId : undefined}
            {...rest}
          />

          {suffix ? (
            <div
              className={cn(
                "pointer-events-none absolute right-3 z-10 flex items-center justify-center text-muted-foreground transition-colors group-focus-within:text-primary",
                hasError && "text-destructive group-focus-within:text-destructive",
                classNames.suffix,
              )}
            >
              {suffix}
            </div>
          ) : null}
        </div>

        <InputErrorMsg
          id={errorId}
          when={showErrorMessage}
          className={cn(
            "animate-in fade-in slide-in-from-top-1",
            classNames.error,
          )}
        >
          {error}
        </InputErrorMsg>

        {description ? (
          <span
            className={cn(
              "block text-xs text-muted-foreground",
              classNames.description,
            )}
          >
            {description}
          </span>
        ) : null}
      </div>
    );
  },
);

InputInner.displayName = "Input";

type InputComponent = <E extends ElementType = "input">(
  props: InputProps<E> & {
    ref?: PolymorphicRef<E>;
  },
) => ReactNode;

const Input = InputInner as InputComponent;
const InputField = Input;

export { Input, InputField };
