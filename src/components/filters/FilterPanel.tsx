import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { categories, priceRanges, SortKey } from "@/data/products";

interface Filters {
  sort: SortKey;
  category: string | null;
  name: string;
  code: string;
  price: { min: number; max: number } | null;
}

interface Props {
  value: Filters;
  onChange: (v: Filters) => void;
  onApply?: () => void;
  onReset?: () => void;
}

const sortOptions: { key: SortKey; label: string }[] = [
  { key: "best", label: "Best Selling" },
  { key: "new", label: "Newest" },
  { key: "priceAsc", label: "Price: Low→High" },
  { key: "priceDesc", label: "Price: High→Low" },
];

const FilterPanel = ({ value, onChange, onApply, onReset }: Props) => {
  const set = (partial: Partial<Filters>) => onChange({ ...value, ...partial });

  return (
    <div className="space-y-6">
      <div>
        <h4 className="font-semibold mb-2">Sort</h4>
        <div className="flex gap-2 overflow-x-auto">
          {sortOptions.map(o => (
            <Button key={o.key} variant={value.sort === o.key ? "hero" : "chip"} size="chip" onClick={() => set({ sort: o.key })}>
              {o.label}
            </Button>
          ))}
        </div>
      </div>

      <div>
        <h4 className="font-semibold mb-2">Categories</h4>
        <div className="flex gap-2 overflow-x-auto">
          <Button variant={!value.category ? "hero" : "chip"} size="chip" onClick={() => set({ category: null })}>All</Button>
          {categories.map(cat => (
            <Button key={cat} variant={value.category === cat ? "hero" : "chip"} size="chip" onClick={() => set({ category: cat })}>
              {cat}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid gap-3">
        <Input placeholder="Product Name" value={value.name} onChange={e => set({ name: e.target.value })} aria-label="Product Name" />
        <Input placeholder="Product Code (SKU)" value={value.code} onChange={e => set({ code: e.target.value })} aria-label="Product Code" />
      </div>

      <div>
        <h4 className="font-semibold mb-2">Price Range</h4>
        <div className="flex gap-2 flex-wrap">
          {priceRanges.map(r => {
            const selected = value.price?.min === r.min && value.price?.max === r.max;
            return (
              <Button key={r.label} variant={selected ? "hero" : "chip"} size="chip" onClick={() => set({ price: selected ? null : { min: r.min, max: r.max } })}>
                {r.label}
              </Button>
            );
          })}
        </div>
      </div>

      <Separator />
      <div className="flex items-center justify-between gap-3">
        <Button variant="outline" onClick={onReset}>Reset</Button>
        <Button variant="hero" onClick={onApply}>Apply</Button>
      </div>
    </div>
  );
};

export type { Filters };
export default FilterPanel;
