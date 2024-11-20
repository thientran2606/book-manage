<template>
    <layout-div>
        <h2 class="text-center mt-5 mb-3">Tạo Nhà xuất bản mới</h2>
        <div class="card">
            <div class="card-header">
                <router-link class="btn btn-outline-info float-right" to="/nha-xuat-ban">Trở lại danh sách
                </router-link>
            </div>
            <div class="card-body">
                <form>
                    <div class="form-group">
                        <label htmlFor="name">Tên Nhà xuất bản:</label>
                        <input v-model="publishingCompany.tennxb" type="text" class="form-control" id="tennxb"
                            name="tennxb" />
                    </div>
                    <div class="form-group">
                        <label htmlFor="description">Địa chỉ Nhà xuất bản:</label>
                        <textarea v-model="publishingCompany.diachi" class="form-control" id="diachi" rows="3"
                            name="diachi"></textarea>
                    </div>
                    <button @click="handleSave()" :disabled="isSaving" type="button"
                        class="btn btn-outline-primary mt-3">
                        Lưu nhà xuất bản
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


export default {
    name: 'ProjectCreate',
    components: {
        LayoutDiv,
    },
    data() {
        return {
            publishingCompany: {
                tennxb: '',
                diachi: '',
            },
            isSaving: false,
        };
    },
    methods: {
        handleSave() {
            this.isSaving = true
            PublishingCompanyService.create(this.publishingCompany)
                .then(response => {
                    Swal.fire({
                        icon: 'success',
                        title: 'Nhà xuất bản được tạo thành công!',
                        showConfirmButton: false,
                        timer: 1500
                    })
                    this.isSaving = false
                    this.publishingCompany.tennxb = ""
                    this.publishingCompany.diachi = ""
                    this.$router.push('/nha-xuat-ban');
                    return response
                })
                .catch(error => {
                    this.isSaving = false
                    Swal.fire({
                        icon: 'error',
                        title: 'Có lỗi đã xảy ra!',
                        showConfirmButton: false,
                        timer: 1500
                    })
                    return error
                });
        },
    },
};
</script>