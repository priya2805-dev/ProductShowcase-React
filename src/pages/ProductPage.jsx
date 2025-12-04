import React, { useEffect, useState, useContext } from "react";
import productData from "../data/data.json";
import ViewToggle from "../components/ViewToggle";
import { ViewContext } from "../context/ViewContext";
import "../styles/ProductPage.css";

const ProductPage = () => {
  const [product, setProduct] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "",
    stock: "",
    description: "",
  });
  const [errors, setErrors] = useState({});
  const [editingId, setEditingId] = useState(null);

  const { view } = useContext(ViewContext);

  // Load products
  useEffect(() => {
    setProduct(productData);
    setFilteredProducts(productData);
  }, []);

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchTerm) {
        const filtered = product.filter((p) =>
          p.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredProducts(filtered);
      } else {
        setFilteredProducts(product);
      }
    }, 500);

    return () => clearTimeout(handler);
  }, [searchTerm, product]);

  // Form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.price) newErrors.price = "Price is required";
    if (!formData.category.trim()) newErrors.category = "Category is required";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    if (editingId) {
      const updatedProducts = product.map((p) =>
        p.id === editingId ? { ...p, ...formData } : p
      );
      setProduct(updatedProducts);
      setFilteredProducts(updatedProducts);
      setEditingId(null);
    } else {
      const newProduct = { id: product.length + 1, ...formData };
      const updatedProducts = [...product, newProduct];
      setProduct(updatedProducts);
      setFilteredProducts(updatedProducts);
    }

    setFormData({
      name: "",
      price: "",
      category: "",
      stock: "",
      description: "",
    });
    setErrors({});
    setShowForm(false);
  };

  const handleEdit = (id) => {
    const productToEdit = product.find((p) => p.id === id);
    setFormData({ ...productToEdit });
    setEditingId(id);
    setShowForm(true);
  };

  return (
    <div className="product-page">
      <h2 className="page-title">Product Management</h2>
      <h4 className="product-count">
        Total Products: {filteredProducts.length}
      </h4>

      <ViewToggle />

      {/* Search */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Search by product name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {/* Add Product Button */}
      {!showForm && (
        <div className="add-button-container">
          <button className="add-button" onClick={() => setShowForm(true)}>
            Add Product
          </button>
        </div>
      )}

      {/* Product Form */}
      {showForm && (
        <div className="product-form">
          <h3 className="form-title">
            {editingId ? "Edit Product" : "Add Product"}
          </h3>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <label>Name*</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
              {errors.name && <span className="error">{errors.name}</span>}
            </div>

            <div className="form-row">
              <label>Price*</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
              />
              {errors.price && <span className="error">{errors.price}</span>}
            </div>

            <div className="form-row">
              <label>Category*</label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
              />
              {errors.category && (
                <span className="error">{errors.category}</span>
              )}
            </div>

            <div className="form-row">
              <label>Stock</label>
              <input
                type="number"
                value={formData.stock}
                onChange={(e) =>
                  setFormData({ ...formData, stock: e.target.value })
                }
              />
            </div>

            <div className="form-row">
              <label>Description</label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>

            <div className="button-group">
              <button type="submit" className="submit-btn">
                {editingId ? "Update" : "Add"} Product
              </button>
              <button
                type="button"
                className="cancel-btn"
                onClick={() => {
                  setShowForm(false);
                  setFormData({
                    name: "",
                    price: "",
                    category: "",
                    stock: "",
                    description: "",
                  });
                  setErrors({});
                  setEditingId(null);
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Products Table or Grid */}
      {view === "table" ? (
        <div className="table-container">
          <table>
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
              {filteredProducts.map((p) => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>{p.name}</td>
                  <td>₹{p.price}</td>
                  <td>{p.category}</td>
                  <td>{p.stock}</td>
                  <td>{p.description}</td>
                  <td>
                    <button
                      className="edit-btn"
                      onClick={() => handleEdit(p.id)}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid-container">
          {filteredProducts.map((p) => (
            <div key={p.id} className="grid-item">
              <p>
                <strong>ID:</strong> {p.id}
              </p>
               <p>
                <strong>Name:</strong> {p.name}
              </p>
              <p>
                <strong>Price:</strong> ₹{p.price}
              </p>
              <p>
                <strong>Category:</strong> {p.category}
              </p>
              <p>
                <strong>Stock:</strong> {p.stock}
              </p>
              <p>
                <strong>Description:</strong> {p.description}
              </p>
              <button className="edit-btn" onClick={() => handleEdit(p.id)}>
                Edit
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductPage;
