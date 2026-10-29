import type {
  ComponentPropsWithoutRef,
  ComponentPropsWithRef,
  ElementType,
} from "react";

export type PolymorphicRef<C extends ElementType> =
  ComponentPropsWithRef<C>["ref"];

export type PolymorphicComponentProps<
  C extends ElementType,
  Props = object,
> = Props &
  Omit<ComponentPropsWithoutRef<C>, keyof Props> & {
    component?: C;
  };
