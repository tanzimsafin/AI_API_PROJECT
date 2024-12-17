import axios from 'axios';
import { LocalStorage } from 'node-localstorage';

// Create a localStorage instance
const localStorage = new LocalStorage('./scratch');

const token = localStorage.getItem('token');

axios.get('http://localhost:8080/app/v1/user/data', {
  headers: {
    'x-access-token': token
  }
})
.then(response => {
  console.log('Data:', response.data);
})
.catch(error => {
  console.error('Error:', error);
});