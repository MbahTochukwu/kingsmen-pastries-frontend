document.addEventListener("DOMContentLoaded", () => {
  const ordersList = document.getElementById("orders-container");
  const history = JSON.parse(localStorage.getItem("orderHistory")) || [];

  if (history.length === 0) {
    ordersList.innerHTML = "<p>No order history found.</p>";
    return;
  }

  history.forEach((order, index) => {
    // Use 'items' instead of 'orders'
    if (!order.items || !Array.isArray(order.items)) return;

    const orderNumber = 1000 + index; // Start from 1000 and increment by index
    const orderDiv = document.createElement("div");
    orderDiv.className = "order-entry";

    const itemsList = order.items.map(item =>
      `<li>${item.item} x${item.qty} - ₦${item.total || item.price * item.qty}</li>`
    ).join("");

    orderDiv.innerHTML = `
      <h3>Order #${orderNumber}</h3>
      <p><strong>Name:</strong> ${order.customerName || order.name || "N/A"}</p>
      <p><strong>Date:</strong> ${order.date || "N/A"}</p>
      <p><strong>Address:</strong> ${order.address || "N/A"}</p>
      <ul>${itemsList}</ul>
      <p><strong>Total:</strong> ₦${order.total || order.grandTotal || "N/A"}</p>
      <button class="reorder-btn" data-index="${index}">Re-order</button>
    `;

    ordersList.appendChild(orderDiv);
  });

  document.querySelectorAll('.reorder-btn').forEach(button => {
    button.addEventListener('click', (e) => {
      const index = e.target.dataset.index;
      const order = history[index];

      // Use 'items' instead of 'orders'
      const prefillOrder = order.items.map(item => ({
        item: item.item,
        price: item.price,
        qty: item.qty
      }));

      localStorage.setItem("reorderData", JSON.stringify(prefillOrder));
      localStorage.setItem("userName", order.customerName || order.name || "");
      localStorage.setItem("address", order.address || "");

      window.location.href = "order.html";
    });
  });
});