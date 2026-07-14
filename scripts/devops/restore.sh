#!/bin/bash

# ====================================================================
# UTTECAM API - Script de Restauración de Backup
# ====================================================================
# 
# Este script restaura backups creados por backup.sh
#
# Uso: ./scripts/devops/restore.sh [FECHA]
# Ejemplo: ./scripts/devops/restore.sh 20260114
# Si no se proporciona fecha, muestra backups disponibles
# ====================================================================

set -e

# Configuración
BACKUP_DIR="./backups"
DB_BACKUP_DIR="$BACKUP_DIR/database"
FILES_BACKUP_DIR="$BACKUP_DIR/files"
CONFIG_BACKUP_DIR="$BACKUP_DIR/config"

# Colores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Cargar variables de entorno
if [ -f .env ]; then
    source .env
else
    echo -e "${RED}Error: Archivo .env no encontrado${NC}"
    exit 1
fi

# Función para listar backups
list_backups() {
    echo -e "${BLUE}════════════════════════════════════════════════${NC}"
    echo -e "${BLUE}  Backups Disponibles                          ${NC}"
    echo -e "${BLUE}════════════════════════════════════════════════${NC}"
    echo ""
    
    echo -e "${YELLOW}Base de Datos:${NC}"
    ls -lh "$DB_BACKUP_DIR"/*.sql.gz 2>/dev/null | awk '{print "  " $9 " (" $5 ")"}' || echo "  Ninguno"
    echo ""
    
    echo -e "${YELLOW}Archivos:${NC}"
    ls -lh "$FILES_BACKUP_DIR"/*.tar.gz 2>/dev/null | awk '{print "  " $9 " (" $5 ")"}' || echo "  Ninguno"
    echo ""
    
    echo -e "${YELLOW}Configuración:${NC}"
    ls -lh "$CONFIG_BACKUP_DIR"/*.tar.gz 2>/dev/null | awk '{print "  " $9 " (" $5 ")"}' || echo "  Ninguno"
    echo ""
}

# Si no se proporciona fecha, mostrar backups disponibles
if [ -z "$1" ]; then
    list_backups
    echo -e "${BLUE}Uso: $0 [FECHA]${NC}"
    echo -e "${BLUE}Ejemplo: $0 20260114${NC}"
    exit 0
fi

DATE_PREFIX=$1

echo -e "${BLUE}════════════════════════════════════════════════${NC}"
echo -e "${BLUE}  UTTECAM API - Restauración de Backup          ${NC}"
echo -e "${BLUE}  Fecha del backup: $DATE_PREFIX                ${NC}"
echo -e "${BLUE}════════════════════════════════════════════════${NC}"
echo ""

# Buscar archivos de backup
DB_BACKUP=$(ls "$DB_BACKUP_DIR"/db_${DATE_PREFIX}*.sql.gz 2>/dev/null | head -1)
UPLOADS_BACKUP=$(ls "$FILES_BACKUP_DIR"/uploads_${DATE_PREFIX}*.tar.gz 2>/dev/null | head -1)
CONFIG_BACKUP=$(ls "$CONFIG_BACKUP_DIR"/config_${DATE_PREFIX}*.tar.gz 2>/dev/null | head -1)

if [ -z "$DB_BACKUP" ]; then
    echo -e "${RED}Error: No se encontró backup de base de datos para la fecha $DATE_PREFIX${NC}"
    echo ""
    list_backups
    exit 1
fi

# Confirmación
echo -e "${YELLOW}⚠ ADVERTENCIA: Esta operación sobrescribirá datos actuales${NC}"
echo ""
echo "Se restaurarán los siguientes backups:"
[ -n "$DB_BACKUP" ] && echo "  - Base de datos: $DB_BACKUP"
[ -n "$UPLOADS_BACKUP" ] && echo "  - Uploads: $UPLOADS_BACKUP"
[ -n "$CONFIG_BACKUP" ] && echo "  - Configuración: $CONFIG_BACKUP"
echo ""
read -p "¿Continuar? (escribir 'SI' para confirmar): " CONFIRM

if [ "$CONFIRM" != "SI" ]; then
    echo -e "${BLUE}Operación cancelada${NC}"
    exit 0
fi

# ====================================================================
# 1. RESTAURAR BASE DE DATOS
# ====================================================================
echo ""
echo -e "${BLUE}[1/3] Restaurando base de datos...${NC}"

# Crear backup de seguridad de la BD actual
SAFETY_BACKUP="$DB_BACKUP_DIR/safety_before_restore_$(date +%Y%m%d_%H%M%S).sql.gz"
echo -e "${BLUE}  Creando backup de seguridad...${NC}"
mysqldump -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -p"$DB_PASSWORD" \
    --single-transaction "$DB_NAME" 2>/dev/null | gzip > "$SAFETY_BACKUP"
echo -e "${GREEN}  ✓ Backup de seguridad creado: $SAFETY_BACKUP${NC}"

# Restaurar desde backup
echo -e "${BLUE}  Restaurando desde backup...${NC}"
gunzip < "$DB_BACKUP" | mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -p"$DB_PASSWORD" "$DB_NAME"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓${NC} Base de datos restaurada"
else
    echo -e "${RED}✗${NC} Error al restaurar base de datos"
    echo -e "${YELLOW}  Restaurando desde backup de seguridad...${NC}"
    gunzip < "$SAFETY_BACKUP" | mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -p"$DB_PASSWORD" "$DB_NAME"
    exit 1
fi

# ====================================================================
# 2. RESTAURAR UPLOADS
# ====================================================================
echo -e "${BLUE}[2/3] Restaurando uploads...${NC}"

if [ -n "$UPLOADS_BACKUP" ]; then
    # Backup de seguridad
    if [ -d "uploads" ]; then
        SAFETY_UPLOADS="$FILES_BACKUP_DIR/safety_uploads_$(date +%Y%m%d_%H%M%S).tar.gz"
        echo -e "${BLUE}  Creando backup de seguridad...${NC}"
        tar -czf "$SAFETY_UPLOADS" uploads/ 2>/dev/null
        echo -e "${GREEN}  ✓ Backup de seguridad creado: $SAFETY_UPLOADS${NC}"
        
        # Eliminar uploads actuales
        rm -rf uploads/
    fi
    
    # Restaurar
    echo -e "${BLUE}  Restaurando desde backup...${NC}"
    tar -xzf "$UPLOADS_BACKUP"
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓${NC} Uploads restaurados"
    else
        echo -e "${RED}✗${NC} Error al restaurar uploads"
        if [ -n "$SAFETY_UPLOADS" ]; then
            echo -e "${YELLOW}  Restaurando desde backup de seguridad...${NC}"
            tar -xzf "$SAFETY_UPLOADS"
        fi
    fi
else
    echo -e "${BLUE}ℹ${NC} No hay backup de uploads para esta fecha"
fi

# ====================================================================
# 3. RESTAURAR CONFIGURACIÓN (OPCIONAL)
# ====================================================================
echo -e "${BLUE}[3/3] ¿Restaurar configuración?${NC}"

if [ -n "$CONFIG_BACKUP" ]; then
    read -p "Restaurar archivos de configuración? (s/N): " RESTORE_CONFIG
    
    if [[ "$RESTORE_CONFIG" =~ ^[Ss]$ ]]; then
        # Backup de seguridad
        SAFETY_CONFIG="$CONFIG_BACKUP_DIR/safety_config_$(date +%Y%m%d_%H%M%S).tar.gz"
        echo -e "${BLUE}  Creando backup de seguridad...${NC}"
        tar -czf "$SAFETY_CONFIG" .env ecosystem.config.json package.json tsconfig.json 2>/dev/null
        echo -e "${GREEN}  ✓ Backup de seguridad creado: $SAFETY_CONFIG${NC}"
        
        # Restaurar
        echo -e "${BLUE}  Restaurando desde backup...${NC}"
        tar -xzf "$CONFIG_BACKUP"
        
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}✓${NC} Configuración restaurada"
            echo -e "${YELLOW}⚠ Recuerda reiniciar la aplicación: pm2 restart uttecam-api${NC}"
        else
            echo -e "${RED}✗${NC} Error al restaurar configuración"
        fi
    else
        echo -e "${BLUE}ℹ${NC} Configuración no restaurada"
    fi
else
    echo -e "${BLUE}ℹ${NC} No hay backup de configuración para esta fecha"
fi

# ====================================================================
# RESUMEN
# ====================================================================
echo ""
echo -e "${BLUE}════════════════════════════════════════════════${NC}"
echo -e "${GREEN}✓ Restauración completada${NC}"
echo -e "${BLUE}════════════════════════════════════════════════${NC}"
echo ""
echo "Backups de seguridad creados:"
echo "  - Base de datos: $SAFETY_BACKUP"
[ -n "$SAFETY_UPLOADS" ] && echo "  - Uploads: $SAFETY_UPLOADS"
[ -n "$SAFETY_CONFIG" ] && echo "  - Configuración: $SAFETY_CONFIG"
echo ""
echo -e "${YELLOW}Siguiente paso: Reiniciar aplicación${NC}"
echo "  pm2 restart uttecam-api"
echo ""

# Registrar en log
LOG_FILE="logs/restore.log"
mkdir -p logs
echo "[$(date '+%Y-%m-%d %H:%M:%S')] Restauración completada desde: $DATE_PREFIX" >> "$LOG_FILE"

exit 0
