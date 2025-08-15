document.addEventListener("DOMContentLoaded", () => {
  const dialog = document.getElementById("product-dialog");
  const dialogBody = dialog ? dialog.querySelector(".dialog-body") : null;
  const closeBtn = dialog ? dialog.querySelector(".close-btn") : null;

  document.querySelectorAll(".open-dialog-btn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const handle =
        btn instanceof HTMLElement && btn.dataset ? btn.dataset.handle : null;
      if (!handle || !dialogBody || !dialog) return;

      // جلب بيانات المنتج من Shopify JSON endpoint
      const res = await fetch(`/products/${handle}.js`);
      const product = await res.json();

      dialogBody.innerHTML = `
        <h2>${product.title}</h2>
        <img src="${product.images[0]}" style="max-width:100%;"/>
        <p>${(product.price / 100).toFixed(2)} ${Shopify.currency.active}</p>
        <button id="add-to-cart-btn">Add to Cart</button>
      `;

      dialog.style.display = "flex";

      const addToCartBtn = document.getElementById("add-to-cart-btn");
      if (addToCartBtn) {
        addToCartBtn.addEventListener("click", async () => {
          await fetch("/cart/add.js", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: product.variants[0].id, quantity: 1 }),
          });
          alert("Product added to cart!");
        });
      }
    });
  });

  if (closeBtn && dialog) {
    closeBtn.addEventListener("click", () => {
      dialog.style.display = "none";
    });
  }
});
