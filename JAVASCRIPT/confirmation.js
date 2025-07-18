document.addEventListener('DOMContentLoaded', () => {
    const data = JSON.parse(localStorage.getItem('finalOrder'));
  
    if (!data) {
      document.body.innerHTML = '<h2>No order found. Please make an order first.</h2>';
      return;
    }
  
    document.getElementById('order-number').textContent = data.orderNumber;
    document.getElementById('order-name').textContent = data.fullName;
    document.getElementById('order-phone').textContent = data.phone;
    document.getElementById('order-address').textContent = data.address;
    document.getElementById('order-payment').textContent = data.payment;
    document.getElementById('order-total').textContent = data.total.toFixed(2);

    // const total = data. total;
  
    const list = document.getElementById('ordered-items');
    data.items.forEach(item => {
      const li = document.createElement('li');
      li.textContent = `${item.name} - Qty: ${item.quantity} - ₦${(item.price * item.quantity).toFixed(2)}`;
      list.appendChild(li);
    });
  
  
  });
  