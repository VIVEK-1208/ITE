import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import './Orders.css';
import { downloadInvoice } from '../utils/DownloadInvoice';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'orders'), (snapshot) => {
      const orderList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setOrders(orderList);
    });
    return () => unsub();
  }, []);

  const filteredOrders = orders.filter(order =>
    order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    `${order.deliveryInfo?.firstName || ''} ${order.deliveryInfo?.lastName || ''}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (order.deliveryInfo?.phone || '').includes(searchTerm)
  );

  const updateStatus = async (id, status) => {
    const order = orders.find(o => o.id === id);
    if (order?.status === 'Cancelled') return alert("Can't update a cancelled order");
    await updateDoc(doc(db, 'orders', id), { status });
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'Processing': return 'status-badge processing';
      case 'Shipped': return 'status-badge shipped';
      case 'Delivered': return 'status-badge delivered';
      case 'Cancelled': return 'status-badge cancelled';
      default: return 'status-badge';
    }
  };

  return (
    <div className="admin-orders-container">
      <h2>📦 Orders</h2>
      <input
        type="text"
        placeholder="Search by Order ID / Name / Mobile"
        onChange={(e) => setSearchTerm(e.target.value)}
        className="order-search"
      />

      <div className="table-wrapper">
        <table className="order-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Mobile</th>
              <th>Total</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map(order => (
              <tr key={order.id}>
                <td>{order.orderId || order.id}</td>
                <td>{`${order.deliveryInfo?.firstName || ''} ${order.deliveryInfo?.lastName || ''}`}</td>
                <td>{order.deliveryInfo?.phone || '—'}</td>
                <td>₹{order.total || 0}</td>
                <td>
                  <select
                    value={order.status || 'Processing'}
                    onChange={(e) => updateStatus(order.id, e.target.value)}
                    disabled={order.status === 'Cancelled'}
                    className={getStatusClass(order.status)}
                  >
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </td>
                <td>
                  <button className="view-btn" onClick={() => setSelectedOrder(order)}>View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedOrder && (
        <div className="order-popup">
          <div className="order-popup-content">
            <h3>Order Details</h3>
            <p><strong>Order ID:</strong> {selectedOrder.orderId || selectedOrder.id}</p>
            <p><strong>Customer:</strong> {`${selectedOrder.deliveryInfo?.firstName || ''} ${selectedOrder.deliveryInfo?.lastName || ''}`}</p>
            <p><strong>Email:</strong> {selectedOrder.deliveryInfo?.email || '—'}</p>
            <p><strong>Phone:</strong> {selectedOrder.deliveryInfo?.phone || '—'}</p>
            <p><strong>Status:</strong> {selectedOrder.status || '—'}</p>
            <p><strong>Total:</strong> ₹{selectedOrder.total || 0}</p>
            <p><strong>Address:</strong> {`${selectedOrder.deliveryInfo?.street || ''}, ${selectedOrder.deliveryInfo?.city || ''}, ${selectedOrder.deliveryInfo?.district || ''}, ${selectedOrder.deliveryInfo?.state || ''} - ${selectedOrder.deliveryInfo?.pincode || ''}`}</p>

            <h4>Items</h4>
            <ul>
              {selectedOrder.cart?.map((item, idx) => (
                <li key={idx}>{item.name} — Qty: {item.quantity} — ₹{item.price}</li>
              ))}
            </ul>

            <button
  onClick={() =>
    downloadInvoice({
      ...selectedOrder,
      items: selectedOrder.cart || [],
    })
  }
>
  Download Invoice
</button>

            <button onClick={() => setSelectedOrder(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
