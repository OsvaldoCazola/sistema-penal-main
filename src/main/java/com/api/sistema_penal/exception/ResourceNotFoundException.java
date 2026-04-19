package com.api.sistema_penal.exception;

public class ResourceNotFoundException extends RuntimeException {

    public ResourceNotFoundException(String message) {
        super(message);
    }

    public ResourceNotFoundException(String resource, Object id) {
        super(String.format("%s não encontrado com id: %s", resource, id));
    }
}
