const deleteProduct = (btn) => {
  const removeProduct = btn.closest("article");
  const prodId = btn.closest("div").querySelector("[name=productId]").value;
  const csrfToken = btn.closest("div").querySelector("[name=_csrf]").value;
  fetch("/admin/delete-product/" + prodId, {
    method: "GET",
    headers: { "csrf-token": csrfToken },
  })
    .then((result) => {
      return result.json();
    })
    .then((data) => {
      console.log(data);
      removeProduct.remove();
    })
    .catch((err) => {
      console.log(err);
    });
};
