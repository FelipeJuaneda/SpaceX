import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { Link, type LinkProps } from "react-router";
import { cn } from "@/lib/cn";
import s from "./Button.module.css";

type Variant = "ink" | "line" | "quiet";

interface Common {
  variant?: Variant;
  size?: "md" | "sm";
  icon?: ReactNode;
  iconEnd?: ReactNode;
}

function classes(variant: Variant, size: "md" | "sm", className?: string) {
  return cn(s.button, s[variant], size === "sm" && s.sm, className);
}

function Inner({
  icon,
  iconEnd,
  children,
}: {
  icon?: ReactNode;
  iconEnd?: ReactNode;
  children: ReactNode;
}) {
  return (
    <>
      {icon && <span className={s.icon}>{icon}</span>}
      <span>{children}</span>
      {iconEnd && <span className={s.icon}>{iconEnd}</span>}
    </>
  );
}

export function Button({
  variant = "line",
  size = "md",
  icon,
  iconEnd,
  className,
  children,
  type = "button",
  ...rest
}: Common & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button type={type} className={classes(variant, size, className)} {...rest}>
      <Inner icon={icon} iconEnd={iconEnd}>
        {children}
      </Inner>
    </button>
  );
}

export function ButtonLink({
  variant = "line",
  size = "md",
  icon,
  iconEnd,
  className,
  children,
  ...rest
}: Common & LinkProps) {
  return (
    <Link className={classes(variant, size, className)} {...rest}>
      <Inner icon={icon} iconEnd={iconEnd}>
        {children}
      </Inner>
    </Link>
  );
}

/** External destination: opens in a new tab and says so to assistive technology. */
export function ButtonAnchor({
  variant = "line",
  size = "md",
  icon,
  iconEnd,
  className,
  children,
  ...rest
}: Common & AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a className={classes(variant, size, className)} target="_blank" rel="noreferrer" {...rest}>
      <Inner icon={icon} iconEnd={iconEnd}>
        {children}
        <span className="visually-hidden"> (opens in a new tab)</span>
      </Inner>
    </a>
  );
}
