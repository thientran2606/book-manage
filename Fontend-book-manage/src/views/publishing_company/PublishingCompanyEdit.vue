<template>
    <layout-div>
        <h2 class="text-center mt-5 mb-3">Sửa nhà xuất bản</h2>
        <div class="card">
            <div class="card-header">
                <router-link class="btn btn-outline-info float-right" to="/nha-xuat-ban">Trở lại danh sách
                </router-link>
            </div>
            <div class="card-body">
                <form>
                    <!-- <b className="text-muted">Mã Nhà xuất bản:</b>
                    <p>{{ publishingCompany.manxb }}</p> -->
                    <div class="form-group">
                        <label htmlFor="name">Tên Nhà xuất bản</label>
                        <input v-model="publishingCompany.tennxb" type="text" class="form-control" id="tennxb"
                            name="tennxb" />
                    </div>
                    <div class="form-group">
                        <label htmlFor="description">Địa chỉ Nhà xuất bản</label>
                        <textarea v-model="publishingCompany.diachi" class="form-control" id="diachi" rows="3"
                            name="diachi"></textarea>
                    </div>
                    <button @click="handleSave()" :disabled="isSaving" type="button"
                        class="btn btn-outline-primary mt-3">
                        Cập nhật Nhà xuất bản
                    </button>
                </form>
            </div>
        </div>
    </layout-div>
</template>

<script>
import LayoutDiv from '../LayoutDiv.vue';
import Swal from 'sweetalert2'
import PublishingCompanyService from '../../services/publishingCompany.service';

export default {
    name: 'ProjectEdit',
    components: {
        LayoutDiv,
    },
    data() {
        return {
            publishingCompany: {
                manxb: '',
                tennxb: '',
                diachi: '',
            },
            isSaving: false,
        };
    },
    created() {
        const id = this.$route.params.id;
        PublishingCompanyService.detail(id)
            .then(response => {
                let publishingCompany = response

                this.publishingCompany.manxb = publishingCompany.manxb
                this.publishingCompany.tennxb = publishingCompany.tennxb
                this.publishingCompany.diachi = publishingCompany.diachi
                return response
            })
            .catch(error => {
                Swal.fire({
                    icon: 'error',
                    title: 'An Error Occured!',
                    showConfirmButton: false,
                    timer: 1500
                })
                return error
            })
    },
    methods: {
        handleSave() {
            this.isSaving = true
            const id = this.$route.params.id;

            PublishingCompanyService.update(this.publishingCompany, id)
                .then(response => {
                    Swal.fire({
                        icon: 'success',
                        title: 'Nhà xuất bản được cập nhật thành công!',
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