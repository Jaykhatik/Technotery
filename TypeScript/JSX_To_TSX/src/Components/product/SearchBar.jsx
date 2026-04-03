function SearchBar({ searchTerm, setSearchTerm, handleAddBtn }) {
    return (
        <div className="top-bar">
            <input
                type="text"
                placeholder="🔍 Search products by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
            />

            <button className="add-btn" onClick={handleAddBtn}>
                Add +
            </button>
        </div>
    );
}

export default SearchBar;