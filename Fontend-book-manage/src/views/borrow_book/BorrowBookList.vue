<template>
    <layout-div>
        <div class="container-fluid">
            <h2 class="text-center mt-5 mb-3">Sách</h2>
            <div class="card">
                <div class="card-header">
                    <form class="d-flex justify-content-between">
                        <div class="form-group" style="flex: 1;">
                            <label htmlFor="publishingCompany">Tìm kiếm theo tên Sách</label>
                            <select v-model="search.sachId" class="form-control" id="sachId" name="sachId">
                                <option disabled value="">Chọn Sách</option>
                                <option v-for="book in books" :key="book._id" :value="book._id">{{
                                book.tensach }} </option>
                            </select>
                        </div>
                        <div class="form-group ml-3" style="flex: 1;">
                            <label htmlFor="publishingCompany">Tìm kiếm theo Người dùng</label>
                            <select v-model="search.docgiaId" class="form-control" id="docgiaId" name="docgiaId">
                                <option disabled value="">Chọn Người dùng</option>
                                <option v-for="docGia in docGias" :key="docGia._id" :value="docGia._id">{{
                                docGia.holot }}
                                     {{docGia.ten }} 
                                </option>
                            </select>
                        </div>
                        <button @click="borrowBookList()" type="button" class="btn btn-outline-primary mt-3 ml-3">
                            Tìm kiếm
                        </button>
                    </form>
                </div>
                <div class="card-body">

                    <table class="table table-bordered">
                        <thead>
                            <tr>
                                <th>Mã Sách</th>
                                <th style='white-space: nowrap;'>Tên Sách</th>
                                <th>Đơn giá</th>
                                <th style='white-space: nowrap;'>Năm xuất bản</th>
                                <th style='white-space: nowrap;'>Tác giả</th>
                                <th>Ngày mượn</th>
                                <th>Ngày trả</th>
                                <th style='white-space: nowrap;'>Người mượn</th>
                                <th width="240px">Action</th>
                            </tr>
                        </thead>
                        <tbody>

                            <tr v-for="borrowbook in borrowbooks" :key="borrowbook._id">
                                <td>{{ borrowbook.masach.masach }}</td>
                                <td>{{ borrowbook.masach.tensach }}</td>
                                <td>{{ borrowbook.masach.dongia }}</td>
                                <td>{{ borrowbook.masach.namxuatban }}</td>
                                <td>{{ borrowbook.masach.tacgia }}</td>
                                <td>{{ formatDate(borrowbook.ngaymuon) }}</td>
                                <td>
                                    <span v-if="borrowbook.ngaytra">{{ formatDate(borrowbook.ngaytra) }}</span>
                                    <span v-else class="text-danger">Chưa trả sách</span>
                                </td>
                                 <td>{{ borrowbook.madocgia.holot }} {{ borrowbook.madocgia.ten }} </td>
                                <td>
                                    <button v-if="!borrowbook.ngaytra" @click="handleReceive(borrowbook._id)"
                                        class="btn btn-outline-success mx-1">
                                        Trả sách
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
import BorrowBookService from '../../services/borrowBook.service';
import UserService from '../../services/user.service';


export default {
    name: 'ProjectList',
    components: {
        LayoutDiv,
    },
    data() {
        return {
            search: {
                sachId: '',
                docgiaId: ''
            },
            borrowbooks: [],
            books: BookService.list({ tensach: '', tensach: '', nxbId: '' })
                .then(
                    response => {
                        this.books = response;
                        console.log(response);
                    },
                    error => {
                        return error;
                    }
                ),
            docGias: UserService.searchDocGia().then(response => {
                this.docGias = response;
                console.log(response);
            })
        };
    },
    created() {
        this.borrowBookList(this.tennxb);
    },
    methods: {
        borrowBookList() {
            BorrowBookService.list(this.search).then(
                response => {
                    this.borrowbooks = response;
                    console.log(response, this.search);
                },
                error => {
                    return error;
                }
            );
        },
        handleReceive(id) {
            Swal.fire({
                title: 'Bạn có chắc chắn muốn trả sách?',
                text: "Bạn có khả năng mất phí cho hành động này!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Vâng, tôi sẽ trả nó!',
                cancelButtonText: "Hủy"
            }).then((result) => {
                if (result.isConfirmed) {
                    axios.patch(`http://localhost:3000/api/theo-doi-muon-sach/update/${id}`, {}, { headers: authHeader() })
                        .then(response => {
                            Swal.fire({
                                icon: 'success',
                                title: 'Trả sách thành công!',
                                showConfirmButton: false,
                                timer: 1500
                            })
                            this.borrowBookList();
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
        },
        formatDate(dateString) {
            const date = new Date(dateString);
            const day = date.getDate().toString().padStart(2, '0');
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const year = date.getFullYear();
            return `${day}/${month}/${year}`;
        }
    },
};
</script>