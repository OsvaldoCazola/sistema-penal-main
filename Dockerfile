# ── Etapa 1: Build ───────────────────────────────────────────────────────────
FROM eclipse-temurin:17-jdk-alpine AS build

WORKDIR /app

# Instalar Maven
RUN apk add --no-cache maven

# Copiar pom.xml primeiro (camada separada para cache de dependências)
COPY pom.xml .

# Descarregar dependências em camada separada
# Se pom.xml não mudar, esta camada é reutilizada no próximo build
RUN mvn dependency:resolve -B --no-transfer-progress 2>/dev/null || true

# Copiar código fonte e compilar
COPY src ./src
RUN mvn clean package -DskipTests -B --no-transfer-progress

# ── Etapa 2: Runtime ──────────────────────────────────────────────────────────
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Criar utilizador não-root para segurança
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copiar JAR da etapa de build
COPY --from=build /app/target/*.jar app.jar

# Criar directório de logs com permissões correctas
RUN mkdir -p /app/logs && chown -R appuser:appgroup /app

USER appuser

EXPOSE 8080

# JVM tuning para produção:
# -XX:+UseContainerSupport       → respeita limites de CPU/RAM do container
# -XX:MaxRAMPercentage=75.0      → usa no máx 75% da RAM do container para heap
# -XX:+UseG1GC                   → G1 GC balanceia throughput e latência
# -XX:+UseStringDeduplication    → reduz memória para Strings duplicadas
# -Djava.security.egd             → melhora tempo de arranque em containers
ENTRYPOINT ["java", \
    "-XX:+UseContainerSupport", \
    "-XX:MaxRAMPercentage=75.0", \
    "-XX:+UseG1GC", \
    "-XX:+UseStringDeduplication", \
    "-Djava.security.egd=file:/dev/./urandom", \
    "-Dspring.profiles.active=${SPRING_PROFILE:-default}", \
    "-jar", "app.jar"]
