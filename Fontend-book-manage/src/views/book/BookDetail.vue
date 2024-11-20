<template>
    <layout-div>
        <h2 class="text-center mt-5 mb-3">Xem chi tiết Sách</h2>
        <div class="card">
            <div class="card-header">
                <router-link class="btn btn-outline-info float-right" to="/sach">Trở lại danh sách
                </router-link>
            </div>
            <div class="card-body">
                <b className="text-muted">Mã Sách:</b>
                <p>{{ book.masach }}</p>
                <b className="text-muted">Tên Sách:</b>
                <p>{{ book.tensach }}</p>
                <b className="text-muted">Đơn giá:</b>
                <p>{{ book.dongia }}</p>
                <b className="text-muted">Số quyển:</b>
                <p>{{ book.soquyen }}</p>
                <b className="text-muted">Năm xuất bản:</b>
                <p>{{ book.namxuatban }}</p>
                <b className="text-muted">Nhà xuất bản:</b>
                <p>{{ book.manxb.tennxb }}</p>
                <b className="text-muted">Tác giả:</b>
                <p>{{ book.tacgia }}</p>
            </div>
        </div>
    </layout-div>
</template>

<script>
import LayoutDiv from '../LayoutDiv.vue';
import Swal from 'sweetalert2'
import BookService from '../../services/book.service';

export default {
    name: 'ProjectShow',
    components: {
        LayoutDiv,
    },
    data() {
        return {
            book: {
                masach: '',
                tensach: '',
                dongia: '',
                soquyen: '',
                namxuatban: '',
                manxb: '',
                tacgia: ''
            },
            isSaving: false,
        };
    },
    created() {
        const id = this.$route.params.id;
        BookService.detail(id)
            .then(response => {
                console.log(response);
                this.book = response
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