import React, { useState, useEffect } from "react";
import "../styles/ProductForm.css";

const ProductForm = ({ productToEdit, onSave, onCancel }) => {
  const [product, setProduct] = useState({
    name: "",
    price: "",
    category: "",
    stock: "",
    description: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (productToEdit) setProduct(productToEdit);
  }, [productToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const errs = {};
    if (!product.name.trim()) errs.name = "Name is required";
    if (!product.price || isNaN(product.price)) errs.price = "Price is required";
    if (!product.category.trim()) errs.category = "Category is required";
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }
    onSave({
      ...product,
      price: Number(product.price),
      stock: product.stock ? Number(product.stock) : 0,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="product-form">
      <h2>{productToEdit ? "Edit Product" : "Add Product"}</h2>

      <div className="form-group">
        <label>Name *</label>
        <input type="text" name="name" value={product.name} onChange={handleChange} />
        {errors.name && <p className="error">{errors.name}</p>}
      </div>

      <div className="form-group">
        <label>Price *</label>
        <input type="number" name="price" value={product.price} onChange={handleChange} />
        {errors.price && <p className="error">{errors.price}</p>}
      </div>

      <div className="form-group">
        <label>Category *</label>
        <input type="text" name="category" value={product.category} onChange={handleChange} />
        {errors.category && <p className="error">{errors.category}</p>}
      </div>

      <div className="form-group">
        <label>Stock</label>
        <input type="number" name="stock" value={product.stock} onChange={handleChange} />
      </div>

      <div className="form-group">
        <label>Description</label>
        <textarea name="description" value={product.description} onChange={handleChange} />
      </div>

      <div className="form-actions">
        <button type="button" className="btn-cancel" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn-submit">
          {productToEdit ? "Update" : "Add"}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;
