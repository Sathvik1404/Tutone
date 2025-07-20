import React, { useState } from 'react';
import './ProductPage.css';

const ProductPage = () => {
    const [products, setProducts] = useState([
        {
            id: 1,
            name: "Classic T-Shirt",
            price: 29.99,
            category: "Clothing",
            image: "https://via.placeholder.com/400",
            description: "Comfortable cotton t-shirt"
        },
        {
            id: 1,
            name: "Classic T-Shirt",
            price: 29.99,
            category: "Clothing",
            image: "https://via.placeholder.com/400",
            description: "Comfortable cotton t-shirt"
        },
        {
            id: 1,
            name: "Classic T-Shirt",
            price: 29.99,
            category: "Clothing",
            image: "https://via.placeholder.com/400",
            description: "Comfortable cotton t-shirt"
        },
        {
            id: 1,
            name: "Classic T-Shirt",
            price: 29.99,
            category: "Clothing",
            image: "https://via.placeholder.com/400",
            description: "Comfortable cotton t-shirt"
        },
        {
            id: 1,
            name: "Classic T-Shirt",
            price: 29.99,
            category: "Clothing",
            image: "https://via.placeholder.com/400",
            description: "Comfortable cotton t-shirt"
        },
        // Add more products here
    ]);

    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("name");
    const [filterCategory, setFilterCategory] = useState("All");

    // Filter and sort products
    const filteredProducts = products
        .filter(product =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
            (filterCategory === "All" || product.category === filterCategory)
        )
        .sort((a, b) => {
            if (sortBy === "price") return a.price - b.price;
            return a.name.localeCompare(b.name);
        });

    return (
        <div className="landing-container product-page">
            {/* Background Animation */}

            <nav className="navbar">
                <div className="logo">TUTONE</div>
                <div className="search-bar">
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="filters">
                    <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                        <option value="name">Sort by Name</option>
                        <option value="price">Sort by Price</option>
                    </select>
                    <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
                        <option value="All">All Categories</option>
                        <option value="Clothing">Clothing</option>
                        <option value="Electronics">Electronics</option>
                        <option value="Books">Books</option>
                    </select>
                </div>
            </nav>

            <div className="products-grid">
                {filteredProducts.map(product => (
                    <div key={product.id} className="product-card">
                        <img src={product.image} alt={product.name} />
                        <div className="product-info">
                            <h3>{product.name}</h3>
                            <p className="price">${product.price.toFixed(2)}</p>
                            <p className="description">{product.description}</p>
                            <button className="add-to-cart">Add to Cart</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductPage;
