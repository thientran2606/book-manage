<template>
    <layout-div>
        <div class="container-fluid">
            <h2 class="text-center mt-5 mb-3">Sách</h2>
            <div class="card">
                <div class="card-header">
                    <form class="d-flex justify-content-between">
                        <div class="form-group flex-grow-1 mr-2 mb-0">
                            <label htmlFor="name">Tên Sách</label>
                            <input v-model="search.tensach" type="text" class="form-control" id="tennxb"
                                name="tennxb" />
                        </div>
                        <div class="form-group">
                            <label htmlFor="publishingCompany">Tác giả:</label>
                            <select v-model="search.nxbId" class="form-control" id="publishingCompany"
                                name="publishingCompany">
                                <option disabled value="">Chọn nhà xuất bản</option>
                                <option v-for="company in publishingCompanys" :key="company._id" :value="company._id">{{
                                    company.tennxb }}</option>
                            </select>
                        </div>
                        <button @click="bookList()" type="button" class="btn btn-outline-primary mt-3 ml-3">
                            Tìm kiếm
                        </button>
                    </form>
                </div>
                <div class="card-body">

                    <table class="table table-bordered" style='white-space: nowrap;'>
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
                                    <button @click="handleReceive(book._id)" class="btn btn-outline-success mx-1">
                                        Mượn sách
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
import Swal from 'sweetalert2'
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
            publishingCompanys: PublishingCompanyService.list({ tennxb: '' })
                .then(
                    response => {
                        this.publishingCompanys = response;
                        console.log(response);
                    },
                    error => {
                        return error;
                    }
                )
        };
    },
    created() {
        this.bookList(this.tennxb);
    },
    methods: {
        bookList() {
            BookService.list(this.search).then(
                response => {
                    this.books = response;
                    console.log(response);
                },
                error => {
                    return error;
                }
            );
        },
        handleReceive(id) {
            Swal.fire({
                title: 'Bạn có chắc chắn muốn mượn sách?',
                text: "Bạn có khả năng mất phí cho hành động này!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Vâng, tôi sẽ mượn nó!',
                cancelButtonText: "Hủy"
            }).then((result) => {
                if (result.isConfirmed) {
                    axios.post(`http://localhost:3000/api/theo-doi-muon-sach/create`, { sachId: id }, { headers: authHeader() })
                        .then(response => {
                            Swal.fire({
                                icon: 'success',
                                title: 'Mượn sách thành công!',
                                showConfirmButton: false,
                                timer: 1500
                            })
                            this.bookList();
                            return response
                        })
                        .catch(error => {
                            Swal.fire({
                                icon: 'error',
                                title: 'Có lỗi đã xảy ra!',
                                showConfirmButton: false,
                                timer: 1500
                            })
                            return error
                        });
                }
            })
        }
    },
};
</script>