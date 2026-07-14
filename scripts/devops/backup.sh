#!/bin/bash

# ====================================================================
# UTTECAM API - Script de Backup Automático
# ====================================================================
# 
# Este script crea backups de:
# - Base de datos MySQL
# - Directorio uploads/
# - Archivos de configuración
#
# Uso: ./scripts/devops/backup.sh
# Programar en crontab: 0 2 * * * /path/to/backup.sh
# ====================================================================

set -e

# Configuración
BACKUP_DIR="./backups"
DB_BACKUP_DIR="$BACKUP_DIR/database"
FILES_BACKUP_DIR="$BACKUP_DIR/files"
CONFIG_BACKUP_DIR="$BACKUP_DIR/config"
RETENTION_DAYS=30

# Cargar variables de entorno
if [ -f .env ]; then
    source .env
else
    echo "Error: Archivo .env no encontrado"
    exit 1
fi

# Timestamp para el backup
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
DATE_PREFIX=$(date +%Y%m%d)

# Colores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}════════════════════════════════════════════════${NC}"
echo -e "${BLUE}  UTTECAM API - Backup Automático               ${NC}"
echo -e "${BLUE}  Fecha: $(date '+%Y-%m-%d %H:%M:%S')          ${NC}"
echo -e "${BLUE}════════════════════════════════════════════════${NC}"
echo ""

# Crear directorios de backup si no existen
mkdir -p "$DB_BACKUP_DIR" "$FILES_BACKUP_DIR" "$CONFIG_BACKUP_DIR"

# ====================================================================
# 1. BACKUP DE BASE DE DATOS
# ====================================================================
echo -e "${BLUE}[1/4] Creando backup de base de datos...${NC}"

DB_BACKUP_FILE="$DB_BACKUP_DIR/db_${DATE_PREFIX}_${TIMESTAMP}.sql"
DB_BACKUP_GZ="$DB_BACKUP_FILE.gz"

if mysqldump -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -p"$DB_PASSWORD" \
    --single-transaction \
    --routines \
    --triggers \
    --events \
    --skip-lock-tables \
    "$DB_NAME" > "$DB_BACKUP_FILE" 2>/dev/null; then
    
    # Comprimir backup
    gzip -f "$DB_BACKUP_FILE"
    
    SIZE=$(du -h "$DB_BACKUP_GZ" | cut -f1)
    echo -e "${GREEN}✓${NC} Base de datos respaldada: $DB_BACKUP_GZ ($SIZE)"
else
    echo -e "${RED}✗${NC} Error al respaldar base de datos"
    exit 1
fi

# ====================================================================
# 2. BACKUP DE ARCHIVOS UPLOADS
# ====================================================================
echo -e "${BLUE}[2/4] Creando backup de uploads...${NC}"

if [ -d "uploads" ]; then
    UPLOADS_BACKUP="$FILES_BACKUP_DIR/uploads_${DATE_PREFIX}_${TIMESTAMP}.tar.gz"
    
    tar -czf "$UPLOADS_BACKUP" uploads/ 2>/dev/null || true
    
    if [ -f "$UPLOADS_BACKUP" ]; then
        SIZE=$(du -h "$UPLOADS_BACKUP" | cut -f1)
        echo -e "${GREEN}✓${NC} Uploads respaldados: $UPLOADS_BACKUP ($SIZE)"
    else
        echo -e "${RED}✗${NC} Error al respaldar uploads"
    fi
else
    echo -e "${BLUE}ℹ${NC} Directorio uploads no existe, saltando..."
fi

# ====================================================================
# 3. BACKUP DE CONFIGURACIÓN
# ====================================================================
echo -e "${BLUE}[3/4] Creando backup de configuración...${NC}"

CONFIG_BACKUP="$CONFIG_BACKUP_DIR/config_${DATE_PREFIX}_${TIMESTAMP}.tar.gz"

# Archivos de configuración a respaldar
tar -czf "$CONFIG_BACKUP" \
    .env \
    ecosystem.config.json \
    package.json \
    tsconfig.json \
    2>/dev/null || true

if [ -f "$CONFIG_BACKUP" ]; then
    SIZE=$(du -h "$CONFIG_BACKUP" | cut -f1)
    echo -e "${GREEN}✓${NC} Configuración respaldada: $CONFIG_BACKUP ($SIZE)"
else
    echo -e "${RED}✗${NC} Error al respaldar configuración"
fi

# ====================================================================
# 4. LIMPIEZA DE BACKUPS ANTIGUOS
# ====================================================================
echo -e "${BLUE}[4/4] Limpiando backups antiguos (>$RETENTION_DAYS días)...${NC}"

DELETED=0

# Limpiar backups de base de datos
find "$DB_BACKUP_DIR" -name "*.sql.gz" -type f -mtime +$RETENTION_DAYS -delete
DELETED=$((DELETED + $?))

# Limpiar backups de archivos
find "$FILES_BACKUP_DIR" -name "*.tar.gz" -type f -mtime +$RETENTION_DAYS -delete
DELETED=$((DELETED + $?))

# Limpiar backups de configuración
find "$CONFIG_BACKUP_DIR" -name "*.tar.gz" -type f -mtime +$RETENTION_DAYS -delete
DELETED=$((DELETED + $?))

if [ $DELETED -eq 0 ]; then
    echo -e "${GREEN}✓${NC} Backups antiguos eliminados"
else
    echo -e "${BLUE}ℹ${NC} No hay backups antiguos para eliminar"
fi

# ====================================================================
# RESUMEN
# ====================================================================
echo ""
echo -e "${BLUE}════════════════════════════════════════════════${NC}"
echo -e "${GREEN}✓ Backup completado exitosamente${NC}"
echo -e "${BLUE}════════════════════════════════════════════════${NC}"
echo ""
echo "Archivos creados:"
echo "  - Base de datos: $DB_BACKUP_GZ"
[ -f "$UPLOADS_BACKUP" ] && echo "  - Uploads: $UPLOADS_BACKUP"
[ -f "$CONFIG_BACKUP" ] && echo "  - Configuración: $CONFIG_BACKUP"
echo ""
echo "Espacio usado por backups:"
du -sh "$BACKUP_DIR"
echo ""
echo "Backups totales:"
echo "  - Base de datos: $(find "$DB_BACKUP_DIR" -name "*.sql.gz" | wc -l)"
echo "  - Archivos: $(find "$FILES_BACKUP_DIR" -name "*.tar.gz" | wc -l)"
echo "  - Configuración: $(find "$CONFIG_BACKUP_DIR" -name "*.tar.gz" | wc -l)"
echo ""

# Registrar en log
LOG_FILE="logs/backup.log"
mkdir -p logs
echo "[$(date '+%Y-%m-%d %H:%M:%S')] Backup completado: $TIMESTAMP" >> "$LOG_FILE"

exit 0
