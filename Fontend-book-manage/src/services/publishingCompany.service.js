import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:3000/api/nha-xuat-ban';

class PublishingCompanyService {
  list(req) {
    return axios
      .post(API_URL + '/search', {
        tennxb: req.tennxb,
      })
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

  create(publishingCompany) {
    return axios.post(
      API_URL + '/create',
      {
        tennxb: publishingCompany.tennxb,
        diachi: publishingCompany.diachi,
      },
      { headers: authHeader() }
    );
  }

  update(publishingCompany, id) {
    return axios.patch(
      API_URL + `/${id}`,
      {
        tennxb: publishingCompany.tennxb,
        diachi: publishingCompany.diachi,
      },
      { headers: authHeader() }
    );
  }
}

export default new PublishingCompanyService();
