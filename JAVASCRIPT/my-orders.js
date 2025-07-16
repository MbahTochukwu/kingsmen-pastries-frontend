document.addEventListener("DOMContentLoaded", () => {
  const ordersList = document.getElementById("orders-list");
  const history = JSON.parse(localStorage.getItem("orderHistory")) || [];

  if (history.length === 0) {
    ordersList.innerHTML = "<p>No order history found.</p>";
    return;
  }

  history.forEach((order, index) => {
    if (!order.orders || !Array.isArray(order.orders)) return; 

    const orderNumber = index + 1;
    const orderDiv = document.createElement("div");
    orderDiv.className = "order-entry";

    const itemsList = order.orders.map(item =>
      `<li>${item.item} x${item.qty} - ₦${item.total}</li>`
    ).join("");

    orderDiv.innerHTML = `
      <h3>Order #${orderNumber}</h3>
      <p><strong>Name:</strong> ${order.customerName}</p>
      <p><strong>Date:</strong> ${order.date}</p>
      <p><strong>Address:</strong> ${order.address || "N/A"}</p>
      <ul>${itemsList}</ul>
      <p><strong>Total:</strong> ₦${order.grandTotal}</p>
      <button class="reorder-btn" data-index="${index}">Re-order</button>
    `;

    ordersList.appendChild(orderDiv);
  });

  
  document.querySelectorAll('.reorder-btn').forEach(button => {
    button.addEventListener('click', (e) => {
      const index = e.target.dataset.index;
      const order = history[index];

     
      const prefillOrder = order.orders.map(item => ({
        item: item.item,
        price: item.price,
        qty: item.qty
      }));

      localStorage.setItem("reorderData", JSON.stringify(prefillOrder));
      localStorage.setItem("userName", order.customerName);
      localStorage.setItem("address", order.address);

      window.location.href = "order.html";
    });
  });
});