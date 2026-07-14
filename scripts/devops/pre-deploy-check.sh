#!/bin/bash

# ====================================================================
# UTTECAM API - Script de Validación Pre-Deploy
# ====================================================================
# 
# Este script verifica que todos los requisitos estén cumplidos
# antes de desplegar a producción
#
# Uso: ./scripts/devops/pre-deploy-check.sh
# ====================================================================

set -e

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Contadores
CHECKS_PASSED=0
CHECKS_FAILED=0
WARNINGS=0

echo -e "${BLUE}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  UTTECAM API - Validación Pre-Deployment              ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════╝${NC}"
echo ""

# Función para check exitoso
check_pass() {
    echo -e "${GREEN}✓${NC} $1"
    ((CHECKS_PASSED++))
}

# Función para check fallido
check_fail() {
    echo -e "${RED}✗${NC} $1"
    ((CHECKS_FAILED++))
}

# Función para warning
check_warn() {
    echo -e "${YELLOW}⚠${NC} $1"
    ((WARNINGS++))
}

echo -e "${BLUE}[1/10] Verificando Node.js y npm...${NC}"
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    if [[ "${NODE_VERSION//v/}" > "18.0.0" ]] || [[ "${NODE_VERSION//v/}" == "18.0.0" ]]; then
        check_pass "Node.js instalado: $NODE_VERSION"
    else
        check_fail "Node.js versión muy antigua: $NODE_VERSION (se requiere >= 18.0.0)"
    fi
else
    check_fail "Node.js no está instalado"
fi

if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm -v)
    check_pass "npm instalado: $NPM_VERSION"
else
    check_fail "npm no está instalado"
fi

echo ""
echo -e "${BLUE}[2/10] Verificando archivo .env...${NC}"
if [ -f .env ]; then
    check_pass "Archivo .env existe"
    
    # Verificar variables críticas
    source .env
    
    if [ "$NODE_ENV" = "production" ]; then
        check_pass "NODE_ENV configurado como 'production'"
    else
        check_warn "NODE_ENV no está en 'production' (valor actual: $NODE_ENV)"
    fi
    
    if [ "$JWT_SECRET" = "CHANGE_THIS_TO_RANDOM_64_CHAR_STRING" ] || [ -z "$JWT_SECRET" ]; then
        check_fail "JWT_SECRET no ha sido configurado"
    else
        if [ ${#JWT_SECRET} -ge 32 ]; then
            check_pass "JWT_SECRET configurado (longitud: ${#JWT_SECRET})"
        else
            check_fail "JWT_SECRET muy corto (longitud: ${#JWT_SECRET}, mínimo: 32)"
        fi
    fi
    
    if [ -z "$DB_HOST" ] || [ -z "$DB_NAME" ] || [ -z "$DB_USER" ] || [ -z "$DB_PASSWORD" ]; then
        check_fail "Credenciales de base de datos incompletas"
    else
        check_pass "Credenciales de base de datos configuradas"
    fi
    
    if [ "$DB_PASSWORD" = "CHANGE_THIS_PASSWORD" ]; then
        check_fail "DB_PASSWORD no ha sido cambiado del valor por defecto"
    fi
    
else
    check_fail "Archivo .env no existe (copiar de .env.example)"
fi

echo ""
echo -e "${BLUE}[3/10] Verificando dependencias...${NC}"
if [ -d node_modules ]; then
    check_pass "node_modules existe"
else
    check_fail "node_modules no existe (ejecutar: npm install)"
fi

if [ -f package-lock.json ]; then
    check_pass "package-lock.json existe"
else
    check_warn "package-lock.json no existe"
fi

echo ""
echo -e "${BLUE}[4/10] Verificando build de producción...${NC}"
if [ -d dist ]; then
    check_pass "Directorio dist/ existe"
    
    if [ -f dist/server.js ]; then
        check_pass "dist/server.js existe"
    else
        check_fail "dist/server.js no existe (ejecutar: npm run build)"
    fi
else
    check_fail "Directorio dist/ no existe (ejecutar: npm run build)"
fi

echo ""
echo -e "${BLUE}[5/10] Verificando estructura de directorios...${NC}"
for dir in uploads logs public; do
    if [ -d "$dir" ]; then
        check_pass "Directorio $dir/ existe"
    else
        check_warn "Directorio $dir/ no existe (se creará automáticamente)"
    fi
done

echo ""
echo -e "${BLUE}[6/10] Verificando permisos de escritura...${NC}"
for dir in uploads logs; do
    if [ -d "$dir" ]; then
        if [ -w "$dir" ]; then
            check_pass "Permisos de escritura OK en $dir/"
        else
            check_fail "Sin permisos de escritura en $dir/"
        fi
    fi
done

echo ""
echo -e "${BLUE}[7/10] Verificando configuración PM2...${NC}"
if [ -f ecosystem.config.json ]; then
    check_pass "ecosystem.config.json existe"
else
    check_warn "ecosystem.config.json no existe"
fi

if command -v pm2 &> /dev/null; then
    check_pass "PM2 instalado globalmente"
else
    check_warn "PM2 no instalado globalmente (ejecutar: npm install -g pm2)"
fi

echo ""
echo -e "${BLUE}[8/10] Verificando archivos críticos...${NC}"
CRITICAL_FILES=("package.json" "tsconfig.json" "src/server.ts" "src/app.ts")
for file in "${CRITICAL_FILES[@]}"; do
    if [ -f "$file" ]; then
        check_pass "Archivo $file existe"
    else
        check_fail "Archivo $file NO EXISTE"
    fi
done

echo ""
echo -e "${BLUE}[9/10] Verificando conectividad de base de datos...${NC}"
if [ -n "$DB_HOST" ] && [ -n "$DB_PORT" ]; then
    if command -v nc &> /dev/null; then
        if nc -z -w5 "$DB_HOST" "$DB_PORT" 2>/dev/null; then
            check_pass "Base de datos accesible en $DB_HOST:$DB_PORT"
        else
            check_fail "No se puede conectar a $DB_HOST:$DB_PORT"
        fi
    else
        check_warn "netcat no instalado, saltando test de conectividad"
    fi
fi

echo ""
echo -e "${BLUE}[10/10] Verificando puertos...${NC}"
if [ -n "$PORT" ]; then
    if command -v lsof &> /dev/null; then
        if lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null 2>&1; then
            check_warn "Puerto $PORT ya está en uso"
        else
            check_pass "Puerto $PORT disponible"
        fi
    else
        check_warn "lsof no instalado, saltando verificación de puertos"
    fi
fi

# Resumen
echo ""
echo -e "${BLUE}════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}                    RESUMEN                             ${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}Checks exitosos:${NC} $CHECKS_PASSED"
echo -e "${RED}Checks fallidos:${NC} $CHECKS_FAILED"
echo -e "${YELLOW}Advertencias:${NC} $WARNINGS"
echo ""

if [ $CHECKS_FAILED -eq 0 ]; then
    echo -e "${GREEN}╔════════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║  ✓ LISTO PARA DEPLOY                                  ║${NC}"
    echo -e "${GREEN}╚════════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${BLUE}Próximos pasos:${NC}"
    echo "  1. npm run build"
    echo "  2. npm run create:admin (si no existe usuario admin)"
    echo "  3. pm2 start ecosystem.config.json"
    echo "  4. pm2 save"
    echo "  5. pm2 startup"
    exit 0
else
    echo -e "${RED}╔════════════════════════════════════════════════════════╗${NC}"
    echo -e "${RED}║  ✗ NO LISTO PARA DEPLOY                               ║${NC}"
    echo -e "${RED}╚════════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${RED}Por favor corrige los errores antes de desplegar${NC}"
    exit 1
fi
