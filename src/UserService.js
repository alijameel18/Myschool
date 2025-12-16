import axios from 'axios';

const API_BASE_URL = "process.env.REACT_APP_API_BASE_URL";

class UserService {

    getUsers() {
        return axios.get(API_BASE_URL);
    }

    createUser(user) {
        return axios.post(API_BASE_URL, user);
    }

    getUserById(userId) {
        return axios.get(API_BASE_URL + '/' + userId);
    }

    updateUser(user, userId) {
        return axios.put(API_BASE_URL + '/' + userId, user);
    }

    deleteUser(userId) {
        return axios.delete(API_BASE_URL + '/' + userId);
    }
}
console.log(API_BASE_URL);

// New (named variable)
const userService = new UserService();
export default userService;