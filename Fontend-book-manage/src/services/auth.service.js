import axios from 'axios';

const API_URL = 'http://localhost:3000/api/users/';

class AuthService {
  login(user) {
    return axios
      .post(API_URL + 'login', {
        code: user.username,
        password: user.password,
      })
      .then((response) => {
        if (response.data.token) {
          localStorage.setItem('user', JSON.stringify(response.data));
        }
        return response.data;
      });
  }

  logout() {
    localStorage.removeItem('user');
  }

  register(user) {
    // Sửa lại tên trường cho đúng với frontend
    return axios.post(API_URL + 'signup', {
      holot: user.holot, // Gửi trường 'holot'
      ten: user.ten, // Gửi trường 'ten'
      ngaysinh: user.ngaysinh, // Gửi trường 'ngaysinh'
      phai: user.phai, // Gửi trường 'phai' thay vì 'gioitinh'
      diachi: user.diachi, // Gửi trường 'diachi'
      dienthoai: user.dienthoai, // Gửi trường 'sdt' thay vì 'sdt'
    });
  }
}

export default new AuthService();
