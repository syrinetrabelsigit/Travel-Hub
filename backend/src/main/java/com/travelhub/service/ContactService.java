package com.travelhub.service;

import com.travelhub.model.Contact;
import com.travelhub.repository.ContactRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ContactService {

    @Autowired
    private ContactRepository contactRepository;

    @Autowired
    private EmailService emailService;

    public Contact createContact(Contact contact) {
        contact.setCreatedAt(LocalDateTime.now());
        contact.setUpdatedAt(LocalDateTime.now());
        contact.setStatus("NEW");
        
        Contact savedContact = contactRepository.save(contact);
        
        // Envoyer email de confirmation à l'utilisateur
        sendConfirmationEmail(contact);
        
        // Notifier l'admin (optionnel)
        notifyAdmin(contact);
        
        return savedContact;
    }

    public List<Contact> getAllContacts() {
        return contactRepository.findAll();
    }

    public Optional<Contact> getContactById(String id) {
        return contactRepository.findById(id);
    }

    public List<Contact> getContactsByStatus(String status) {
        return contactRepository.findByStatus(status);
    }

    public Contact updateContactStatus(String id, String status) {
        Optional<Contact> contactOpt = contactRepository.findById(id);
        if (contactOpt.isPresent()) {
            Contact contact = contactOpt.get();
            contact.setStatus(status);
            contact.setUpdatedAt(LocalDateTime.now());
            return contactRepository.save(contact);
        }
        throw new RuntimeException("Contact non trouvé");
    }

    public void deleteContact(String id) {
        contactRepository.deleteById(id);
    }

    private void sendConfirmationEmail(Contact contact) {
        try {
            String subject = "Confirmation de votre message - TravelHub";
            String body = String.format(
                "Bonjour %s,\n\n" +
                "Nous avons bien reçu votre message concernant : %s\n\n" +
                "Notre équipe vous répondra dans les plus brefs délais.\n\n" +
                "Cordialement,\n" +
                "L'équipe TravelHub",
                contact.getName(),
                contact.getSubject()
            );
            emailService.sendEmail(contact.getEmail(), subject, body);
        } catch (Exception e) {
            System.err.println("Erreur envoi email confirmation: " + e.getMessage());
        }
    }

    private void notifyAdmin(Contact contact) {
        try {
            String subject = "Nouveau message de contact - TravelHub";
            String body = String.format(
                "Nouveau message reçu :\n\n" +
                "Nom : %s\n" +
                "Email : %s\n" +
                "Téléphone : %s\n" +
                "Sujet : %s\n\n" +
                "Message :\n%s",
                contact.getName(),
                contact.getEmail(),
                contact.getPhone() != null ? contact.getPhone() : "Non renseigné",
                contact.getSubject(),
                contact.getMessage()
            );
            emailService.sendEmail("admin@travelhub.com", subject, body);
        } catch (Exception e) {
            System.err.println("Erreur notification admin: " + e.getMessage());
        }
    }
}