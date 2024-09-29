const cart = new Map(JSON.parse(localStorage.getItem('cart')) || []);

// Update buttons, cart count, and total amount on page load
updateButtons();
updateCartCount();
updateTotalAmount();

document.querySelectorAll('.button').forEach(button => {
    button.addEventListener('click', function() {
        const productId = this.closest('.product').getAttribute('data-product-id');
        if (this.classList.contains('add-to-cart')) {
            addToCart(productId, this);
        } else if (this.classList.contains('remove-from-cart')) {
            removeFromCart(productId, this);
        }
    });
});

document.querySelectorAll('.additem').forEach(button => {
    button.addEventListener('click', function() {
        const productId = this.closest('.product').getAttribute('data-product-id');
        changeQuantity(productId, 1);
    });
});

document.querySelectorAll('.removeitem').forEach(button => {
    button.addEventListener('click', function() {
        const productId = this.closest('.product').getAttribute('data-product-id');
        changeQuantity(productId, -1);
    });
});

function addToCart(productId, button) {
    if (!cart.has(productId)) {
        cart.set(productId, 1);
    } else {
        cart.set(productId, cart.get(productId) + 1);
    }
    localStorage.setItem('cart', JSON.stringify(Array.from(cart.entries())));
    updateButton(button, 'remove-from-cart', 'Remove from Cart');
    updateQuantityDisplay(productId);
    updateCartCount();
    updateTotalAmount();
    updateCartModal();
}

function removeFromCart(productId, button) {
    if (cart.has(productId)) {
        cart.delete(productId);
        localStorage.setItem('cart', JSON.stringify(Array.from(cart.entries())));
        updateButton(button, 'add-to-cart', 'Add to Cart');
        updateQuantityDisplay(productId);
        updateCartCount();
        updateTotalAmount();
        updateCartModal();
    }
}

function changeQuantity(productId, amount) {
    if (cart.has(productId)) {
        let newQuantity = cart.get(productId) + amount;
        if (newQuantity <= 0) {
            cart.delete(productId);
        } else {
            cart.set(productId, newQuantity);
        }
        localStorage.setItem('cart', JSON.stringify(Array.from(cart.entries())));
        updateQuantityDisplay(productId);
        updateCartCount();
        updateTotalAmount();
        updateCartModal();
    }
}

function updateButton(button, newClass, newText) {
    button.classList.remove('add-to-cart', 'remove-from-cart');
    button.classList.add(newClass);
    button.textContent = newText;
}

function updateButtons() {
    document.querySelectorAll('.button').forEach(button => {
        const productId = button.closest('.product').getAttribute('data-product-id');
        if (cart.has(productId)) {
            updateButton(button, 'remove-from-cart', 'Remove from Cart');
        } else {
            updateButton(button, 'add-to-cart', 'Add to Cart');
        }
    });
}

function updateQuantityDisplay(productId) {
    const productElement = document.querySelector(`.product[data-product-id="${productId}"]`);
    if (productElement) {
        const quantityDisplay = productElement.querySelector('.quantity');
        if (quantityDisplay) {
            quantityDisplay.textContent = cart.get(productId) || 0;
        } else {
            const quantityDisplay = document.createElement('span');
            quantityDisplay.className = 'quantity';
            quantityDisplay.textContent = cart.get(productId) || 0;
            productElement.appendChild(quantityDisplay);
        }
    }
}

function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        cartCount.textContent = Array.from(cart.values()).reduce((acc, quantity) => acc + quantity, 0);
    }
}

function updateTotalAmount() {
    const totalAmountDisplay = document.getElementById('total-amount');
    if (totalAmountDisplay) {
        let totalAmount = 0;
        cart.forEach((quantity, productId) => {
            const productElement = document.querySelector(`.product[data-product-id="${productId}"]`);
            if (productElement) {
                const priceText = productElement.querySelector('.price').textContent.replace('Price : ₹', '').replace(',', '');
                const price = parseFloat(priceText);
                totalAmount += price * quantity;
            }
        });
        totalAmountDisplay.textContent = `Total Amount: ₹${totalAmount.toFixed(2)}`;
    }
}

function updateCartModal() {
    const cartItemsContainer = document.getElementById('cart-items');
    if (cart.size === 0) {
        cartItemsContainer.innerHTML = 'Your cart is empty.';
        return;
    }

    cartItemsContainer.innerHTML = ''; // Clear existing content
    const table = document.createElement('table');
    table.className = 'table text-center';
    table.innerHTML = `
        <thead>
            <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Sub-Total</th>
            </tr>
        </thead>
        <tbody></tbody>
    `;
    cartItemsContainer.appendChild(table);

    const tbody = table.querySelector('tbody');

    cart.forEach((quantity, productId) => {
        const productElement = document.querySelector(`.product[data-product-id="${productId}"]`);
        if (productElement) {
            const productName = productElement.querySelector('h5').textContent;
            const productPriceText = productElement.querySelector('.price').textContent.replace('Price : ₹', '').replace(',', '');
            const productPrice = parseFloat(productPriceText);
            const subtotal = productPrice * quantity;

            const row = document.createElement('tr');
            row.innerHTML = `
                <td><img src="${productElement.querySelector('img').src}" alt="${productName}" style="width: 50px; height: auto;"> ${productName}</td>
                <td>₹${productPrice.toFixed(2)}</td>
                <td>${quantity}</td>
                <td>₹${subtotal.toFixed(2)}</td>
            `;
            tbody.appendChild(row);
        }
    });

    updateTotalAmount();
}

const modal = document.getElementById("myModal");
const btn = document.getElementById("myBtn");
const span = document.getElementsByClassName("close")[0];
const clearCartBtn = document.getElementById('clearcart');
const goToShopBtn = document.getElementById('gotocart');

btn.onclick = function() {
    modal.style.display = "block";
    updateCartModal();
}

span.onclick = function() {
    modal.style.display = "none";
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

goToShopBtn.onclick = function() {
    modal.style.display = "none";
};

clearCartBtn.onclick = function() {
    cart.clear();
    localStorage.removeItem('cart');
    updateButtons();
    updateCartCount();
    updateTotalAmount();
    updateCartModal();
};
