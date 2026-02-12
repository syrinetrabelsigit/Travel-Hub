import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import adminService from '../../services/adminService';
import './AdminContacts.css';

function AdminContacts() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    try {
      setLoading(true);
      const data = await adminService.getAllContacts();
      setContacts(data);
    } catch (err) {
      setError('Erreur lors du chargement des messages');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (contactId, newStatus) => {
    try {
      await adminService.updateContactStatus(contactId, newStatus);
      setContacts(contacts.map(contact =>
        contact.id === contactId ? { ...contact, status: newStatus } : contact
      ));
    } catch (err) {
      alert('Erreur lors de la mise à jour du statut');
      console.error(err);
    }
  };

  const handleDeleteContact = async (contactId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce message ?')) return;
    try {
      await adminService.deleteContact(contactId);
      setContacts(contacts.filter(contact => contact.id !== contactId));
    } catch (err) {
      alert('Erreur lors de la suppression');
      console.error(err);
    }
  };

  const filteredContacts = contacts.filter(contact => {
    const matchesStatus = filterStatus === 'ALL' || contact.status === filterStatus;
    const matchesSearch =
      contact.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.subject?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusLabel = (status) => {
    switch (status) {
      case 'NEW': return 'Nouveau';
      case 'READ': return 'Lu';
      case 'REPLIED': return 'Répondu';
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className="ac-loading">
        <div className="ac-spinner"></div>
        <p>Chargement des messages...</p>
      </div>
    );
  }

  return (
    <div className="admin-contacts">
      <div className="ac-container">

        {/* Header */}
        <div className="ac-page-header">
          <div className="ac-header-content">
            <Link to="/admin" className="ac-back-link">← Retour au Dashboard</Link>
            <h1 className="ac-page-title">Messages de Contact</h1>
            <p className="ac-page-subtitle">{contacts.length} messages au total</p>
          </div>
          <div className="ac-header-stats">
            <span>{contacts.filter(c => c.status === 'NEW').length}</span>
            <label>Non lus</label>
          </div>
        </div>

        {error && (
          <div className="ac-error-banner">⚠️ {error}</div>
        )}

        {/* Filters */}
        <div className="ac-filters-bar">
          <div className="ac-search-box">
            <span className="ac-search-icon">🔍</span>
            <input
              type="text"
              placeholder="Rechercher par nom, email, sujet..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="ac-search-input"
            />
          </div>

          <div className="ac-filter-group">
            <label>Statut:</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="ac-filter-select"
            >
              <option value="ALL">Tous</option>
              <option value="NEW">Nouveau</option>
              <option value="READ">Lu</option>
              <option value="REPLIED">Répondu</option>
            </select>
          </div>

          <div className="ac-filter-stats">
            Résultats: <span>{filteredContacts.length}</span>
          </div>
        </div>

        {/* Contacts List */}
        <div className="ac-contacts-grid">
          {filteredContacts.length === 0 ? (
            <div className="ac-no-results">
              <p>Aucun message trouvé</p>
            </div>
          ) : (
            filteredContacts.map(contact => (
              <div key={contact.id} className={`ac-contact-card ${contact.status?.toLowerCase()}`}>
                <div className="ac-contact-header">
                  <div className="ac-contact-identity">
                    <div className="ac-avatar">
                      {contact.name?.charAt(0).toUpperCase() || '?'}
                    </div>
                    <div>
                      <h3 className="ac-contact-name">{contact.name}</h3>
                      <p className="ac-contact-email">📧 {contact.email}</p>
                      {contact.phone && (
                        <p className="ac-contact-phone">📞 {contact.phone}</p>
                      )}
                    </div>
                  </div>
                  <select
                    value={contact.status}
                    onChange={(e) => handleStatusChange(contact.id, e.target.value)}
                    className={`ac-status-badge ${contact.status?.toLowerCase()}`}
                  >
                    <option value="NEW">Nouveau</option>
                    <option value="READ">Lu</option>
                    <option value="REPLIED">Répondu</option>
                  </select>
                </div>

                <div className="ac-contact-subject">
                  <span className="ac-subject-icon">📌</span>
                  <strong>{contact.subject}</strong>
                </div>

                <div className="ac-contact-message">
                  <p>{contact.message}</p>
                </div>

                <div className="ac-contact-footer">
                  <span className="ac-contact-date">
                    📅 {contact.createdAt
                      ? new Date(contact.createdAt).toLocaleDateString('fr-FR', {
                          day: '2-digit', month: 'long', year: 'numeric',
                          hour: '2-digit', minute: '2-digit'
                        })
                      : 'N/A'}
                  </span>
                  <div className="ac-contact-actions">
                    <a
                      href={`mailto:${contact.email}`}
                      className="ac-btn-reply"
                      onClick={() => handleStatusChange(contact.id, 'REPLIED')}
                    >
                      ✉️ Répondre
                    </a>
                    <button
                      onClick={() => handleDeleteContact(contact.id)}
                      className="ac-btn-delete"
                    >
                      🗑️ Supprimer
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminContacts;