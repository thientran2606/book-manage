<template>
  <div id="app">
    <!-- Navbar -->
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary shadow-lg">
      <a href class="navbar-brand">
        <span class="font-weight-bold">Quản Lý Mượn Sách</span>
      </a>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav me-auto">
          <li class="nav-item">
            <router-link to="/home" class="nav-link">
              <font-awesome-icon icon="home" /> Trang Chủ
            </router-link>
          </li>
          <li v-if="showAdminBoard" class="nav-item">
            <router-link to="/sach" class="nav-link">Quản lý sách</router-link>
          </li>
          <li v-if="showAdminBoard" class="nav-item">
            <router-link to="/nha-xuat-ban" class="nav-link"
              >Quản lý Nhà xuất bản</router-link
            >
          </li>
          <li v-if="showAdminBoard" class="nav-item">
            <router-link to="/borrow-book" class="nav-link"
              >Quản lý Sách mượn</router-link
            >
          </li>
          <li v-if="showModeratorBoard" class="nav-item">
            <router-link to="/sach-user" class="nav-link">Sách</router-link>
          </li>
          <li v-if="showModeratorBoard" class="nav-item">
            <router-link to="/borrow-book-user" class="nav-link"
              >Sách đã mượn</router-link
            >
          </li>
        </ul>

        <!-- User Authentication Links -->
        <ul class="navbar-nav ml-auto">
          <li v-if="!currentUser" class="nav-item">
            <router-link to="/register" class="nav-link">
              <font-awesome-icon icon="user-plus" /> Đăng ký
            </router-link>
          </li>
          <li v-if="!currentUser" class="nav-item">
            <router-link to="/login" class="nav-link">
              <font-awesome-icon icon="sign-in-alt" /> Đăng nhập
            </router-link>
          </li>
          <li v-if="currentUser" class="nav-item">
            <router-link to="/profile" class="nav-link">
              <font-awesome-icon icon="user" />
              {{ currentUser.username }}
            </router-link>
          </li>
          <li v-if="currentUser" class="nav-item">
            <a class="nav-link" href @click.prevent="logOut">
              <font-awesome-icon icon="sign-out-alt" /> LogOut
            </a>
          </li>
        </ul>
      </div>
    </nav>

    <!-- Main Content -->
    <div class="container-fluid">
      <router-view />
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    },
    showAdminBoard() {
      return this.currentUser && this.currentUser.role.includes('nhanvien');
    },
    showModeratorBoard() {
      return this.currentUser && this.currentUser.role.includes('docgia');
    },
  },
  methods: {
    logOut() {
      this.$store.dispatch('auth/logout');
      this.$router.push('/login');
    },
  },
};
</script>

<style scoped>
.navbar {
  background-color: #5bc0de;
  transition: background-color 0.3s ease-in-out;
}

.navbar:hover {
  background-color: #4ca3d7;
}

.navbar-brand,
.navbar-nav .nav-link {
  color: #ffffff;
}

.nav-item .nav-link:hover {
  color: #ff7043;
}

.container-fluid {
  background-color: #f1f8ff;
  color: #333;
}

button,
.btn {
  background-color: #ff7043;
  border-color: #ff7043;
}

button:hover,
.btn:hover {
  background-color: #ff5722;
}

@media (max-width: 992px) {
  .navbar-nav {
    text-align: center;
  }
  .navbar-nav .nav-item {
    padding: 1rem 0;
  }
}

.navbar-nav.ml-auto .nav-item .nav-link {
  color: #ffffff;
  padding: 0.8rem 1rem;
}

.navbar-nav.ml-auto .nav-item .nav-link:hover {
  color: #ffca28;
}

.navbar-nav .nav-item.active .nav-link {
  color: #ffca28;
  font-weight: bold;
}
</style>
