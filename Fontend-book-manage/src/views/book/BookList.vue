<template>
  <layout-div>
    <div class="container-fluid">
      <h2 class="text-center mt-5 mb-3">Sách</h2>
      <div class="card">
        <div class="card-header">
          <form class="d-flex justify-content-between">
            <div class="form-group flex-grow-1 mr-2 mb-0">
              <label htmlFor="name">Tên Sách</label>
              <input
                v-model="search.tensach"
                type="text"
                class="form-control"
                id="tennxb"
                name="tennxb"
              />
            </div>
            <div class="form-group">
              <label htmlFor="publishingCompany">Tác giả:</label>
              <select
                v-model="search.nxbId"
                class="form-control"
                id="publishingCompany"
                name="publishingCompany"
              >
                <option disabled value="">Chọn nhà xuất bản</option>
                <option
                  v-for="company in publishingCompanys"
                  :key="company._id"
                  :value="company._id"
                >
                  {{ company.tennxb }}
                </option>
              </select>
            </div>
            <button
              @click="bookList()"
              type="button"
              class="btn btn-outline-primary mt-3"
            >
              Tìm kiếm
            </button>
          </form>
        </div>
        <div class="card-header d-flex justify-content-end">
          <router-link to="/sach/create" class="btn btn-outline-primary"
            >Tạo mới Sách
          </router-link>
        </div>
        <div class="card-body">
          <table class="table table-bordered" style="white-space: nowrap">
            <thead>
              <tr>
                <th>Mã Sách</th>
                <th>Tên Sách</th>
                <th>Đơn giá</th>
                <th>Số quyển</th>
                <th>Năm xuất bản</th>
                <th>Nhà xuất bản</th>
                <th>Tác giả</th>
                <th width="240px">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="book in books" :key="book._id">
                <td>{{ book.masach }}</td>
                <td>{{ book.tensach }}</td>
                <td>{{ book.dongia }}</td>
                <td>{{ book.soquyen }}</td>
                <td>{{ book.namxuatban }}</td>
                <td>{{ book.manxb.tennxb }}</td>
                <td>{{ book.tacgia }}</td>
                <td>
                  <router-link
                    :to="`/sach/detail/${book._id}`"
                    class="btn btn-outline-info mx-1"
                    >Show</router-link
                  >
                  <router-link
                    :to="`/sach/edit/${book._id}`"
                    class="btn btn-outline-success mx-1"
                    >Edit</router-link
                  >
                  <button
                    @click="handleDelete(book._id)"
                    class="btn btn-outline-danger mx-1"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </layout-div>
</template>

<script>
import axios from 'axios';
import LayoutDiv from '../LayoutDiv.vue';
import Swal from 'sweetalert2';
import BookService from '../../services/book.service';
import authHeader from '../../services/auth-header';
import PublishingCompanyService from '../../services/publishingCompany.service';

export default {
  name: 'ProjectList',
  components: {
    LayoutDiv,
  },
  data() {
    return {
      search: {
        tensach: '',
        tacgia: '',
        nxbId: '',
      },
      books: [],
      publishingCompanys: PublishingCompanyService.list({ tennxb: '' }).then(
        (response) => {
          this.publishingCompanys = response;
          // eslint-disable-next-line no-console
          console.log(response);
        },
        (error) => {
          return error;
        }
      ),
    };
  },
  created() {
    this.bookList(this.tennxb);
  },
  methods: {
    bookList() {
      BookService.list(this.search).then(
        (response) => {
          this.books = response;
          // eslint-disable-next-line no-console
          console.log(response);
        },
        (error) => {
          return error;
        }
      );
    },
    handleDelete(id) {
      Swal.fire({
        title: 'Bạn có chắc chắn muốn xóa?',
        text: 'Bạn không có khả năng hoàn tác lại hành động này!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Vâng, xóa nó!',
        cancelButtonText: 'Hủy',
      }).then((result) => {
        if (result.isConfirmed) {
          axios
            .delete(`http://localhost:3000/api/sachs/${id}`, {
              headers: authHeader(),
            })
            .then((response) => {
              Swal.fire({
                icon: 'success',
                title: 'Sách đã được xóa thành công!',
                showConfirmButton: false,
                timer: 1500,
              });
              this.bookList();
              return response;
            })
            .catch((error) => {
              // eslint-disable-next-line no-console
              console.log(error.response.data.errors[0].message);
              Swal.fire({
                icon: 'error',
                title: error.response.data.errors[0].message,
                showConfirmButton: false,
                timer: 1500,
              });
              return error;
            });
        }
      });
    },
  },
};
</script>
