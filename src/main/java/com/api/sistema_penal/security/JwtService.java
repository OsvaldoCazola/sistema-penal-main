package com.api.sistema_penal.security;

import com.api.sistema_penal.domain.entity.Usuario;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.Map;
import java.util.function.Function;

@Service
public class JwtService {

    @Value("${jwt.secret}")
    private String secretKey;

    @Value("${jwt.expiration-ms}")
    private long jwtExpiration;

    @Value("${jwt.refresh-expiration-ms}")
    private long refreshExpiration;

    public String generateToken(Usuario usuario) {
        return generateToken(Map.of(), usuario);
    }

    public String generateToken(Map<String, Object> extraClaims, Usuario usuario) {
        return buildToken(extraClaims, usuario, jwtExpiration);
    }

    public String generateRefreshToken(Usuario usuario) {
        return buildToken(Map.of(), usuario, refreshExpiration);
    }

    public String extractUserId(String token) {
        return extractClaim(token, claims -> claims.get("userId", String.class));
    }

    public long getExpirationTime() {
        return jwtExpiration;
    }

    public long getRefreshExpirationTime() {
        return refreshExpiration;
    }

    private String buildToken(Map<String, Object> extraClaims, Usuario usuario, long expiration) {
        return Jwts.builder()
                .claims(extraClaims)
                .claim("role", usuario.getRole().name())
                .claim("nome", usuario.getNome())
                .claim("userId", usuario.getId().toString())
                .subject(usuario.getEmail())
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(getSignInKey(), Jwts.SIG.HS256)
                .compact();
    }

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    public boolean isTokenValid(String token, Usuario usuario) {
        final String username = extractUsername(token);
        return (username.equals(usuario.getEmail())) && !isTokenExpired(token);
    }

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSignInKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    private SecretKey getSignInKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}
