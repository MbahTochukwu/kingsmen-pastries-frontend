// checkout.js
document.addEventListener('DOMContentLoaded', () => {
  const data = JSON.parse(localStorage.getItem('orderData')) || {};
  const { customerName = '', address = '', phone = '', items = [], total = 0 } = data;

  // Populate form fields
  document.getElementById('fullName').value = customerName;
  document.getElementById('address').value = address;
  document.getElementById('phone').value = phone;

  // Display order items
  const orderItemsContainer = document.getElementById('order-items');
  const orderTotalElement = document.getElementById('order-total');
  items.forEach(item => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${item.item}</td>
      <td>${item.qty}</td>
      <td>₦${(item.price * item.qty).toLocaleString()}</td>
    `;
    orderItemsContainer.appendChild(row);
  });

  // Food stamps logic
  const userStamps = JSON.parse(localStorage.getItem('userStamps')) || 0;
  const stampValue = 200;
  let stampsToUse = 0;
  let discount = 0;
  let finalTotal = total;

  document.getElementById('available-stamps').textContent = userStamps;
  document.getElementById('stamp-info').textContent = `Food stamps available: ${userStamps} (₦${stampValue} each)`;
  document.getElementById('discounted-total').textContent = finalTotal.toLocaleString();
  document.getElementById('stamp-discount').textContent = '0';
  orderTotalElement.textContent = `₦${finalTotal.toLocaleString()}`;

  const stampsInput = document.getElementById('stamps-to-use');
  const stampDiscountEl = document.getElementById('stamp-discount');
  const discountedTotalEl = document.getElementById('discounted-total');

  stampsInput.addEventListener('input', () => {
    stampsToUse = parseInt(stampsInput.value) || 0;
    if (stampsToUse > userStamps) {
      stampsToUse = userStamps;
      stampsInput.value = stampsToUse;
    }
    discount = stampsToUse * stampValue;
    finalTotal = Math.max(total - discount, 0);
    stampDiscountEl.textContent = discount.toLocaleString();
    discountedTotalEl.textContent = finalTotal.toLocaleString();
    orderTotalElement.textContent = `₦${finalTotal.toLocaleString()}`;
  });

  // Payment method toggle
  document.getElementById('payment').addEventListener('change', function () {
    document.getElementById('paystack-section').style.display = this.value === 'paystack' ? 'block' : 'none';
  });

  // Paystack payment
  function payWithPaystack(amount, email) {
    const handler = PaystackPop.setup({
      key: 'pk_test_c0a1552f20cb71f022580f19d91b20977293b913',
      email,
      amount: amount * 100,
      currency: 'NGN',
      ref: '' + Math.floor(Math.random() * 1000000000 + 1),
      callback: function (response) {
        submitOrder(response.reference);
      },
      onClose: function () {
        alert('Transaction was not completed, window closed.');
      }
    });
    handler.openIframe();
  }

  // Submit order
  async function submitOrder(paymentRef = null) {
    const fullName = document.getElementById('fullName').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const address = document.getElementById('address').value.trim();
    const payment = document.getElementById('payment').value;

    if (!fullName || !email || !phone || !address || !payment) {
      alert('Please fill in all required fields.');
      return;
    }

    const orderData = {
      fullName,
      email,
      address,
      phone,
      payment,
      items,
      total,
      appliedStamps: stampsToUse,
      finalAmount: finalTotal,
      paymentRef: paymentRef || null
    };

    try {
      const token = JSON.parse(localStorage.getItem('currentUser'))?.token;
      if (!token) throw new Error('User not authenticated');

      const response = await fetch('/api/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(orderData)
      });

      if (!response.ok) throw new Error('Failed to submit order');

      // Update stamps and order history
      localStorage.setItem('userStamps', JSON.stringify(userStamps - stampsToUse));
      const orderHistory = JSON.parse(localStorage.getItem('orderHistory')) || [];
      orderHistory.push({
        name: fullName,
        date: new Date().toLocaleString(),
        items,
        total: finalTotal
      });
      localStorage.setItem('orderHistory', JSON.stringify(orderHistory));
      localStorage.setItem('finalOrder', JSON.stringify({
        ...orderData,
        orderNumber: `ORD-${Math.floor(100000 + Math.random() * 900000)}`
      }));

      // Clear cart
      localStorage.removeItem('orderData');

      alert('Order placed successfully!');
      window.location.href = 'confirmation.html';
    } catch (error) {
      alert('Error submitting order: ' + error.message);
    }
  }

  // Paystack button
  document.getElementById('pay-btn').addEventListener('click', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value.trim();
    if (!email) {
      alert('Please enter an email address for payment.');
      return;
    }
    payWithPaystack(finalTotal, email);
  });

  // Form submission
  document.getElementById('checkout-form').addEventListener('submit', (e) => {
    e.preventDefault();
    if (document.getElementById('payment').value === 'paystack') {
      return; // Paystack handles submission in callback
    }
    submitOrder();
  });
});