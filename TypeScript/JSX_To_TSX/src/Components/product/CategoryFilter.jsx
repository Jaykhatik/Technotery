function CategoryFilter({ uniqueCategories, selectedCategory, setSelectedCategory }) {
    return (
        <div className="filter-container">
            <button
                className={`filter-btn ${!selectedCategory ? 'active' : ''}`}
                onClick={() => setSelectedCategory(null)}
            >
                All
            </button>

            {uniqueCategories.map((category) => (
                <button
                    key={category}
                    className={`filter-btn ${selectedCategory === category ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(category)}
                >
                    {category}
                </button>
            ))}
        </div>
    );
}

export default CategoryFilter;