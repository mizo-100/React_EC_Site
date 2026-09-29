import type { Category } from "../types/category";

type categoryButtonProps = {
  categories: Category[];
  selectedSlugs: string[];
  onChange: (nextSlugs: string[]) => void;
  disabled?: boolean;
};

export const CategorySelectButtons = ({
  categories,
  selectedSlugs,
  onChange,
  disabled = false,
}: categoryButtonProps) => {
  const handleClick = (slug: string) => {
    const nextSlugs = selectedSlugs.includes(slug)
      ? selectedSlugs.filter((selectedSlug) => selectedSlug !== slug)
      : [...selectedSlugs, slug];

    onChange(nextSlugs);
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {categories.map((category) => {
        const isSelected = selectedSlugs.includes(category.slug);

        return (
          <button
            key={category.slug}
            type="button"
            disabled={disabled}
            aria-pressed={isSelected}
            onClick={() => handleClick(category.slug)}
            className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
              isSelected
                ? "border-blue-600 bg-blue-600 text-white"
                : "border-gray-200 bg-white text-gray-600 hover:border-blue-400 hover:text-blue-600"
            } disabled:cursor-not-allowed disabled:opacity-50`}
          >
            {category.name}
          </button>
        );
      })}
    </div>
  );
}
