import React, { type ReactNode } from "react";
import Link from "next/link";

type CardProps = {
  icon?: React.ReactNode;
  title?: string;
  backgroundColor?: string;
  description?: string;
  className?: string;
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
  return (
    <div
      className={`group relative overflow-hidden ${backgroundColor} rounded-xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-border/60 hover:border-primary/40 ${className}`}
    >
      <div className="absolute top-0 left-0 right-0 h-0.75 bg-gradient-primary opacity-50 group-hover:opacity-100 transition-opacity duration-300" />
      {linkTo && <Link href={linkTo}>
        <div className="flex items-center gap-2">
          {icon && <div className="text-primary text-3xl mb-4">{icon}</div>}
          {title && <h3 className="text-2xl font-semibold mb-2 text-foreground max-md:text-lg">{title}</h3>}
        </div>
        {description && <p className="text-sm text-muted-foreground max-md:text-xs">{description}</p>}
      </Link>}

      {!linkTo && <div>
        <div className="flex items-center gap-2">
          {icon && <div className="text-primary text-3xl mb-4">{icon}</div>}
          {title && <h3 className="text-xl font-semibold mb-2 text-foreground max-md:text-lg">{title}</h3>}
        </div>
        {description && <p className="text-sm text-muted-foreground max-md:text-xs">{description}</p>}
        <div>
          {children}
        </div>
      </div> }
    </div>
  );
}

export default Card;
