package com.blooddonation.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import com.blooddonation.model.User;

public interface UserRepository extends JpaRepository<User, Integer> {
    User findByUsername(String username);

    User findByUsernameAndRole(String username, String role);

    User findByUsernameAndPassword(String username, String password);

    List<User> findByRole(String role);
}