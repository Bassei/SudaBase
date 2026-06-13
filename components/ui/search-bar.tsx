export function SearchBar({ defaultValue, placeholder = 'Search...' }: { defaultValue?: string; placeholder?: string }) {
  return <input className="input" name="q" defaultValue={defaultValue} placeholder={placeholder} />;
}

