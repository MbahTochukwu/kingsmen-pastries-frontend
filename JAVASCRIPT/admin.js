document.addEventListener("DOMContentLoaded", () => {
  const totalOrdersTodayEl = document.getElementById ("total-orders-today");
  const totalOrdersWeekEl = document.getElementById("total-orders-week");
  const bestSellingTodayEl = document.getElementById("best-selling-today");
  const bestSellingWeekEl = document.getElementById("best-selling-week");
  const totalSalesEl = document.getElementById("total-sales");
  const bestSellingItemEl = document.getElementById("best-selling-item");
  const ordersTableBody = document.querySelector("#orders-table tbody");
  const searchInput = document.getElementById("order-search");
  const notificationDiv = document.getElementById("notification");

  const fetchOrders = async () => {
    try {
      const res = await fetch("https://kingsmen-pastries-backend.onrender.com/api/orders");
      const data = await res.json();
      return data;
    } catch (err) {
      console.error("Error fetching orders:", err);
      return [];
    }
  };

  const renderDashboard = async () => {
    const history = await fetchOrders();

    // === Statistics Calculation ===
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());

    let ordersToday = 0;
    let ordersThisWeek = 0;
    let totalSales = 0;
    const itemsToday = {};
    const itemsWeek = {};
    const itemsAll = {};

    history.forEach(order => {
      const orderDate = new Date(order.date);
      totalSales += Number(order.total) || 0;

      // Today
      if (orderDate.toDateString() === today.toDateString()) {
        ordersToday++;
        order.items.forEach(item => {
          itemsToday[item.item] = (itemsToday[item.item] || 0) + item.qty;
        });
      }

      // This week
      if (orderDate >= startOfWeek && orderDate <= today) {
        ordersThisWeek++;
        order.items.forEach(item => {
          itemsWeek[item.item] = (itemsWeek[item.item] || 0) + item.qty;
        });
      }

      // All time
      order.items.forEach(item => {
        itemsAll[item.item] = (itemsAll[item.item] || 0) + item.qty;
      });
    });

    // === Best selling logic ===
    const getBestSelling = (itemsObj) => {
      const keys = Object.keys(itemsObj);
      if (!keys.length) return "N/A";
      return keys.reduce((a, b) => itemsObj[a] > itemsObj[b] ? a : b);
    };

    // === Update Stats UI ===
    totalOrdersTodayEl.textContent = `Total Orders Today: ${ordersToday}`;
    totalOrdersWeekEl.textContent = `Total Orders This Week: ${ordersThisWeek}`;
    bestSellingTodayEl.textContent = `Best Selling Today: ${getBestSelling(itemsToday)}`;
    bestSellingWeekEl.textContent = `Best Selling This Week: ${getBestSelling(itemsWeek)}`;
    totalSalesEl.textContent = `Total Sales: ₦${totalSales}`;
    bestSellingItemEl.textContent = `Best Selling Item: ${getBestSelling(itemsAll)}`;

    // === Render Table ===
    ordersTableBody.innerHTML = "";
    if (history.length === 0) {
      ordersTableBody.innerHTML = `<tr><td colspan="8">No orders found.</td></tr>`;
    } else {
      history.forEach((order, index) => {
        const row = document.createElement("tr");
        const itemsList = order.items.map(item =>
          `${item.item} x${item.qty} (₦${item.total})`
        ).join("<br>");

        row.innerHTML = `
          <td>${index + 1}</td>
          <td>${order.customerName}</td>
          <td>${itemsList}</td>
          <td>${order.total}</td>
          <td>${order.address || "N/A"}</td>
          <td>${order.phone || "N/A"}</td>
          <td>${new Date(order.date).toLocaleString()}</td>
          <td>${order.status || "Pending"}</td>
          <td>
            <button class="fulfill-btn" data-id="${order._id}">Mark Fulfilled</button>
            <button class="delete-btn" data-id="${order._id}">Delete</button>
          </td>
        `;
        ordersTableBody.appendChild(row);
      });
    }

   
document.querySelectorAll('.fulfill-btn').forEach(button => {
  button.addEventListener('click', async (e) => {
    const orderId = e.target.dataset.id;

    const confirmFulfill = confirm("Mark this order as fulfilled?");
    if (!confirmFulfill) return;

    try {
      const res = await fetch(`https://kingsmen-pastries-backend.onrender.com/api/orders/${orderId}/fulfill`, {
        method: 'PATCH'
      });

      const data = await res.json();
      if (res.ok) {
        alert("Order marked as fulfilled!");
        location.reload();
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Error fulfilling order");
    }
  });
});


document.querySelectorAll('.delete-btn').forEach(button => {
  button.addEventListener('click', async (e) => {
    const orderId = e.target.dataset.id;

    const confirmDelete = confirm("Are you sure you want to delete this order?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`https://kingsmen-pastries-backend.onrender.com/api/orders/${orderId}`, {
        method: 'DELETE'
      });

      const data = await res.json();
      if (res.ok) {
        alert("Order deleted successfully!");
        location.reload();
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting order");
    }
  });
});



    // === Charts ===
    generateCharts(itemsAll);
  };

  // === Real-time Search ===
  searchInput.addEventListener("keyup", function () {
    const filter = searchInput.value.toLowerCase();
    const rows = ordersTableBody.querySelectorAll("tr");
    rows.forEach(row => {
      const name = row.children[1]?.textContent.toLowerCase() || "";
      const date = row.children[5]?.textContent.toLowerCase() || "";
      row.style.display = (name.includes(filter) || date.includes(filter)) ? "" : "none";
    });
  });

  // === Initialize ===
  renderDashboard();
});

// === Chart for Best Selling Items ===
function generateCharts(itemSales) {
  const items = Object.keys(itemSales);
  const quantities = Object.values(itemSales);

  const ctx = document.getElementById('bestSellingChart').getContext('2d');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: items,
      datasets: [{
        label: 'Quantity Sold',
        data: quantities,
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        borderColor: 'red',
        borderWidth: 1
      }]
    },
    options: { responsive: true, scales: { y: { beginAtZero: true } } }
  });

  const ctxPie = document.getElementById('salesPieChart').getContext('2d');
  new Chart(ctxPie, {
    type: 'pie',
    data: {
      labels: items,
      datasets: [{
        data: quantities,
        backgroundColor: ['#FF6384','#36A2EB','#FFCE56','#8AFF33','#FF33F6','#33FFF3','#FF5733'],
        borderWidth: 1
      }]
    },
    options: { responsive: true }
  });
}


document.getElementById("logout-btn").addEventListener("click", () => {
  localStorage.removeItem("adminLoggedIn");
  window.location.href = "admin-login.html";
});
