import axios from 'axios';

const API_BASE_URL = 'https://localhost:7144/api';

export function getStudents() {
  return axios.get(`${API_BASE_URL}/Db/GetStudents`);
}
export function getPeoples() {
  return axios.get(`${API_BASE_URL}/Values/Get`);
}

export function user(username, password) {
  return axios.post(`${API_BASE_URL}/Users/Login?username=${username}&password=${password}`);
}

// export function user(data) {
//   return axios.post(`${API_BASE_URL}/Users/Login`, {data})
// }