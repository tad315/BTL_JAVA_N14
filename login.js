// CSS bằng JS
const style = document.createElement("style");
style.textContent = `
  body {
    margin: 0;
    background: url("assets/nen.png") no-repeat center center/cover;
    font-family: sans-serif;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .login-container {
    display: flex;
    width: 800px;
    max-width: 95%;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 4px 15px rgba(0,0,0,0.2);
  }

  .login-image {
    flex: 1;
    background: url("assets/login.png") no-repeat center center/cover;
    min-width: 300px;
  }
    .login-image img {
  width: 100%;
  height: 100%;
  object-fit: contain; /* Giữ nguyên tỉ lệ, không cắt */
}

  .login-form {
    flex: 1;
    background: #f9f8f4;
    padding: 40px;
  }

  .login-form h2 {
    margin-top: 0;
    margin-bottom: 20px;
    text-align: center;
    color: #3b6b57;
  }

  label {
    display: block;
    margin-top: 15px;
    margin-bottom: 5px;
    font-weight: bold;
    color: #333;
  }

  input {
    width: 100%;
    padding: 12px;
    border-radius: 6px;
    border: 1px solid #ccc;
    margin-bottom: 10px;
    font-size: 14px;
  }

  .btn {
    display: block;
    width: 100%;
    padding: 14px;
    background: #3b6b57;
    color: white;
    border: none;
    border-radius: 6px;
    font-weight: bold;
    cursor: pointer;
    margin-top: 10px;
    transition: 0.3s;
  }

  .btn:hover {
    background: #2e5243;
  }

  .forgot {
    display: block;
    margin: 12px 0;
    text-align: center;
    color: #666;
    font-size: 13px;
    text-decoration: none;
  }

  .or {
    text-align: center;
    margin: 15px 0 10px;
    font-size: 14px;
    color: #555;
  }

  .social-login {
    display: flex;
    justify-content: center;
    gap: 20px;
  }

  .social-login img {
    width: 40px;
    height: 40px;
    cursor: pointer;
  }
    /* Khi màn hình nhỏ thì ẩn ảnh, form full width */
@media (max-width: 768px) {
  .login-image {
    display: none;
  }
  .login-form {
    flex: 1 1 100%;
    width: 100%;
  }
}

`;
document.head.appendChild(style);

// HTML bằng JS
const container = document.createElement("div");
container.className = "login-container";

// cột ảnh
const loginImage = document.createElement("div");
loginImage.className = "login-image";

// cột form
const formDiv = document.createElement("div");
formDiv.className = "login-form";
formDiv.innerHTML = `
  <h2>ĐĂNG NHẬP</h2>
  <form>
    <label for="username">Tên đăng nhập</label>
    <input type="text" id="username" placeholder="Nhập tên đăng nhập">

    <label for="password">Mật khẩu</label>
    <input type="password" id="password" placeholder="Nhập mật khẩu">

    <button type="submit" class="btn">ĐĂNG NHẬP</button>

    <a href="#" class="forgot">Quên mật khẩu?</a>

    <p class="or">Hoặc đăng nhập bằng:</p>
    <div class="social-login">
      <a href="#"><img src="assets/facebook.png" alt="Facebook"></a>
      <a href="#"><img src="assets/google.png" alt="Google"></a>
    </div>
  </form>
`;

container.appendChild(loginImage);
container.appendChild(formDiv);

document.body.appendChild(container);
