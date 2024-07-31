import React, { useEffect, useState } from 'react';
import { getProducts, createProduct, deleteProduct } from '../api/productService';
import { Product } from '../types';
import './ProductList.css'; // Assicurati di importare il file CSS

const ProductList: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [newProduct, setNewProduct] = useState<Product>({ name: '', price: 0 });
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await getProducts();
                setProducts(response.data);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchProducts();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewProduct((prevProduct) => ({
            ...prevProduct,
            [name]: name === 'price' ? parseFloat(value) : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null); // Reset error

        if (isNaN(newProduct.price) || newProduct.price <= 0) {
            setError('Please enter a valid price greater than 0');
            return;
        }

        try {
            await createProduct(newProduct);
            setNewProduct({ name: '', price: 0 }); // Clear form
            const response = await getProducts(); // Refresh list
            setProducts(response.data);
        } catch (error) {
            setError('Failed to create product');
            console.error('Error creating product:', error);
        }
    };

    const handleDelete = async (productId: number) => {
        setError(null); // Reset error

        try {
            await deleteProduct(productId);
            const response = await getProducts(); // Refresh list
            setProducts(response.data);
        } catch (error) {
            setError('Failed to delete product');
            console.error('Error deleting product:', error);
        }
    };

    return (
        <div>
            <h1>Prodotti</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="name">Nome:</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={newProduct.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="price">Prezzo:</label>
                    <input
                        type="number"
                        id="price"
                        name="price"
                        step="0.01"
                        value={newProduct.price}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit">Add Product</button>
                {error && <p style={{ color: 'red' }}>{error}</p>}
            </form>
            <ul>
                {products.map(product => (
                    <li key={product.id} className="product-list-item">
                        {product.name} €{product.price.toFixed(2)}
                        <button 
                            onClick={() => handleDelete(product.id!)}
                            className="delete-button"
                        >
                            Delete
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ProductList;
