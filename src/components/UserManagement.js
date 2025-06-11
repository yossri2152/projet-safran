import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user: currentUser } = useAuth();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await api.get('/users');
                setUsers(response.data);
            } catch (error) {
                console.error("Error fetching users:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    const handleDelete = async (userId) => {
        if (window.confirm("Confirmer la suppression de cet utilisateur ?")) {
            try {
                await api.delete(`/users/${userId}`);
                setUsers(users.filter(u => u._id !== userId));
            } catch (error) {
                console.error("Delete error:", error);
            }
        }
    };

    if (loading) return <div>Chargement...</div>;

    return (
        <div className="user-management">
            <h2>Gestion des Utilisateurs</h2>
            <table className="user-table">
                <thead>
                    <tr>
                        <th>Nom</th>
                        <th>Email</th>
                        <th>Rôle</th>
                        <th>Statut</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user._id}>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.role}</td>
                            <td>{user.approved ? 'Approuvé' : 'En attente'}</td>
                            <td>
                                <button className="btn-edit">Modifier</button>
                                {user._id !== currentUser._id && (
                                    <button 
                                        className="btn-delete"
                                        onClick={() => handleDelete(user._id)}
                                    >
                                        Supprimer
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default UserManagement;