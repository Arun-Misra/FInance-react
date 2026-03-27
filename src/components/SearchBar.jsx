import { HiOutlineSearch } from 'react-icons/hi'

export function SearchBar({ value, onChange }) {
  return (
    <div className="search-wrap">
      <HiOutlineSearch className="search-icon" />
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search by title or notes"
        aria-label="Search transactions"
      />
    </div>
  )
}
