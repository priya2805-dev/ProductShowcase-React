import React, { useState, useEffect, useContext } from "react";
import productData from "../data/data.json";
import { ViewContext } from "../context/ViewContext";
import ViewToggle from "../components/ViewToggle";
import PaginationPage from "../components/Pagination";
import "../styles/ProductPage.css";

const ProductPage = () => {
  const { view } = useContext(ViewContext);

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    name: "",
    price: "",
    category: "",
    stock: "",
    description: "",
  });
  const [errors, setErrors] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Load product list
  useEffect(() => {
    setProducts(productData);
    setFilteredProducts(productData);
  }, []);

  // Debounced search
  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchTerm) {
        const flt = products.filter((p) =>
          p.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredProducts(flt);
        setCurrentPage(1);
      } else {
        setFilteredProducts(products);
      }
    }, 500);

    return () => clearTimeout(handler);
  }, [searchTerm, products]);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);

  // Form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = {};
    if (!formData.name.trim()) errs.name = "Name is required";
    if (!formData.price) errs.price = "Price is required";
    if (!formData.category.trim()) errs.category = "Category is required";
    setErrors(errs);
    if (Object.keys(errs).length) return;

    if (editingId) {
      const updated = products.map((p) =>
        p.id === editingId ? { ...p, ...formData } : p
      );
      setProducts(updated);
      setFilteredProducts(updated);
      setEditingId(null);
    } else {
      const newProduct = { id: products.length + 1, ...formData };
      const updated = [...products, newProduct];
      setProducts(updated);
      setFilteredProducts(updated);
    }

    setFormData({ id: null, name: "", price: "", category: "", stock: "", description: "" });
    setErrors({});
    setShowForm(false);
  };

  const handleEdit = (id) => {
    const product = products.find((p) => p.id === id);
    setFormData({ ...product });
    setEditingId(id);
    setShowForm(true);
  };

  return (
    <div className="product-page">

      {/* Header */}
      <div className="header-row">
        <h2 className="page-title">Product Management</h2>
        <div className="header-right">
          <ViewToggle />
          <button className="add-btn" onClick={() => setShowForm(true)}>
            Add Product
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Search products..."
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Product Form */}
      {showForm && (
        <div className="product-form">
          <h3 className="form-title">{editingId ? "Edit Product" : "Add Product"}</h3>
          <form className="form-box" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Product Name"
              className="form-input"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            {errors.name && <span className="error">{errors.name}</span>}

            <input
              type="number"
              placeholder="Price"
              className="form-input"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            />
            {errors.price && <span className="error">{errors.price}</span>}

            <input
              type="text"
              placeholder="Category"
              className="form-input"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            />
            {errors.category && <span className="error">{errors.category}</span>}

            <input
              type="number"
              placeholder="Stock"
              className="form-input"
              value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
            />

            <textarea
              placeholder="Description"
              className="form-textarea"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />

            <div className="form-buttons">
              <button type="submit" className="submit-btn">
                {editingId ? "Update" : "Add"}
              </button>
              <button
                type="button"
                className="cancel-btn"
                onClick={() => {
                  setShowForm(false);
                  setFormData({ id: null, name: "", price: "", category: "", stock: "", description: "" });
                  setEditingId(null);
                  setErrors({});
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Table / Grid View */}
      {view === "table" ? (
        <div className="table-wrapper">
          <table className="table-view">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Price</th>
                <th>Category</th>
                <th>Stock</th>
                <th>Description</th>
                <th>Edit</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((p) => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>{p.name}</td>
                  <td>₹{p.price}</td>
                  <td>{p.category}</td>
                  <td>{p.stock}</td>
                  <td>{p.description}</td>
                  <td>
                    <button className="edit-btn" onClick={() => handleEdit(p.id)}>Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid-container">
          {currentItems.map((p) => (
            <div className="grid-card" key={p.id}>
              <h3>{p.name}</h3>
              <p>₹{p.price}</p>
              <p>{p.category}</p>
              <p>Stock: {p.stock}</p>
              <p>{p.description}</p>
              <button className="edit-btn" onClick={() => handleEdit(p.id)}>Edit</button>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      <PaginationPage
        totalItems={filteredProducts.length}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
};

export default ProductPage;
