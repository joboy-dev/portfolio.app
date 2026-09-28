import React, { type ReactNode } from "react";
import Link from "next/link";
import clsx from "clsx";

type CardProps = {
  icon?: React.ReactNode;
  title?: string;
  backgroundColor?: string;
  description?: string;
  className?: string;
  /** When set, the whole card becomes a link and gets hover affordance
   *  (lift + shadow + an accent edge). Without it the card is static:
   *  no hover motion, since it isn't actually clickable. */
  linkTo?: string;
  children?: ReactNode
};

function Card({
  icon,
  title,
  description,
  backgroundColor = "bg-secondary/50",
  className = "",
  linkTo,
  children
}: CardProps) {
  const content = (
    <>
      {(icon || title) && (
        <div className="flex items-center gap-2">
          {icon && <div className="text-primary text-3xl mb-4">{icon}</div>}
          {title && <h3 className="text-xl font-semibold mb-2 text-foreground max-md:text-lg">{title}</h3>}
        </div>
      )}
      {description && <p className="text-sm text-muted-foreground max-md:text-xs">{description}</p>}
      {children}
    </>
  )

  const cardClasses = clsx(
    "group relative overflow-hidden rounded-lg p-6 border border-border shadow-sm",
    backgroundColor,
    linkTo && "hover-fine:-translate-y-0.5 hover-fine:shadow-md hover-fine:border-primary/30 transition-[transform,box-shadow,border-color] duration-(--dur-base) ease-out",
    className
  )

  if (linkTo) {
    return (
      <Link href={linkTo} className={cardClasses}>
        <span className="absolute top-0 left-0 h-0.5 w-0 bg-primary transition-[width] duration-(--dur-base) ease-out group-hover:w-full" aria-hidden="true" />
        {content}
      </Link>
    )
  }

  return <div className={cardClasses}>{content}</div>;
}

export default Card;
