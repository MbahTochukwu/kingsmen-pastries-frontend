document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("order-form");
  const addSectionBtn = document.getElementById("add-section");
  const orderSectionsWrapper = document.getElementById("order-sections");
  const totalPriceSpan = document.getElementById("total-price");

  function calculateTotal() {
    let total = 0;
    document.querySelectorAll(".order-section").forEach(section => {
      const itemSelect = section.querySelector("select[name='item[]']");
      const quantityInput = section.querySelector("input[name='quantity[]']");
      const price = parseInt(itemSelect.selectedOptions[0]?.dataset.price || 0);
      const qty = parseInt(quantityInput.value || 0);
      total += price * qty;
    });
    totalPriceSpan.textContent = total;
    return total;
  }

  function addNewOrderSection() {
    const firstSection = document.querySelector(".order-section");
    const newSection = firstSection.cloneNode(true);

    newSection.querySelector("select[name='item[]']").selectedIndex = 0;
    newSection.querySelector("input[name='quantity[]']").value = 1;

    newSection.querySelector(".remove-section").addEventListener("click", () => {
      newSection.remove();
      calculateTotal();
    });

    newSection.querySelector("select[name='item[]']").addEventListener("change", calculateTotal);
    newSection.querySelector("input[name='quantity[]']").addEventListener("input", calculateTotal);

    orderSectionsWrapper.appendChild(newSection);
  }

  document.querySelectorAll(".remove-section").forEach(button => {
    button.addEventListener("click", (e) => {
      const section = e.target.closest(".order-section");
      section.remove();
      calculateTotal();
    });
  });

  document.querySelectorAll("select[name='item[]']").forEach(select => {
    select.addEventListener("change", calculateTotal);
  });

  document.querySelectorAll("input[name='quantity[]']").forEach(input => {
    input.addEventListener("input", calculateTotal);
  });

  addSectionBtn.addEventListener("click", () => {
    addNewOrderSection();
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("userName").value.trim();
    const address = document.getElementById("address").value.trim();
    const phone = document.getElementById("phone").value.trim();

    const orders = [];
    document.querySelectorAll(".order-section").forEach(section => {
      const itemSelect = section.querySelector("select[name='item[]']");
      const quantityInput = section.querySelector("input[name='quantity[]']");

      const item = itemSelect.value;
      const price = parseInt(itemSelect.selectedOptions[0].dataset.price);
      const qty = parseInt(quantityInput.value);

      orders.push({ item, price, qty, total: price * qty });
    });

    const grandTotal = orders.reduce((sum, item) => sum + item.total, 0);

    const orderData = {
      customerName: name,
      address,
      phone,
      items: orders,
      total: grandTotal,
      paymentMethod: "pay-on-delivery"
    };


 try {
    const response = await fetch("https://kingsmen-pastries-backend.onrender.com/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(orderData)
    });

    if (!response.ok) throw new Error("Failed to place order");

    const result = await response.json();
    console.log("Order saved to DB:", result);

  } catch (error) {
    console.error(error);
    alert("There was an error placing your order. Please try again.");
    return; 
  }



    localStorage.setItem("orderData", JSON.stringify(orderData));

    const history = JSON.parse(localStorage.getItem("orderHistory")) || [];
    history.push(orderData);
    localStorage.setItem("orderHistory", JSON.stringify(history));

    window.location.href = "checkout.html";
  });

  calculateTotal();
});
