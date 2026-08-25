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
          "rounded-full border px-4 py-1.5 font-body text-sm transition-colors",
          !active
            ? "border-public-black bg-public-black text-public-white"
            : "border-public-black/20 text-public-black/70 hover:border-public-black"
        )}
      >
        All Work
      </Link>
      {categories.map((cat) => (
        <Link
          key={cat.id}
          href={`/portfolio?category=${cat.slug}`}
          className={cn(
            "rounded-full border px-4 py-1.5 font-body text-sm transition-colors",
            active === cat.slug
              ? "border-public-black bg-public-black text-public-white"
              : "border-public-black/20 text-public-black/70 hover:border-public-black"
          )}
        >
          {cat.name}
        </Link>
      ))}
    </div>
  );
}
