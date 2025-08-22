  // ==============================
  // Global State
  // ==============================
  let currentProduct = null;

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

  /**
   * Close modal safely
   */
  function closeModal() {
    const modal = document.getElementById("myModal");
    if (modal) modal.style.display = "none";
  }

  /**
   * Open modal safely
   */
  function openModal() {
    const modal = document.getElementById("myModal");
    if (modal) modal.style.display = "block";
  }

  // ==============================
  // Cart Drawer Handling
  // ==============================

  async function openCartDrawer() {
    try {
      const cart = await fetchJSON("/cart.js");

      const cartItemsContainer = document.getElementById("cartItems");
      cartItemsContainer.innerHTML = "";

      cart.items.forEach((item) => {
        const div = document.createElement("div");
        div.className = "cart-item";

        div.innerHTML = `
          <img src="${item.image}" alt="${item.product_title}" />
          <div class="cart-item-details">
            <h4>${item.product_title}</h4>
            <p>Qty: ${item.quantity}</p>
            <p>${(item.price / 100).toFixed(2)} €</p>
          </div>
        `;

        cartItemsContainer.appendChild(div);
      });

      document.getElementById("cartDrawer").classList.add("active");
    } catch (err) {
      console.error("Error opening cart drawer:", err);
    }
  }

  function closeCartDrawer() {
    document.getElementById("cartDrawer").classList.remove("active");
  }

  // ==============================
  // Modal: Render Product Data
  // ==============================

  function renderProductModal(product) {
    // Cache DOM references
    const modalTitle = document.getElementById("modalTitle");
    const modalPrice = document.getElementById("modalPrice");
    const modalDescription = document.getElementById("modalDescription");
    const modalImage = document.getElementById("modalImage");
    const colorContainer = document.getElementById("colorContainer");
    const sizeDropdownList = document.getElementById("sizeDropdownList");

    // Fill basic product info
    modalTitle.textContent = product.title;
    modalPrice.textContent = (product.price / 100).toFixed(2) + " €";
    modalDescription.innerHTML = product.description;
    modalImage.src = product.images[0] || "";

    // ------------------------------
    // Colors Section
    // ------------------------------
    colorContainer.innerHTML = "";
    const colorOption = product.options.find(
      (opt) => opt.name.toLowerCase() === "color"
    );

    if (colorOption) {
      colorContainer.style.setProperty("--count", colorOption.values.length);

      // Add color indicator
      const indicator = document.createElement("div");
      indicator.className = "color-indicator";
      colorContainer.appendChild(indicator);

      colorOption.values.forEach((color, i) => {
        const colorBtn = document.createElement("button");
        colorBtn.textContent = color;
        colorBtn.className = "color-btn";
        colorBtn.style.setProperty("--color", color.toLowerCase());

        if (i === 0) colorBtn.classList.add("active");

        colorBtn.addEventListener("click", () => {
          const buttons = [...document.querySelectorAll(".color-btn")];
          const prevIndex = buttons.findIndex((b) =>
            b.classList.contains("active")
          );

          // Switch active button
          buttons.forEach((b) => b.classList.remove("active"));
          colorBtn.classList.add("active");

          // Move indicator
          indicator.style.transform = `translateX(${i * 100}%)`;

          // Optional animation if black
          if (color.toLowerCase() === "black" && i > prevIndex) {
            colorBtn.style.animation = "slideRight 0.4s ease";
            colorBtn.addEventListener(
              "animationend",
              () => (colorBtn.style.animation = ""),
              { once: true }
            );
          }
        });

        colorContainer.appendChild(colorBtn);
      });
    }

    // ------------------------------
    // Sizes Dropdown Section
    // ------------------------------
    sizeDropdownList.innerHTML = "";
    const sizeOption = product.options.find(
      (opt) => opt.name.toLowerCase() === "size"
    );

    if (sizeOption) {
      sizeOption.values.forEach((size) => {
        const btn = document.createElement("button");
        btn.textContent = size;

        btn.addEventListener("click", () => {
          const sizeBtn = document.getElementById("sizeDropdownBtn");
          sizeBtn.textContent = size;
          sizeDropdownList.classList.remove("open");
          sizeBtn.classList.remove("active");
        });

        sizeDropdownList.appendChild(btn);
      });
    }
  }

  // ==============================
  // Event Handlers
  // ==============================

  async function handleProductClick(handle) {
    try {
      const product = await fetchJSON(`/products/${handle}.js`);
      currentProduct = product;
      renderProductModal(product);
      openModal();
    } catch (err) {
      console.error("Error opening product modal:", err);
    }
  }

  function handleAddToCart() {
    if (!currentProduct) {
      alert("No product selected");
      return;
    }

    const selectedColorBtn = document.querySelector(".color-btn.active");
    const selectedColor = selectedColorBtn?.textContent || null;

    const selectedSize =
      document.getElementById("sizeDropdownBtn").textContent !==
      "Choose your size"
        ? document.getElementById("sizeDropdownBtn").textContent
        : null;

    const selectedVariant = currentProduct.variants.find(
      (v) =>
        (!selectedColor || v.options.includes(selectedColor)) &&
        (!selectedSize || v.options.includes(selectedSize))
    );

    if (!selectedVariant) {
      alert("Please select options");
      return;
    }

    // Add product to cart
    // fetch("/cart/add.js", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json", Accept: "application/json" },
    //   body: JSON.stringify({ id: selectedVariant.id, quantity: 1 }),
    // })
    //   .then((res) => res.json())
    //   .then(() => {
    //     closeModal();
    //     openCartDrawer();
    //   })
    //   .catch((err) => console.error("Error adding to cart:", err));
    // Add product to cart
fetch("/cart/add.js", {
  method: "POST",
  headers: { 
    "Content-Type": "application/json", 
    Accept: "application/json" 
  },
  body: JSON.stringify({ id: selectedVariant.id, quantity: 1 }),
})
  .then((res) => res.json())
  .then(async () => {
    // ✅ Check condition: if selectedColor = Black and selectedSize = Medium
    console.log("Selected Color:", selectedColor);
console.log("Selected Size:", selectedSize);

    if (
      selectedColor?.toLowerCase() === "black" &&
      selectedSize?.toLowerCase() === "m"
    ) {
      try {
        // Fetch the Soft Winter Jacket product
        // const jacket = await fetchJSON("/products/soft-winter-jacket.js");
        const jacket = await fetchJSON("/products/dark-winter-jacket.js");
        const jacketVariant = jacket.variants[0]; // هنا ممكن تحدد Variant معين لو عنده أكتر من خيار

        if (jacketVariant) {
          // Add the jacket to cart
          await fetch("/cart/add.js", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify({ id: jacketVariant.id, quantity: 1 }),
          });
        }
      } catch (err) {
        console.error("Error adding Soft Winter Jacket:", err);
      }
    }

    // ✅ افتح الـ Drawer بعد ما تخلص كل حاجة
    closeModal();
    await openCartDrawer();
  })
  .catch((err) => console.error("Error adding to cart:", err));

  }

  // ==============================
  // Init Event Listeners
  // ==============================
  document.addEventListener("DOMContentLoaded", () => {
    // Product plus buttons
    document.querySelectorAll(".plus-btn").forEach((btn) => {
      btn.addEventListener("click", () =>
        handleProductClick(btn.dataset.handle)
      );
    });

    // Cart drawer close
    document.getElementById("closeCart").addEventListener("click", closeCartDrawer);

    // Size dropdown toggle
    document
      .getElementById("sizeDropdownBtn")
      .addEventListener("click", () => {
        const list = document.getElementById("sizeDropdownList");
        const btn = document.getElementById("sizeDropdownBtn");
        list.classList.toggle("open");
        btn.classList.toggle("active");
      });

    // Add to cart
    document
      .getElementById("addToCartBtn")
      .addEventListener("click", handleAddToCart);

    // Close modal: X button
    document
      .querySelector(".closeFromSvg")
      .addEventListener("click", closeModal);

    // Close modal: ESC key
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeModal();
    });

    // Close modal: click outside
    window.addEventListener("click", (e) => {
      const modal = document.getElementById("myModal");
      if (e.target === modal) closeModal();
    });
  });

