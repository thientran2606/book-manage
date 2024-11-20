<template>
    <layout-div>
        <div class="container-fluid">
            <h2 class="text-center mt-5 mb-3">Nhà xuất bản</h2>
            <div class="card">
                <div class="card-header">
                    <form class="d-flex justify-content-between">
                        <div class="form-group flex-grow-1 mr-2 mb-0">
                            <label htmlFor="name">Tên Nhà xuất bản</label>
                            <input v-model="tennxb" type="text" class="form-control" id="tennxb" name="tennxb" />
                        </div>
                        <button @click="fetchPublishingCompanyList()" type="button"
                            class="btn btn-outline-primary mt-3">
                            Tìm kiếm
                        </button>
                    </form>
                </div>
                <div class="card-header d-flex justify-content-end">
                    <router-link to="/nha-xuat-ban/create" class="btn btn-outline-primary">Tạo mới nhà xuất bản
                    </router-link>
                </div>
                <div class="card-body">

                    <table class="table table-bordered">
                        <thead>
                            <tr>
                                <th>Mã nhà xuất bản</th>
                                <th>Tên nhà xuất bản</th>
                                <th>Địa chỉ nhà xuất bản</th>
                                <th width="240px">Action</th>
                            </tr>
                        </thead>
                        <tbody>

                            <tr v-for="publishingCompany in publishingCompanys" :key="publishingCompany._id">
                                <td>{{ publishingCompany.manxb }}</td>
                                <td>{{ publishingCompany.tennxb }}</td>
                                <td>{{ publishingCompany.diachi }}</td>
                                <td>
                                    <router-link :to="`/nha-xuat-ban/detail/${publishingCompany._id}`"
                                        class="btn btn-outline-info mx-1">Show</router-link>
                                    <router-link :to="`/nha-xuat-ban/edit/${publishingCompany._id}`"
                                        class="btn btn-outline-success mx-1">Edit</router-link>
                                    <button @click="handleDelete(publishingCompany._id)" class="btn btn-outline-danger mx-1">
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
import Swal from 'sweetalert2'
import PublishingCompanyService from '../../services/publishingCompany.service';
import authHeader from '../../services/auth-header';

export default {
    name: 'ProjectList',
    components: {
        LayoutDiv,
    },
    data() {
        return {
            publishingCompanys: [],
            tennxb: ''
        };
    },
    created() {
        this.fetchPublishingCompanyList(this.tennxb);
    },
    methods: {
        fetchPublishingCompanyList() {
            PublishingCompanyService.list({ tennxb: this.tennxb}).then(
                response => {
                    this.publishingCompanys = response;
                    console.log(response);
                },
                error => {
                    return error;
                }
            );
        },
        handleDelete(id) {
            Swal.fire({
                title: 'Bạn có chắc chắn muốn xóa?',
                text: "Bạn không có khả năng hoàn tác lại hành động này!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Vâng, xóa nó!',
                cancelButtonText: "Hủy"
            }).then((result) => {
                if (result.isConfirmed) {
                    axios.delete(`http://localhost:3000/api/nha-xuat-ban/${id}`, { headers: authHeader() })
                        .then(response => {
                            Swal.fire({
                                icon: 'success',
                                title: 'Nhà xuất bản đã được xóa thành công!',
                                showConfirmButton: false,
                                timer: 1500
                            })
                            this.fetchPublishingCompanyList();
                            return response
                        })
                        .catch(error => {
                            console.log(error.response.data.errors[0].message);
                            Swal.fire({
                                icon: 'error',
                                title: error.response.data.errors[0].message,
                                showConfirmButton: false,
                                timer: 2000
                            })
                            return error
                        });
                }
            })
        }
    },
};
</script>