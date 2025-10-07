// Tạo style từ JS
const style = document.createElement("style");
style.textContent = `
  body {
    margin: 0;
    font-family: sans-serif;
    background: url("assets/nen.png") no-repeat center center/cover;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .slide {
    text-align: center;
    position: relative;
    width: 100%;
    height: 100%;
  }

  .hidden {
    display: none;
  }

  .logo {
    width: 60px;
    margin-top: 30px;
    display: block;
    margin-left: auto;
    margin-right: auto;
  }

  .title-img {
    display: block;
    max-width: 65%;
    margin: 40px auto 50px auto;
  }

  .bag {
    position: absolute;
    bottom: 15%;
    left: 15%;
    width: 15%;
  }

  .wallet {
    position: absolute;
    bottom: 15%;
    right: 15%;
    width: 15%;
  }

  .buttons {
    margin-top: 20px;
  }

  .btn {
    display: block;
    width: 220px;
    padding: 14px;
    margin: 15px auto;
    background: #3b6b57;
    color: white;
    text-decoration: none;
    font-weight: bold;
    border-radius: 8px;
    transition: 0.3s;

    opacity: 0;
    transform: translateY(40px);
    animation: slideUp 0.8s ease forwards;
  }

  .btn:nth-child(1) {
    animation-delay: 0.5s;
  }
  .btn:nth-child(2) {
    animation-delay: 1s;
  }

  .btn:hover {
    background: #2e5243;
  }

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(40px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;
document.head.appendChild(style);

// Slide intro
const intro = document.createElement("div");
intro.id = "intro";
intro.className = "slide";
intro.innerHTML = `
  <img src="assets/logo.png" alt="Logo" class="logo">
  <img src="assets/Vissmart.png" alt="Vissmart" class="title-img">
  <img src="assets/Bag.png" alt="Bag" class="bag">
  <img src="assets/wallet.png" alt="Wallet" class="wallet">
`;

// Slide main
const main = document.createElement("div");
main.id = "main";
main.className = "slide hidden";
main.innerHTML = `
  <img src="assets/logo.png" alt="Logo" class="logo">
  <img src="assets/Vissmart.png" alt="Vissmart" class="title-img">
  <div class="buttons">
    <a href="login.html" class="btn">ĐĂNG NHẬP</a>
    <a href="register.html" class="btn">ĐĂNG KÝ</a>
  </div>
  <img src="assets/Bag.png" alt="Bag" class="bag">
  <img src="assets/wallet.png" alt="Wallet" class="wallet">
`;

document.body.appendChild(intro);
document.body.appendChild(main);

// Sau 0.7s thì hiện slide 2
setTimeout(() => {
  intro.classList.add("hidden");
  main.classList.remove("hidden");
}, 700);

// Nếu click vào intro thì chuyển ngay
intro.addEventListener("click", () => {
  intro.classList.add("hidden");
  main.classList.remove("hidden");
});
