// ==============================
// Global State
// ==============================
let currentProduct = null;

// ==============================
// DOM Caching
// ==============================
const DOM = {
  modal: document.getElementById("myModal"),
  modalTitle: document.getElementById("modalTitle"),
  modalPrice: document.getElementById("modalPrice"),
  modalDescription: document.getElementById("modalDescription"),
  modalImage: document.getElementById("modalImage"),
  colorContainer: document.getElementById("colorContainer"),
  sizeDropdownBtn: document.getElementById("sizeDropdownBtn"),
  sizeDropdownList: document.getElementById("sizeDropdownList"),
  cartDrawer: document.getElementById("cartDrawer"),
  cartItemsContainer: document.getElementById("cartItems"),
  closeCartBtn: document.getElementById("closeCart"),
  addToCartBtn: document.getElementById("addToCartBtn"),
};

// ==============================
// Utility Functions
// ==============================

/**
 * Fetch JSON data safely
 * @param {string} url
 * @returns {Promise<any>}
 */
async function fetchJSON(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return await res.json();
  } catch (error) {
    console.error(`Fetch failed: ${url}`, error);
    throw error;
  }
}

// ==============================
// Modal Manager
// ==============================
const ModalManager = {
  open() {
    if (DOM.modal) DOM.modal.style.display = "block";
  },
  close() {
    if (DOM.modal) DOM.modal.style.display = "none";
  },
};

// ==============================
// Cart Drawer Manager
// ==============================
const CartDrawerManager = {
  async open() {
    try {
      const cart = await fetchJSON("/cart.js");
      DOM.cartItemsContainer.innerHTML = "";

      const fragment = document.createDocumentFragment();

      cart.items.forEach((item) => {
        const cartItemEl = document.createElement("div");
        cartItemEl.className = "cart-item";

        cartItemEl.innerHTML = `
          <img src="${item.image}" alt="${item.product_title}" />
          <div class="cart-item-details">
            <h4>${item.product_title}</h4>
            <p>Qty: ${item.quantity}</p>
            <p>${(item.price / 100).toFixed(2)} €</p>
          </div>
        `;
        fragment.appendChild(cartItemEl);
      });

      DOM.cartItemsContainer.appendChild(fragment);
      DOM.cartDrawer.classList.add("active");
    } catch (err) {
      console.error("Error opening cart drawer:", err);
    }
  },
  close() {
    DOM.cartDrawer.classList.remove("active");
  },
};

// ==============================
// Modal: Render Product Data
// ==============================
function renderProductModal(product) {
  // Fill basic product info
  DOM.modalTitle.textContent = product.title;
  DOM.modalPrice.textContent = (product.price / 100).toFixed(2) + " €";
  DOM.modalDescription.innerHTML = product.description;
  DOM.modalImage.src = product.images[0] || "";

  // ------------------------------
  // Colors Section
  // ------------------------------
  DOM.colorContainer.innerHTML = "";
  const colorOption = product.options.find(
    (opt) => opt.name.toLowerCase() === "color"
  );

  if (colorOption) {
    DOM.colorContainer.style.setProperty("--count", colorOption.values.length);

    // Add color indicator
    const colorIndicator = document.createElement("div");
    colorIndicator.className = "color-indicator";
    DOM.colorContainer.appendChild(colorIndicator);

    colorOption.values.forEach((color, i) => {
      const colorBtnEl = document.createElement("button");
      colorBtnEl.textContent = color;
      colorBtnEl.className = "color-btn";
      colorBtnEl.style.setProperty("--color", color.toLowerCase());

      if (i === 0) colorBtnEl.classList.add("active");

      colorBtnEl.addEventListener("click", () => {
        const allColorBtns = [...document.querySelectorAll(".color-btn")];
        const prevIndex = allColorBtns.findIndex((b) =>
          b.classList.contains("active")
        );

        // Switch active button
        allColorBtns.forEach((b) => b.classList.remove("active"));
        colorBtnEl.classList.add("active");

        // Move indicator
        colorIndicator.style.transform = `translateX(${i * 100}%)`;

        // Optional animation if black
        if (color.toLowerCase() === "black" && i > prevIndex) {
          colorBtnEl.style.animation = "slideRight 0.4s ease";
          colorBtnEl.addEventListener(
            "animationend",
            () => (colorBtnEl.style.animation = ""),
            { once: true }
          );
        }
      });

      DOM.colorContainer.appendChild(colorBtnEl);
    });
  }

  // ------------------------------
  // Sizes Dropdown Section
  // ------------------------------
  DOM.sizeDropdownList.innerHTML = "";
  const sizeOption = product.options.find(
    (opt) => opt.name.toLowerCase() === "size"
  );

  if (sizeOption) {
    sizeOption.values.forEach((size) => {
      const sizeBtnEl = document.createElement("button");
      sizeBtnEl.textContent = size;

      sizeBtnEl.addEventListener("click", () => {
        const labelSpan = DOM.sizeDropdownBtn.querySelector(".label");
        labelSpan.textContent = size;
        DOM.sizeDropdownBtn.classList.add("size-selected");

        DOM.sizeDropdownList.classList.remove("open");
        DOM.sizeDropdownBtn.classList.remove("active");
      });

      DOM.sizeDropdownList.appendChild(sizeBtnEl);
    });
  }
}

// ==============================
// Event Handlers
// ==============================

async function showProductModal(handle) {
  try {
    const product = await fetchJSON(`/products/${handle}.js`);
    currentProduct = product;
    renderProductModal(product);
    ModalManager.open();
  } catch (err) {
    console.error("Error opening product modal:", err);
  }
}

async function handleAddToCart() {
  if (!currentProduct) {
    alert("No product selected");
    return;
  }

  const selectedColorBtn = document.querySelector(".color-btn.active");
  const selectedColor = selectedColorBtn?.textContent || null;

  const labelSpan = DOM.sizeDropdownBtn.querySelector(".label");
  const selectedSize =
    labelSpan?.textContent !== "Choose your size" ? labelSpan?.textContent : null;

  if (!selectedSize) {
    alert("Please select a size");
    return;
  }
  if (!selectedColor) {
    alert("Please select a Color");
    return;
  }

  const selectedVariant = currentProduct.variants.find(
    (v) =>
      v.option1?.toLowerCase() === selectedSize.toLowerCase() &&
      v.option2?.toLowerCase() === selectedColor.toLowerCase()
  );

  if (!selectedVariant) {
    alert("Please select all options");
    return;
  }

  //  Add main product
  fetch("/cart/add.js", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ id: selectedVariant.id, quantity: 1 }),
  })
    .then((res) => res.json())
    .then(async () => {
      // Bonus product condition
      if (
        selectedColor?.toLowerCase() === "black" &&
        selectedSize?.toLowerCase() === "m"
      ) {
        try {
          const bonusProduct = await fetchJSON("/products/dark-winter-jacket.js");
          const bonusVariant = bonusProduct.variants.find(
            (v) =>
              v.option1?.toLowerCase() === "m" &&
              v.option2?.toLowerCase() === "black"
          );

          if (bonusVariant) {
            await fetch("/cart/add.js", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
              },
              body: JSON.stringify({ id: bonusVariant.id, quantity: 1 }),
            });
            console.log("✅ Bonus Winter Jacket added automatically!");
          }
        } catch (err) {
          console.error("Error adding bonus product:", err);
        }
      }

      ModalManager.close();
      CartDrawerManager.open();

      // Reset size button to default
      const labelSpan = DOM.sizeDropdownBtn.querySelector(".label");
      if (labelSpan) labelSpan.textContent = "Choose your size";
      DOM.sizeDropdownBtn.classList.remove("size-selected");
    })
    .catch((err) => console.error("Error adding to cart:", err));
}

// ==============================
// Init Event Listeners
// ==============================
document.addEventListener("DOMContentLoaded", () => {
  // Product plus buttons
  document.querySelectorAll(".plus-btn").forEach((plusBtnEl) => {
    plusBtnEl.addEventListener("click", () =>
      showProductModal(plusBtnEl.dataset.handle)
    );
  });

  // Cart drawer close
  DOM.closeCartBtn.addEventListener("click", CartDrawerManager.close);

  // Size dropdown toggle
  DOM.sizeDropdownBtn.addEventListener("click", () => {
    DOM.sizeDropdownList.classList.toggle("open");
    DOM.sizeDropdownBtn.classList.toggle("active");
  });

  // Add to cart
  DOM.addToCartBtn.addEventListener("click", handleAddToCart);

  // Close modal: X button
  document.querySelector(".closeFromSvg").addEventListener("click", ModalManager.close);

  // Close modal: ESC key
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") ModalManager.close();
  });

  // Close modal: click outside
  window.addEventListener("click", (e) => {
    if (e.target === DOM.modal) ModalManager.close();
  });
});
