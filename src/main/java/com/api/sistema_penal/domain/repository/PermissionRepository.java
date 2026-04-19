package com.api.sistema_penal.domain.repository;

import com.api.sistema_penal.domain.entity.Permission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface PermissionRepository extends JpaRepository<Permission, UUID> {
    
    Optional<Permission> findByName(String name);
    
    List<Permission> findByResource(String resource);
    
    boolean existsByName(String name);
    
    List<Permission> findByUsuarios_Id(UUID usuarioId);
    
    // Busca múltiplas permissões por nomes (otimizado para evitar N+1)
    List<Permission> findByNameIn(Collection<String> names);
}
