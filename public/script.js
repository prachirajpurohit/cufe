function copyUrl() {
  const url = document.getElementById("base-url").textContent;
  navigator.clipboard.writeText(url);

  const btn = document.querySelector(".copy-btn");
  btn.textContent = "Copied!";

  setTimeout(() => {
    btn.textContent = "Copy";
  }, 2000);
}
