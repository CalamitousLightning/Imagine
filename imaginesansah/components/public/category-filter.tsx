import Link from "next/link";
import type { Category } from "@/types/domain";
import { cn } from "@/lib/utils";

export function CategoryFilter({
  categories,
  active,
}: {
  categories: Category[];
  active?: string;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      <Link
        href="/portfolio"
        className={cn(
          "rounded-full border px-4 py-1.5 font-body text-sm transition-all duration-200",
          !active
            ? "border-public-black bg-public-black text-public-white shadow-[0_6px_16px_rgba(17,17,17,0.25)]"
            : "border-public-black/20 text-public-black/70 hover:border-public-violet hover:text-public-violet"
        )}
      >
        All Work
      </Link>
      {categories.map((cat) => (
        <Link
          key={cat.id}
          href={`/portfolio?category=${cat.slug}`}
          className={cn(
            "rounded-full border px-4 py-1.5 font-body text-sm transition-all duration-200",
            active === cat.slug
              ? "border-public-black bg-public-black text-public-white shadow-[0_6px_16px_rgba(17,17,17,0.25)]"
              : "border-public-black/20 text-public-black/70 hover:border-public-violet hover:text-public-violet"
          )}
        >
          {cat.name}
        </Link>
      ))}
    </div>
  );
}
