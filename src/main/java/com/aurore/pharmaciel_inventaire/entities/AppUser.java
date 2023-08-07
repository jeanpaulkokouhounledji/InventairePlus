package com.aurore.pharmaciel_inventaire.entities;


import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.Collection;

@Entity
@Table
@Data
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class AppUser {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false)
    private Long id;
    @Column(nullable = false)
    private String nomPrenom;
    @Column(nullable = false)
    private String username;
    @JsonProperty(access = JsonProperty.Access.AUTO)//parse la donnee en ecriture seul. la ligne est absente dans la reponse json
    @Column(nullable = true)
    private String password;
    private boolean etat = true;

    @ManyToMany(fetch = FetchType.EAGER)
    private Collection<AppRole> appRoles = new ArrayList<>();

    public void setId(Long id) {
        this.id = id;
    }

    public Long getId() {
        return id;
    }
}
