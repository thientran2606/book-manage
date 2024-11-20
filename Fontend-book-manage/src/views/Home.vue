<template>
  <div class="container-fluid">
    <header
      class="jumbotron text-center bg-primary text-white py-5 rounded shadow"
    >
      <h3>Chào mừng bạn đến với Trang Quản lý Sách</h3>
      <p class="lead">
        Tại đây bạn có thể quản lý các cuốn sách của mình dễ dàng và hiệu quả!
      </p>
      <button class="btn btn-light btn-lg" @click="navigateToLogin">
        Xem danh sách sách
      </button>
    </header>

    <section class="my-5">
      <h4>Chức năng của Trang Quản lý Sách</h4>
      <p>
        Trang web này giúp bạn quản lý, theo dõi và tìm kiếm các cuốn sách của
        mình một cách dễ dàng. Bạn có thể thêm, sửa, xóa hoặc tìm kiếm sách theo
        các tiêu chí như tên, tác giả và thể loại.
      </p>
    </section>

    <section class="my-5">
      <h4>Câu hỏi thường gặp</h4>
      <ul class="list-unstyled">
        <li>
          <strong>1. Làm sao để thêm sách mới?</strong> Bạn chỉ cần nhấn vào
          "Thêm sách" trong menu và điền thông tin sách cần thêm.
        </li>
        <li>
          <strong>2. Làm sao để tìm kiếm sách?</strong> Sử dụng thanh tìm kiếm ở
          góc trên bên phải để tìm sách theo tên hoặc tác giả.
        </li>
        <li>
          <strong>3. Tôi có thể xóa sách không?</strong> Có, bạn có thể xóa sách
          trong danh sách sách của mình.
        </li>
      </ul>
    </section>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {
      content: '',
    };
  },
  methods: {
    navigateToLogin() {
      window.location.href = 'http://localhost:8081/login';
    },
  },
};
</script>

<style scoped>
.container-fluid {
  background-color: #e9f7fd;
}

.jumbotron {
  background-color: #007bff;
}

.jumbotron h3 {
  font-family: 'Arial', sans-serif;
  font-weight: bold;
  font-size: 2.5rem;
}

.jumbotron .lead {
  font-size: 1.2rem;
  font-style: italic;
}

section h4 {
  color: #333;
  font-weight: bold;
}

section p,
.faq-section ul {
  font-size: 1rem;
  color: #555;
}

.my-5 {
  margin-top: 30px;
  margin-bottom: 30px;
}

.btn-light {
  background-color: #f8f9fa;
  color: #007bff;
  font-size: 1.1rem;
  padding: 10px 20px;
  border-radius: 5px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.btn-light:hover {
  background-color: #e2e6ea;
  color: #0056b3;
}
</style>
