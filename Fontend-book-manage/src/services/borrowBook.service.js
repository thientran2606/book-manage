import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:3000/api/theo-doi-muon-sach';

class BorrowBookService {
  list(req) {
    return axios
      .post(API_URL + '/search', {
        docgiaId: req.docgiaId,
        sachId: req.sachId,
      }, { headers: authHeader() })
      .then((response) => {
        console.log(response);
        return response.data;
      });
  }

  detail(id) {
    return axios.get(API_URL + `/${id}`).then((response) => {
      console.log(response);
      return response.data;
    });
  }

  create(book) {
    return axios.post(
      API_URL + '/create',
      {
        tensach: book.tensach,
        dongia: book.dongia,
        soquyen: book.soquyen,
        namxuatban: book.namxuatban,
        manxb: book.manxb,
        tacgia: book.tacgia,
      },
      { headers: authHeader() }
    );
  }

  update(book, id) {
    return axios.patch(
      API_URL + `/${id}`,
      {
        tensach: book.tensach,
        dongia: book.dongia,
        soquyen: book.soquyen,
        namxuatban: book.namxuatban,
        manxb: book.manxb,
        tacgia: book.tacgia,
      },
      { headers: authHeader() }
    );
  }
}

export default new BorrowBookService();
