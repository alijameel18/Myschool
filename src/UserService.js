import axios from 'axios';

const API_BASE_URL = "https://myschool1-production.up.railway.app/api/v1/users";

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

// New (named variable)
const userService = new UserService();
export default userService;