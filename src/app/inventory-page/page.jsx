'use client';

import { useState, useEffect } from 'react';

export default function InventoryPage() {
  const providerId = 2; // Example providerId (e.g., Sneha Stores)
  const [inventory, setInventory] = useState([]);
  const [newItem, setNewItem] = useState({
    item_name: '',
    description: '',
    quantity_available: 0,
    price: 0,
    shop_id: 5 // Hardcoded shop_id
  });
  const [error, setError] = useState(null); // Add error state for feedback

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const response = await fetch(`/api/inventory?providerId=${providerId}`);
      if (!response.ok) throw new Error('Failed to fetch inventory');
      const data = await response.json();
      setInventory(data);
    } catch (error) {
      console.error('Fetch error:', error);
      setError(error.message);
    }
  };

  const addItem = async () => {
    try {
      const response = await fetch('/api/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ providerId, ...newItem })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add item');
      }

      const result = await response.json();
      console.log('Item added:', result); // Log success
      await fetchInventory(); // Refresh inventory
      setNewItem({ item_name: '', description: '', quantity_available: 0, price: 0, shop_id: 5 }); // Reset form
      setError(null); // Clear any previous errors
    } catch (error) {
      console.error('Add item error:', error);
      setError(error.message); // Display error to user
    }
  };

  const updateItem = async (itemId, quantity, price) => {
    try {
      const response = await fetch('/api/inventory', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ providerId, itemId, quantity_available: quantity, price })
      });
      if (!response.ok) throw new Error('Failed to update item');
      await fetchInventory();
    } catch (error) {
      console.error('Update error:', error);
      setError(error.message);
    }
  };

  const deleteItem = async (itemId) => {
    try {
      const response = await fetch(`/api/inventory?providerId=${providerId}&itemId=${itemId}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete item');
      await fetchInventory();
    } catch (error) {
      console.error('Delete error:', error);
      setError(error.message);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Manage Inventory</h2>

      {/* Display Error */}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Add New Item Form */}
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Item Name"
          value={newItem.item_name}
          onChange={(e) => setNewItem({ ...newItem, item_name: e.target.value })}
          style={{ marginRight: '10px' }}
        />
        <input
          type="text"
          placeholder="Description"
          value={newItem.description}
          onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
          style={{ marginRight: '10px' }}
        />
        <input
          type="number"
          placeholder="Quantity"
          value={newItem.quantity_available}
          onChange={(e) => setNewItem({ ...newItem, quantity_available: parseInt(e.target.value) || 0 })}
          style={{ marginRight: '10px' }}
        />
        <input
          type="number"
          placeholder="Price"
          value={newItem.price}
          onChange={(e) => setNewItem({ ...newItem, price: parseFloat(e.target.value) || 0 })}
          style={{ marginRight: '10px' }}
        />
        <button onClick={addItem}>Add Item</button>
      </div>

      {/* Inventory Table */}
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Item Name</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Description</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Quantity</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Price</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Shop</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {inventory.map((item) => (
            <tr key={item.id}>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.item_name}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.description}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                <input
                  type="number"
                  value={item.quantity_available}
                  onChange={(e) => updateItem(item.id, e.target.value, item.price)}
                  style={{ width: '60px' }}
                />
              </td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                <input
                  type="number"
                  value={item.price}
                  onChange={(e) => updateItem(item.id, item.quantity_available, e.target.value)}
                  style={{ width: '60px' }}
                />
              </td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.shop_name}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                <button onClick={() => deleteItem(item.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}