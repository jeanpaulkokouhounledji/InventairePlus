package com.aurore.pharmaciel_inventaire.repositories;


import com.aurore.pharmaciel_inventaire.entities.Fournisseur;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FournisseurRepository extends JpaRepository<Fournisseur,Long> {
}
