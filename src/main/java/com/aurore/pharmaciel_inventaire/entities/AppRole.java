package com.aurore.pharmaciel_inventaire.entities;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import javax.persistence.*;


@Entity
@Table
@Data @ToString @NoArgsConstructor @AllArgsConstructor
public class AppRole {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String roleName;
    private String definition = "";

    public void setId(Long id) {
        this.id = id;
    }

    public Long getId() {
        return id;
    }
}
