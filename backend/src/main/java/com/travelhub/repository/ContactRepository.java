package com.travelhub.repository;

import com.travelhub.model.Contact;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ContactRepository extends MongoRepository<Contact, String> {
    List<Contact> findByStatus(String status);
    List<Contact> findByEmailOrderByCreatedAtDesc(String email);
}