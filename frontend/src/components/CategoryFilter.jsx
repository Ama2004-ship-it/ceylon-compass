export default function CategoryFilter({ categories, selected, onToggle }) {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((cat) => {
        const isActive = selected.includes(cat.name);
        return (
          <button
            key={cat.id}
            onClick={() => onToggle(cat.name)}
            className={`px-4 py-2 rounded-full text-sm font-medium border transition ${
              isActive
                ? 'bg-ocean-500 border-ocean-500 text-white shadow-card'
                : 'bg-white border-ocean-200 text-ocean-700 hover:border-ocean-400'
            }`}
          >
            {cat.name}
          </button>
        );
      })}
    </div>
  );
}
