<template>
  <layout-div>
    <h2 class="text-center mt-5 mb-3">Thêm sách mới</h2>
    <div class="card">
      <div class="card-header">
        <router-link class="btn btn-outline-info float-right" to="/sach"
          >Trở lại danh sách
        </router-link>
      </div>
      <div class="card-body">
        <form>
          <div class="form-group">
            <label htmlFor="name">Tên Sách:</label>
            <input
              v-model="book.tensach"
              type="text"
              class="form-control"
              id="tensach"
              name="tensach"
            />
          </div>
          <div class="form-group">
            <label htmlFor="name">Đơn giá:</label>
            <input
              v-model="book.dongia"
              type="number"
              class="form-control"
              id="dongia"
              name="dongia"
            />
          </div>
          <div class="form-group">
            <label htmlFor="name">Số quyển:</label>
            <input
              v-model="book.soquyen"
              type="number"
              class="form-control"
              id="soquyen"
              name="soquyen"
            />
          </div>
          <div class="form-group">
            <label htmlFor="name">Năm xuất bản:</label>
            <select
              v-model="book.namxuatban"
              class="form-control"
              id="namxuatban"
              name="namxuatban"
            >
              <option disabled value="">Chọn năm</option>
              <option v-for="year in availableYears" :key="year" :value="year">
                {{ year }}
              </option>
            </select>
          </div>
          <div class="form-group">
            <label htmlFor="publishingCompany">Nhà xuất bản:</label>
            <select
              v-model="book.manxb"
              class="form-control"
              id="publishingCompany"
              name="publishingCompany"
            >
              <option disabled value="">Chọn nhà xuất bản</option>
              <option
                v-for="company in publishingCompanys"
                :key="company._id"
                :value="company.manxb"
              >
                {{ company.tennxb }}
              </option>
            </select>
          </div>
          <div class="form-group">
            <label htmlFor="name">Tác Giả:</label>
            <input
              v-model="book.tacgia"
              type="text"
              class="form-control"
              id="tacgia"
              name="tacgia"
            />
          </div>
          <button
            @click="handleSave()"
            :disabled="isSaving"
            type="button"
            class="btn btn-outline-primary mt-3"
          >
            Lưu Sách
          </button>
        </form>
      </div>
    </div>
  </layout-div>
</template>

<script>
import LayoutDiv from '../LayoutDiv.vue';
import Swal from 'sweetalert2';
import PublishingCompanyService from '../../services/publishingCompany.service';
import BookService from '../../services/book.service';

export default {
  name: 'ProjectCreate',
  components: {
    LayoutDiv,
  },
  data() {
    return {
      book: {
        tensach: '',
        dongia: '',
        soquyen: '',
        namxuatban: '',
        manxb: '',
        tacgia: '',
      },
      isSaving: false,
      publishingCompanys: [],
      availableYears: (() => {
        const currentYear = new Date().getFullYear();
        const years = [];
        for (let year = currentYear; year >= 1900; year--) {
          years.push(year);
        }
        return years;
      })(),
    };
  },
  created() {
    PublishingCompanyService.list({ tennxb: '' }).then(
      (response) => {
        this.publishingCompanys = response;
        // eslint-disable-next-line no-console
        console.log(response);
      },
      (error) => {
        return error;
      }
    );
  },
  methods: {
    handleSave() {
      this.isSaving = true;
      // eslint-disable-next-line no-console
      console.log(this.book);
      BookService.create(this.book)
        .then((response) => {
          Swal.fire({
            icon: 'success',
            title: 'Sách được tạo thành công!',
            showConfirmButton: false,
            timer: 1500,
          });
          this.isSaving = false;
          this.book.tennxb = '';
          this.book.diachi = '';
          this.$router.push('/sach');
          return response;
        })
        .catch((error) => {
          this.isSaving = false;
          Swal.fire({
            icon: 'error',
            title: 'Có lỗi đã xảy ra!',
            showConfirmButton: false,
            timer: 1500,
          });
          return error;
        });
    },
  },
};
</script>
