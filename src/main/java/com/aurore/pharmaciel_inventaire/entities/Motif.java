package com.aurore.pharmaciel_inventaire.entities;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import javax.persistence.*;
import java.io.Serializable;

@Entity
@Table
@ToString
@AllArgsConstructor
@NoArgsConstructor
@Data
public class Motif implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;
    @Column
    private String code;
    @Column
    private String libelle;

}
