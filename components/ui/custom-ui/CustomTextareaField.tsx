"use client";

import {
  ElementType,
  ReactNode,
  HTMLAttributes,
  ForwardedRef,
  forwardRef,
} from "react";
import { cn } from "@/lib/cn.util";
import { PolymorphicComponentProps, PolymorphicRef } from "@/hooks/polymorphic";
import { useId } from "@/hooks/useId";
import { InputErrorMsg } from "@/hooks/inputErrorMsg";

type TextareaOwnProps<T extends ElementType = "textarea"> = {
  component?: T;
  label?: ReactNode;
  required?: boolean;
  description?: ReactNode;
  containerClassName?: string;
  classNames?: {
    root?: string;
    label?: string;
    labelText?: string;
    wrapper?: string;
    input?: string;
    error?: string;
    description?: string;
  };
  disabled?: boolean;
  error?: boolean | ReactNode;
  unstyled?: boolean;
  rootProps?: HTMLAttributes<HTMLDivElement>;
  labelProps?: HTMLAttributes<HTMLLabelElement>;
  id?: string;
  className?: string;
  rows?: number;
};

export type TextareaProps<E extends ElementType = "textarea"> =
  PolymorphicComponentProps<E, TextareaOwnProps<E>>;

const TextareaInner = forwardRef(
  <C extends ElementType = "textarea">(
    props: TextareaProps<C>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: ForwardedRef<any>,
  ) => {
    const {
      component,
      label,
      required,
      description,
      className,
      containerClassName,
      classNames = {},
      error,
      unstyled,
      rootProps,
      labelProps,
      id,
      disabled,
      rows = 4,
      ...rest
    } = props;

    const Component: ElementType = component || "textarea";
    const inputId = useId(id, "textarea");
    const errorId = `${inputId}-error`;
    const hasError = Boolean(error);
    const showErrorMessage = hasError && typeof error !== "boolean";

    return (
      <div
        className={cn("w-full space-y-1.5", containerClassName, classNames.root)}
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

        <div className={cn("relative", classNames.wrapper)}>
          <Component
            ref={ref}
            id={inputId}
            disabled={disabled}
            required={required}
            rows={rows}
            aria-invalid={hasError || undefined}
            aria-describedby={showErrorMessage ? errorId : undefined}
            className={cn(
              !unstyled && [
                "flex min-h-20 w-full resize-y rounded-md border px-3 py-2 text-sm transition-all",
                "bg-field text-foreground",
                "border-input placeholder:text-muted-foreground/60",
                "focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:outline-none",
                hasError &&
                  "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/30",
                "disabled:cursor-not-allowed disabled:bg-muted/30 disabled:opacity-50",
              ],
              className,
              classNames.input,
            )}
            {...rest}
          />
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

TextareaInner.displayName = "Textarea";

type TextareaComponent = (<E extends ElementType = "textarea">(
  props: TextareaProps<E> & { ref?: PolymorphicRef<E> },
) => ReactNode) & { displayName?: string };

const Textarea = TextareaInner as TextareaComponent;
const CustomTextarea = Textarea;
CustomTextarea.displayName = "Textarea";

export { Textarea, CustomTextarea };
