import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/axios';

const Profile = () => {
    const { user, logout, refreshUserData } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        password: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        
        try {
            // Utilisez user._id au lieu de user.userId
            const response = await api.put(`/users/${user._id}`, {
                name: formData.name,
                email: formData.email,
                ...(formData.password && { password: formData.password })
            });
            
            setSuccess('Profil mis à jour avec succès!');
            await refreshUserData(); // Rafraîchir les données
        } catch (err) {
            console.error("Erreur mise à jour:", err.response?.data);
            setError(err.response?.data?.message || 'Erreur lors de la mise à jour');
        }
    };

    const handleDeleteAccount = async () => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer votre compte ?')) {
            try {
                // Utilisez user._id au lieu de user.userId
                console.log('Utilisateur courant :', user);
                await api.delete(`/users/${user._id || user.userId}`);
                logout();
                navigate('/login');
            } catch (err) {
                console.error("Erreur suppression:", err.response?.data);
                setError(err.response?.data?.message || 'Erreur lors de la suppression');
            }
        }
    };

    if (!user) return <div>Chargement...</div>;

    return (
        <div className="profile-container">
            <h2>Mon Profil</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}
            
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Nom:</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                
                <div className="form-group">
                    <label>Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>

                <button type="submit" className="btn btn-primary">
                    Mettre à jour
                </button>
            </form>
            
            <div className="danger-zone mt-4 p-3 border border-danger rounded">
                <h3 className="text-danger">Zone dangereuse</h3>
                <button 
                    onClick={handleDeleteAccount} 
                    className="btn btn-danger"
                >
                    Supprimer mon compte
                </button>
            </div>
        </div>
    );
};

export default Profile;