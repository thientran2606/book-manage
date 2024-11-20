<template>
  <div class="col-md-6 col-lg-4 mx-auto mt-5">
    <div class="card card-container shadow">
      <!-- Avatar -->
      <img
        id="profile-img"
        src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
        class="profile-img-card rounded-circle mx-auto d-block mb-3"
        alt="User Avatar"
      />
      <!-- Form -->
      <form name="form" @submit.prevent="handleLogin">
        <!-- Username -->
        <div class="form-group">
          <label for="username">Nhập mã người dùng của bạn</label>
          <input
            v-model="user.username"
            v-validate="'required'"
            type="text"
            class="form-control"
            name="username"
            id="username"
            placeholder="Mã người dùng"
          />
          <div
            v-if="errors.has('username')"
            class="alert alert-danger"
            role="alert"
          >
            Mã người dùng không được để trống!
          </div>
        </div>

        <!-- Password -->
        <div class="form-group">
          <label for="password">Nhập mật khẩu</label>
          <input
            v-model="user.password"
            v-validate="'required'"
            type="password"
            class="form-control"
            name="password"
            id="password"
            placeholder="Mật khẩu"
          />
          <div
            v-if="errors.has('password')"
            class="alert alert-danger"
            role="alert"
          >
            Mật khẩu không được để trống!
          </div>
        </div>

        <!-- Submit Button -->
        <div class="form-group">
          <button class="btn btn-primary btn-block" :disabled="loading">
            <span
              v-show="loading"
              class="spinner-border spinner-border-sm"
            ></span>
            <span>Đăng nhập</span>
          </button>
        </div>

        <!-- Error Message -->
        <div class="form-group">
          <div v-if="message" class="alert alert-danger" role="alert">
            {{ message }}
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import User from '../models/user';

export default {
  name: 'Login',
  data() {
    return {
      user: new User('', ''),
      loading: false,
      message: '',
    };
  },
  computed: {
    loggedIn() {
      return this.$store.state.auth.status.loggedIn;
    },
  },
  created() {
    if (this.loggedIn) {
      this.$router.push('/profile');
    }
  },
  methods: {
    handleLogin() {
      this.loading = true;
      this.$validator.validateAll().then((isValid) => {
        if (!isValid) {
          this.loading = false;
          return;
        }

        if (this.user.username && this.user.password) {
          this.$store.dispatch('auth/login', this.user).then(
            () => {
              this.$router.push('/profile');
            },
            (error) => {
              this.loading = false;
              this.message =
                (error.response &&
                  error.response.data &&
                  error.response.data.message) ||
                error.message ||
                error.toString();
            }
          );
        }
      });
    },
  },
};
</script>

<style scoped>
.card-container.card {
  max-width: 400px !important;
  padding: 40px 40px;
  border-radius: 10px;
}

.card {
  background-color: #f7f7f7;
  padding: 30px 40px;
  margin: 0 auto 25px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
}

.profile-img-card {
  width: 100px;
  height: 100px;
  margin: 0 auto 15px;
  display: block;
}

.form-group label {
  font-weight: 600;
  margin-bottom: 10px;
}

.form-control {
  border-radius: 5px;
  padding: 10px;
}

.btn-primary {
  background-color: #007bff;
  border-color: #007bff;
  font-size: 1.1rem;
  padding: 10px;
  border-radius: 5px;
}

.btn-primary:disabled {
  background-color: #a5c8ff;
  border-color: #a5c8ff;
}

.alert {
  font-size: 0.9rem;
}
</style>
