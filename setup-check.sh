#!/bin/bash

# ============================================
#  Calorie Tracker — Provjera okruženja
#  Pokreni jednom na novom računaru: bash setup-check.sh
# ============================================

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
RED='\033[0;31m'
NC='\033[0m'
BOLD='\033[1m'

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ERRORS=0

echo ""
echo -e "${CYAN}${BOLD}============================================${NC}"
echo -e "${CYAN}${BOLD}   🔍 Calorie Tracker — Provjera okruženja ${NC}"
echo -e "${CYAN}${BOLD}============================================${NC}"
echo ""

# 1) Node.js
echo -e "${YELLOW}1. Node.js${NC}"
if command -v node &> /dev/null; then
    NODE_VER=$(node --version)
    echo -e "   ${GREEN}✓ Node.js $NODE_VER pronađen${NC}"
else
    echo -e "   ${RED}✗ Node.js nije instaliran!${NC}"
    echo -e "   ${RED}  Instalacija: https://nodejs.org${NC}"
    ERRORS=$((ERRORS+1))
fi

# 2) npm
echo -e "${YELLOW}2. npm${NC}"
if command -v npm &> /dev/null; then
    NPM_VER=$(npm --version)
    echo -e "   ${GREEN}✓ npm $NPM_VER pronađen${NC}"
else
    echo -e "   ${RED}✗ npm nije instaliran!${NC}"
    ERRORS=$((ERRORS+1))
fi

# 3) Root node_modules
echo -e "${YELLOW}3. Root zavisnosti (node_modules)${NC}"
if [ -d "$SCRIPT_DIR/node_modules" ]; then
    echo -e "   ${GREEN}✓ Instalirane${NC}"
else
    echo -e "   ${RED}✗ Nedostaju! Pokreni: npm install${NC}"
    ERRORS=$((ERRORS+1))
fi

# 4) Server node_modules
echo -e "${YELLOW}4. Server zavisnosti (server/node_modules)${NC}"
if [ -d "$SCRIPT_DIR/server/node_modules" ]; then
    echo -e "   ${GREEN}✓ Instalirane${NC}"
else
    echo -e "   ${RED}✗ Nedostaju! Pokreni: cd server && npm install${NC}"
    ERRORS=$((ERRORS+1))
fi

# 5) server/.env
echo -e "${YELLOW}5. Firebase konfiguracija (server/.env)${NC}"
if [ -f "$SCRIPT_DIR/server/.env" ]; then
    # Provjeri da li su pravi ključevi (ne placeholder)
    if grep -q "your-" "$SCRIPT_DIR/server/.env" 2>/dev/null; then
        echo -e "   ${RED}✗ server/.env postoji ali sadrži placeholder vrijednosti!${NC}"
        echo -e "   ${RED}  Popuni Firebase kredencijale.${NC}"
        ERRORS=$((ERRORS+1))
    else
        echo -e "   ${GREEN}✓ server/.env pronađen s kredencijalima${NC}"
    fi
else
    echo -e "   ${RED}✗ server/.env ne postoji!${NC}"
    echo -e "   ${RED}  Kopiraj fajl s originalnog računara ili popuni:${NC}"
    echo -e "   ${RED}  cp server/.env.example server/.env${NC}"
    ERRORS=$((ERRORS+1))
fi

echo ""
echo -e "${CYAN}${BOLD}============================================${NC}"

# Rezultat
if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}${BOLD}   ✅ Sve je spremno! Pokreni: ./start.sh${NC}"
else
    echo -e "${RED}${BOLD}   ✗ Pronađeno $ERRORS problem(a). Popravi ih gore.${NC}"
    echo ""
    echo -e "${YELLOW}Brzo rješenje — instalacija zavisnosti:${NC}"
    echo -e "   npm install"
    echo -e "   cd server && npm install && cd .."
fi

echo -e "${CYAN}${BOLD}============================================${NC}"
echo ""
