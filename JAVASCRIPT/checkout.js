document.addEventListener('DOMContentLoaded', () => {
  const data = JSON.parse(localStorage.getItem('orderData')) || {};
  const { customerName = "", address = "", phone = "", items = [], total = 0 } = data;

  document.getElementById('fullName').value = customerName;
  document.getElementById('address').value = address;
  document.getElementById('phone').value = phone;

  const orderItemsContainer = document.getElementById('order-items');
  const orderTotalElement = document.getElementById('order-total');

  items.forEach(item => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${item.item}</td>
      <td>${item.qty}</td>
      <td>₦${item.price * item.qty}</td>
    `;
    orderItemsContainer.appendChild(row);
  });

  orderTotalElement.textContent = `₦${total}`;

  document.getElementById('checkout-form').addEventListener('submit', (e) => {
    e.preventDefault();

    const fullName = document.getElementById('fullName').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const address = document.getElementById('address').value.trim();
    const payment = document.getElementById('payment').value;

    if (!fullName || !phone || !address || !payment) {
      alert('Please fill in all required fields.');
      return;
    }

    const orderData = {
      fullName,
      phone,
      address,
      payment,
      items,
      total,
      orderNumber: `ORD-${Math.floor(100000 + Math.random() * 900000)}`
    };

    localStorage.setItem('finalOrder', JSON.stringify(orderData));

    const orderHistory = JSON.parse(localStorage.getItem('orderHistory')) || [];
    orderHistory.push({
      name: fullName,
      date: new Date().toLocaleString(),
      items: items,
      total: total
    });
    localStorage.setItem('orderHistory', JSON.stringify(orderHistory));

    alert("Your order has been placed successfully!");
    window.location.href = 'confirmation.html';
  });

  document.getElementById("payment").addEventListener("change", function(){
    const paystackSection = document.getElementById("paystack-section");
    if(this.value === "paystack"){
      paystackSection.style.display = "block";
    } else {
      paystackSection.style.display = "none";
    }
  });
});

function payWithPaystack(amount, email) {
  let handler = PaystackPop.setup({
    key: 'pk_test_c0a1552f20cb71f022580f19d91b20977293b913', 
    email: email,
    amount: amount * 100, 
    currency: "NGN",
    ref: '' + Math.floor(Math.random() * 1000000000 + 1),
    callback: function(response) {
      alert('Payment successful. Reference: ' + response.reference);
    },
    onClose: function() {
      alert('Transaction was not completed, window closed.');
    }
  });
  handler.openIframe();
}

document.getElementById("pay-btn").addEventListener("click", function(e){
  e.preventDefault();
  const email = document.getElementById("email")?.value || "test@example.com";
  const data = JSON.parse(localStorage.getItem('orderData')) || {};
  const totalAmount = data.total || 0;
  payWithPaystack(totalAmount, email);
});
