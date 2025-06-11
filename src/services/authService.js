import api from './api';

const authService = {
    // Authentication methods
    login: async (email, password) => {
        try {
            const response = await api.login({ email, password });
            return response.data;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    },

    register: async (userData) => {
        try {
            const response = await api.register(userData);
            return response.data;
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        }
    },

    getProfile: async () => {
        try {
            const response = await api.getProfile();
            return response.data?.user || response.data;
        } catch (error) {
            console.error('Error fetching profile:', error);
            throw error;
        }
    },

    resetPassword: async (email, newPassword) => {
        try {
            const response = await api.resetPassword({ email, newPassword });
            return response.data;
        } catch (error) {
            console.error('Password reset error:', error);
            throw error;
        }
    },

    verifyEmail: async (email) => {
        try {
            const response = await api.verifyEmail(email);
            return response.data;
        } catch (error) {
            console.error('Email verification error:', error);
            throw error;
        }
    },

    // User management methods
    getUsers: async () => {
        try {
            const response = await api.getUsers();
            return response.data?.data || response.data || [];
        } catch (error) {
            console.error('Error fetching users:', error);
            throw error;
        }
    },

    getPendingUsers: async () => {
        try {
            const response = await api.getPendingUsers(); // ✅ utiliser la méthode correcte
            if (!response.data?.success) {
                throw new Error(response.data?.message || "Unexpected server response");
            }
            return response.data.data || [];
        } catch (error) {
            console.error('Error getPendingUsers:', error);
            if (error.response?.status === 403) {
                throw new Error("Insufficient permissions to access approvals");
            }
            throw error;
        }
    },

    getUser: async (id) => {
        try {
            const response = await api.getUser(id);
            return response.data;
        } catch (error) {
            console.error('Error fetching user:', error);
            throw error;
        }
    },

    updateUser: async (id, data) => {
        try {
            const response = await api.updateUser(id, data);
            return response.data;
        } catch (error) {
            console.error('Error updating user:', error);
            throw error;
        }
    },

    approveUser: async (id) => {
        try {
            const response = await api.approveUser(id);
            return response.data;
        } catch (error) {
            console.error('Error approving user:', error);
            throw error;
        }
    },

    rejectUser: async (id) => {
        try {
            const response = await api.rejectUser(id);
            return response.data;
        } catch (error) {
            console.error('Error rejecting user:', error);
            throw error;
        }
    },

    deleteUser: async (id) => {
        try {
            const response = await api.deleteUser(id);
            return response.data;
        } catch (error) {
            console.error('Error deleting user:', error);
            throw error;
        }
    },

    refreshToken: async () => {
        try {
            const response = await api.post('/auth/refresh');
            return response.data;
        } catch (error) {
            console.error('Error refreshing token:', error);
            throw error;
        }
    },

    logout: async () => {
        try {
            const response = await api.post('/auth/logout');
            return response.data;
        } catch (error) {
            console.error('Error logging out:', error);
            throw error;
        }
    }
};

export default authService;
