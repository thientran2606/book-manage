<template>
  <div class="container-fluid">
    <header class="jumbotron">
      <h3>
        <strong
          ><center>
            Bạn đang đăng nhập với tư cách là: {{ currentUser.role }}
          </center></strong
        >
      </h3>
    </header>
  </div>
</template>

<script>
export default {
  name: 'Profile',
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    },
  },
  mounted() {
    if (!this.currentUser) {
      this.$router.push('/login');
    }
  },
};
</script>
