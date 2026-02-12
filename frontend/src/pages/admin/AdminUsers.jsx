import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import adminService from '../../services/adminService';
import './AdminUsers.css';

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('ALL');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await adminService.getAllUsers();
      setUsers(data);
    } catch (err) {
      setError('Erreur lors du chargement des utilisateurs');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      return;
    }

    try {
      await adminService.deleteUser(userId);
      setUsers(users.filter(user => user.id !== userId));
      alert('Utilisateur supprimé avec succès');
    } catch (err) {
      alert('Erreur lors de la suppression');
      console.error(err);
    }
  };

  const handleChangeRole = async (userId, newRole) => {
    try {
      await adminService.updateUserRole(userId, newRole);
      setUsers(users.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      ));
      alert('Rôle modifié avec succès');
    } catch (err) {
      alert('Erreur lors de la modification du rôle');
      console.error(err);
    }
  };

  const openUserModal = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedUser(null);
    setShowModal(false);
  };

  // Filtrage des utilisateurs
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = filterRole === 'ALL' || user.role === filterRole;
    
    return matchesSearch && matchesRole;
  });

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="spinner"></div>
        <p>Chargement des utilisateurs...</p>
      </div>
    );
  }

  return (
    <div className="admin-users">
      <div className="au-container">
        {/* Header */}
        <div className="au-page-header">
          <div className="au-header-content">
            <Link to="/admin" className="au-back-link">← Retour au Dashboard</Link>
            <h1 className="au-page-title">Gestion des Utilisateurs</h1>
            <p className="au-page-subtitle">{users.length} utilisateurs au total</p>
          </div>
          <div className="au-header-stats">
            <span>{users.length}</span>
            <label>Utilisateurs</label>
          </div>
        </div>

        {/* Filters */}
        <div className="au-filters-bar">
          <div className="au-search-box">
            <span className="au-search-icon">🔍</span>
            <input
              type="text"
              placeholder="Rechercher par nom ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="au-search-input"
            />
          </div>

          <div className="au-filter-group">
            <label>Rôle:</label>
            <select 
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="au-filter-select"
            >
              <option value="ALL">Tous</option>
              <option value="USER">Utilisateurs</option>
              <option value="ADMIN">Administrateurs</option>
            </select>
          </div>
        </div>

        {/* Users Table */}
        <div className="au-table-container">
          {filteredUsers.length === 0 ? (
            <div className="au-no-results">
              <p>Aucun utilisateur trouvé</p>
            </div>
          ) : (
            <table className="au-users-table">
              <thead>
                <tr>
                  <th>Utilisateur</th>
                  <th>Email</th>
                  <th>Téléphone</th>
                  <th>Rôle</th>
                  <th>Inscription</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(user => (
                  <tr key={user.id}>
                    <td>
                      <div className="user-info">
                        <div className="user-avatar">
                          {user.firstName?.[0]}{user.lastName?.[0]}
                        </div>
                        <div>
                          <div className="user-name">
                            {user.firstName} {user.lastName}
                          </div>
                          <div className="user-id">ID: {user.id}</div>
                        </div>
                      </div>
                    </td>
                    <td>{user.email}</td>
                    <td>{user.phone || 'Non renseigné'}</td>
                    <td>
                      <select
                        value={user.role}
                        onChange={(e) => handleChangeRole(user.id, e.target.value)}
                        className={`role-badge ${user.role.toLowerCase()}`}
                      >
                        <option value="USER">USER</option>
                        <option value="ADMIN">ADMIN</option>
                      </select>
                    </td>
                    <td>
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString('fr-FR') : 'N/A'}
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          onClick={() => openUserModal(user)}
                          className="btn-action view"
                          title="Voir détails"
                        >
                          👁️
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="btn-action delete"
                          title="Supprimer"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modal avec classes au-* */}
        {showModal && selectedUser && (
          <div className="au-modal-overlay" onClick={closeModal}>
            <div className="au-modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="au-modal-header">
                <h2>Détails de l'utilisateur</h2>
                <button onClick={closeModal} className="au-modal-close">×</button>
              </div>
              <div className="au-modal-body">
                <div className="au-detail-group">
                  <label>Nom complet</label>
                  <p>{selectedUser.firstName} {selectedUser.lastName}</p>
                </div>
                <div className="au-detail-group">
                  <label>Email</label>
                  <p>{selectedUser.email}</p>
                </div>
                <div className="au-detail-group">
                  <label>Téléphone</label>
                  <p>{selectedUser.phone || 'Non renseigné'}</p>
                </div>
                <div className="au-detail-group">
                  <label>Date de naissance</label>
                  <p>{selectedUser.dateOfBirth || 'Non renseignée'}</p>
                </div>
                <div className="au-detail-group">
                  <label>Nationalité</label>
                  <p>{selectedUser.nationality || 'Non renseignée'}</p>
                </div>
                <div className="au-detail-group">
                  <label>Rôle</label>
                  <p>
                    <span className={`au-role-badge ${selectedUser.role?.toLowerCase()}`}>
                      {selectedUser.role}
                    </span>
                  </p>
                </div>
                <div className="au-detail-group">
                  <label>Date d'inscription</label>
                  <p>
                    {selectedUser.createdAt 
                      ? new Date(selectedUser.createdAt).toLocaleString('fr-FR')
                      : 'N/A'
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
    </div>
  );
}

export default AdminUsers;
