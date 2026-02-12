package com.travelhub.controller;

import com.travelhub.dto.ContactRequest;
import com.travelhub.dto.MessageResponse;
import com.travelhub.model.Contact;
import com.travelhub.service.ContactService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/contact")
@CrossOrigin(origins = "http://localhost:3000")
public class ContactController {

    @Autowired
    private ContactService contactService;

    @PostMapping("/send")
    public ResponseEntity<?> sendContactMessage(@Valid @RequestBody ContactRequest request) {
        try {
            Contact contact = new Contact();
            contact.setName(request.getName());
            contact.setEmail(request.getEmail());
            contact.setPhone(request.getPhone());
            contact.setSubject(request.getSubject());
            contact.setMessage(request.getMessage());

            Contact savedContact = contactService.createContact(contact);
            return ResponseEntity.ok(new MessageResponse("Message envoyé avec succès"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new MessageResponse("Erreur lors de l'envoi du message: " + e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<List<Contact>> getAllContacts() {
        return ResponseEntity.ok(contactService.getAllContacts());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getContactById(@PathVariable String id) {
        return contactService.getContactById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<Contact>> getContactsByStatus(@PathVariable String status) {
        return ResponseEntity.ok(contactService.getContactsByStatus(status));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateContactStatus(
            @PathVariable String id,
            @RequestParam String status) {
        try {
            Contact updated = contactService.updateContactStatus(id, status);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                .body(new MessageResponse(e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteContact(@PathVariable String id) {
        try {
            contactService.deleteContact(id);
            return ResponseEntity.ok(new MessageResponse("Contact supprimé"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new MessageResponse("Erreur suppression: " + e.getMessage()));
        }
    }
}