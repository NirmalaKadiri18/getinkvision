let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Add to cart with quantity
function addToCart(name, price) {
  let existing = cart.find(item => item.name === name);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ name, price, quantity: 1 });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  alert(name + " added to cart!");
}

// Increase quantity
function increaseQty(index) {
  cart[index].quantity += 1;
  localStorage.setItem("cart", JSON.stringify(cart));
  loadCart();
}

// Decrease quantity
function decreaseQty(index) {
  if (cart[index].quantity > 1) {
    cart[index].quantity -= 1;
  } else {
    cart.splice(index, 1);
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  loadCart();
}

// Load cart
function loadCart() {
  let cartItems = document.getElementById("cart-items");
  let total = 0;

  if (!cartItems) return;

  cartItems.innerHTML = "";

  cart.forEach((item, index) => {
    let li = document.createElement("li");

    li.innerHTML = `
      <div class="cart-row">
        <span>${item.name} - Rs ${item.price}</span>
        
        <div class="qty">
          <button onclick="decreaseQty(${index})">-</button>
          <span>${item.quantity}</span>
          <button onclick="increaseQty(${index})">+</button>
        </div>
      </div>
    `;

    cartItems.appendChild(li);
    total += item.price * item.quantity;
  });

  document.getElementById("total").textContent = "Total: Rs " + total;
}

window.onload = loadCart;