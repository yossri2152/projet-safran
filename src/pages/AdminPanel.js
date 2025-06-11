import { useState, useEffect } from 'react';
import authService from '../services/authService'; // ✅ corriger l'import
import { useAuth } from '../context/AuthContext';
import './AdminPanel.css';

const AdminPanel = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [pendingUsers, setPendingUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('users');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState({
    users: false,
    approvals: false
  });
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user'
  });

  const fetchData = async () => {
    try {
      setLoading(prev => ({ ...prev, [activeTab]: true }));
      setError('');

      switch (activeTab) {
        case 'users':
          const usersResponse = await authService.getUsers(); // ✅
          const usersData = usersResponse?.data || usersResponse;
          setUsers(Array.isArray(usersData) ? usersData : []);
          break;
        case 'approvals':
          const pendingResponse = await authService.getPendingUsers(); // ✅
          const pendingData = pendingResponse?.data || pendingResponse;
          setPendingUsers(Array.isArray(pendingData) ? pendingData : []);
          break;
      }
    } catch (error) {
      console.error(`Erreur de chargement des ${activeTab}:`, error);
      setError(`Erreur lors du chargement des ${activeTab}`);
      if (error.response?.status === 403) {
        setError("Vous n'avez pas les permissions nécessaires");
      }
    } finally {
      setLoading(prev => ({ ...prev, [activeTab]: false }));
    }
  };

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchData();
    }
  }, [activeTab, user]);

  const handleApprove = async (userId) => {
    try {
      await authService.approveUser(userId); // ✅
      setPendingUsers(prev => prev.filter(user => user._id !== userId));
      const updatedUsers = await authService.getUsers(); // ✅
      setUsers(Array.isArray(updatedUsers) ? updatedUsers : []);
      setSuccess('Utilisateur approuvé avec succès');
    } catch (error) {
      console.error('Erreur lors de l\'approbation:', error);
      setError('Erreur lors de l\'approbation de l\'utilisateur');
    }
  };

  const handleReject = async (userId) => {
    try {
      await authService.rejectUser(userId); // ✅
      setPendingUsers(prev => prev.filter(user => user._id !== userId));
      setSuccess('Demande rejetée avec succès');
    } catch (error) {
      console.error('Erreur lors du rejet:', error);
      setError('Erreur lors du rejet de l\'utilisateur');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      try {
        await authService.deleteUser(userId); // ✅
        setUsers(prev => prev.filter(user => user._id !== userId));
        setSuccess('Utilisateur supprimé avec succès');
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        setError('Erreur lors de la suppression de l\'utilisateur');
      }
    }
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: '',
      role: user.role
    });
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      const updateData = {
        name: formData.name,
        email: formData.email,
        role: formData.role
      };

      if (formData.password) {
        updateData.password = formData.password;
      }

      const updatedUser = await authService.updateUser(editingUser._id, updateData); // ✅
      setUsers(users.map(u => u._id === editingUser._id ? updatedUser : u));

      setEditingUser(null);
      setFormData({ name: '', email: '', password: '', role: 'user' });

      setSuccess('Utilisateur mis à jour avec succès');
      setError('');
    } catch (error) {
      console.error('Erreur de mise à jour:', error);
      setError(error.response?.data?.message || 'Erreur lors de la mise à jour de l\'utilisateur');
    }
  };

  if (!user || user?.role !== 'admin') {
    return <div className="admin-access-denied">Accès réservé aux administrateurs</div>;
  }

  return (
    <div className="admin-container">
      <div className="admin-sidebar">
        <div className="admin-header">
          <h3>Panneau d'administration</h3>
          <p>Connecté en tant que {user.name}</p>
        </div>
        <ul className="admin-nav">
          <li className={activeTab === 'users' ? 'active' : ''} onClick={() => setActiveTab('users')}>
            <i className="fas fa-users"></i> Gestion Utilisateurs
          </li>
          <li className={activeTab === 'approvals' ? 'active' : ''} onClick={() => setActiveTab('approvals')}>
            <i className="fas fa-clipboard-check"></i> Demandes ({pendingUsers.length})
          </li>
        </ul>
      </div>

      <div className="admin-content">
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        {activeTab === 'users' && (
          <section className="admin-section">
            <h2>Gestion des utilisateurs</h2>
            {loading.users ? (
              <div>Chargement des utilisateurs...</div>
            ) : (
              <>
                {editingUser && (
                  <div className="edit-user-form">
                    <h3>Modifier l'utilisateur</h3>
                    <form onSubmit={handleUpdateUser}>
                      <div className="form-group">
                        <label>Nom:</label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Email:</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Rôle:</label>
                        <select
                          name="role"
                          value={formData.role}
                          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        >
                          <option value="user">Utilisateur</option>
                          <option value="technicien">Technicien</option>
                          <option value="admin">Administrateur</option>
                        </select>
                      </div>
                      <button type="submit" className="btn btn-primary">Enregistrer</button>
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => setEditingUser(null)}
                      >
                        Annuler
                      </button>
                    </form>
                  </div>
                )}
                <div className="user-list">
                  <table>
                    <thead>
                      <tr>
                        <th>Nom</th>
                        <th>Email</th>
                        <th>Rôle</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map(user => (
                        <tr key={user._id}>
                          <td>{user.name}</td>
                          <td>{user.email}</td>
                          <td>{user.role}</td>
                          <td className="actions">
                            <button className="edit-btn" onClick={() => handleEditUser(user)}>
                              Modifier
                            </button>
                            <button className="delete-btn" onClick={() => handleDeleteUser(user._id)}>
                              Supprimer
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </section>
        )}

        {activeTab === 'approvals' && (
          <section className="admin-section">
            <h2>Demandes d'approbation</h2>
            {loading.approvals ? (
              <div>Chargement des demandes...</div>
            ) : pendingUsers.length === 0 ? (
              <p>Aucune demande en attente</p>
            ) : (
              <div className="approval-list">
                <table>
                  <thead>
                    <tr>
                      <th>Nom</th>
                      <th>Email</th>
                      <th>Rôle</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingUsers.map(user => (
                      <tr key={user._id}>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>{user.role}</td>
                        <td className="actions">
                          <button className="approve-btn" onClick={() => handleApprove(user._id)}>
                            Approuver
                          </button>
                          <button className="reject-btn" onClick={() => handleReject(user._id)}>
                            Rejeter
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
