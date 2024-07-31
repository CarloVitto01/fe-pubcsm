import React, { useEffect, useState } from 'react';
import { getOrders, createOrder, updateOrder, deleteOrder } from '../api/orderService';
import { getPersons } from '../api/personService';
import { getProducts } from '../api/productService';
import { Order, Person, Product } from '../types';
import './OrderList.css'; // Importa il file CSS

const OrderList: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [persons, setPersons] = useState<Person[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [newOrder, setNewOrder] = useState<Order>({ personId: 0, productIds: [] });
    const [error, setError] = useState<string | null>(null);
    const [showDropdown, setShowDropdown] = useState<boolean>(false);
    const [editingOrderId, setEditingOrderId] = useState<number | null>(null);
    const [filterText, setFilterText] = useState<string>('');

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await getOrders();
                setOrders(response.data);
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        };

        const fetchPersons = async () => {
            try {
                const response = await getPersons();
                setPersons(response.data);
            } catch (error) {
                console.error('Error fetching persons:', error);
            }
        };

        const fetchProducts = async () => {
            try {
                const response = await getProducts();
                setProducts(response.data);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchOrders();
        fetchPersons();
        fetchProducts();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name === 'personId') {
            setNewOrder((prevOrder) => ({
                ...prevOrder,
                personId: Number(value),
            }));
        } else if (name === 'productIds') {
            const productId = Number(value);
            setNewOrder((prevOrder) => ({
                ...prevOrder,
                productIds: prevOrder.productIds.includes(productId)
                    ? prevOrder.productIds.filter(id => id !== productId)
                    : [...prevOrder.productIds, productId],
            }));
        }
    };

    const handleProductClick = (productId: number) => {
        setNewOrder((prevOrder) => ({
            ...prevOrder,
            productIds: prevOrder.productIds.includes(productId)
                ? prevOrder.productIds.filter(id => id !== productId)
                : [...prevOrder.productIds, productId],
        }));
    };

    const handleDropdownClick = () => {
        setShowDropdown(!showDropdown);
    };

    const handleSelectPerson = (personId: number) => {
        setNewOrder((prevOrder) => ({
            ...prevOrder,
            personId,
        }));
        setShowDropdown(false);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null); // Reset error

        try {
            if (editingOrderId !== null) {
                await updateOrder(editingOrderId, newOrder);
                setEditingOrderId(null);
            } else {
                await createOrder(newOrder);
            }
            setNewOrder({ personId: 0, productIds: [] });
            const response = await getOrders();
            setOrders(response.data);
        } catch (error) {
            setError(editingOrderId !== null ? 'Failed to update order' : 'Failed to create order');
            console.error('Error submitting order:', error);
        }
    };

    const handleDelete = async (orderId: number) => {
        try {
            await deleteOrder(orderId);
            const response = await getOrders();
            setOrders(response.data);
        } catch (error) {
            setError('Failed to delete order');
            console.error('Error deleting order:', error);
        }
    };

    const handleEdit = (order: Order) => {
        setNewOrder({ personId: order.personId, productIds: order.productIds });
        setEditingOrderId(order.id!);
    };

    const getPersonName = (personId: number) => {
        const person = persons.find(p => p.id === personId);
        return person ? person.name : 'Seleziona Utente';
    };

    const getProductNamesAndTotal = (productIds: number[]) => {
        const productNames = products
            .filter(p => productIds.includes(p.id!))
            .map(p => p.name)
            .join(', ');
        
        const total = products
            .filter(p => productIds.includes(p.id!))
            .reduce((sum, product) => sum + product.price, 0);
        
        return { productNames: productNames || 'None', total };
    };

    const filteredOrders = orders.filter(order => {
        const { productNames } = getProductNamesAndTotal(order.productIds);
        const personName = getPersonName(order.personId);
        return personName.toLowerCase().includes(filterText.toLowerCase()) || productNames.toLowerCase().includes(filterText.toLowerCase());
    });

    return (
        <div>
            <h1>Ordini</h1>
            <form onSubmit={handleSubmit} className="order-form">
                <div className="custom-dropdown">
                    <label htmlFor="personId">Cliente:</label>
                    <div className="dropdown-container" onClick={handleDropdownClick}>
                        <div className="selected-item">{getPersonName(newOrder.personId) || 'Select a person'}</div>
                        {showDropdown && (
                            <ul className="dropdown-menu">
                                {persons.map(person => (
                                    <li
                                        key={person.id}
                                        onClick={() => handleSelectPerson(person.id!)}
                                        className={newOrder.personId === person.id ? 'selected' : ''}
                                    >
                                        {person.name}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
                <div className="products-list">
                    <label>Prodotto/i:</label>
                    {products.map(product => (
                        <div
                            key={product.id}
                            className={`product-item ${newOrder.productIds.includes(product.id!) ? 'selected' : ''}`}
                            onClick={() => handleProductClick(product.id!)}
                        >
                            <span>{product.name} €{product.price}</span>
                            <input
                                type="checkbox"
                                id={`product-${product.id}`}
                                name="productIds"
                                value={product.id}
                                checked={newOrder.productIds.includes(product.id!)}
                                onChange={handleChange}
                                style={{ display: 'none' }}
                            />
                        </div>
                    ))}
                </div>
                <button type="submit" className="submit-button">{editingOrderId !== null ? 'Update Order' : 'Add Order'}</button>
                {error && <p className="error-message">{error}</p>}
            </form>

            <div className="filter-container">
                <label htmlFor="filterText">Filtro:</label>
                <input
                    type="text"
                    id="filterText"
                    value={filterText}
                    onChange={(e) => setFilterText(e.target.value)}
                    placeholder="Filtra per nome cliente o prodotto"
                    className="filter-input"
                />
            </div>

            <ul className="order-list">
                {filteredOrders.map(order => {
                    const { productNames, total } = getProductNamesAndTotal(order.productIds);
                    return (
                        <li key={order.id} className="order-list-item">
                            <div className="order-details">
                                <div><strong>Cliente:</strong> {getPersonName(order.personId)}</div>
                                <div><strong>Prodotto/i:</strong> {productNames}</div>
                                <div><strong>Totale:</strong> €{total.toFixed(2)}</div>
                            </div>
                            <div className="order-actions">
                                <button onClick={() => handleEdit(order)} className="edit-button">Modifica</button>
                                <button onClick={() => handleDelete(order.id!)} className="delete-button">Delete</button>
                            </div>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default OrderList;
