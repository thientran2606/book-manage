<template>
    <layout-div>
        <h2 class="text-center mt-5 mb-3">Xem chi tiết Nhà xuất bản</h2>
        <div class="card">
            <div class="card-header">
                <router-link class="btn btn-outline-info float-right" to="/nha-xuat-ban">Trở lại danh sách
                </router-link>
            </div>
            <div class="card-body">
                <b className="text-muted">Mã Nhà xuất bản:</b>
                <p>{{ publishingCompany.manxb }}</p>
                <b className="text-muted">Tên Nhà xuất bản:</b>
                <p>{{ publishingCompany.tennxb }}</p>
                <b className="text-muted">Địa chỉ Nhà xuất bản:</b>
                <p>{{ publishingCompany.diachi }}</p>
            </div>
        </div>
    </layout-div>
</template>

<script>
import LayoutDiv from '../LayoutDiv.vue';
import Swal from 'sweetalert2'
import PublishingCompanyService from '../../services/publishingCompany.service';

export default {
    name: 'ProjectShow',
    components: {
        LayoutDiv,
    },
    data() {
        return {
            publishingCompany: {
                manxb: '',
                tennxb: '',
                diachi: ''
            },
            isSaving: false,
        };
    },
    created() {
        const id = this.$route.params.id;
        PublishingCompanyService.detail(id)
            .then(response => {
                console.log(response);
                let publishingCompany = response

                this.publishingCompany.manxb = publishingCompany.manxb
                this.publishingCompany.tennxb = publishingCompany.tennxb
                this.publishingCompany.diachi = publishingCompany.diachi
                return response
            })
            .catch(error => {
                console.log(error);
                Swal.fire({
                    icon: 'error',
                    title: 'Có lỗi đã xảy ra!',
                    showConfirmButton: false,
                    timer: 1500
                })
                return error
            })
    },
    methods: {

    },
};
</script>