package com.aurore.pharmaciel_inventaire.entities;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import javax.persistence.*;
import java.io.Serializable;

@Table
@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor @ToString
public class Localisation implements Serializable {

    @Id
    //@GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @Column(nullable = false, length = 60)
    private String code = "";
    @Column(nullable = false, length =150)
    private String libelle = "";

}
