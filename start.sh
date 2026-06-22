#!/bin/bash

# ============================================
#  Calorie Tracker — Pokretanje aplikacije
# ============================================

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
RED='\033[0;31m'
NC='\033[0m'
BOLD='\033[1m'

# Uvijek radi iz foldera gdje se skripta nalazi (apsolutni path)
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"

echo ""
echo -e "${CYAN}${BOLD}=====================================${NC}"
echo -e "${CYAN}${BOLD}   🍎 Calorie Tracker — Start        ${NC}"
echo -e "${CYAN}${BOLD}=====================================${NC}"
echo ""

# 1) Ubij stare procese i oslobodi portove
echo -e "${YELLOW}⏳ Zaustavljam stare procese...${NC}"
pkill -f "expo start" 2>/dev/null
pkill -f "metro"      2>/dev/null
lsof -ti tcp:3001 | xargs kill -9 2>/dev/null && echo -e "   ${GREEN}✓ Port 3001 oslobođen${NC}" || echo -e "   Port 3001 bio slobodan"
lsof -ti tcp:8081 | xargs kill -9 2>/dev/null && echo -e "   ${GREEN}✓ Port 8081 oslobođen${NC}" || echo -e "   Port 8081 bio slobodan"
sleep 1

# 2) Obriši Metro keš (sprječava pokretanje iz pogrešnog foldera)
echo -e "${YELLOW}🗑️  Brišem Expo/Metro keš...${NC}"
rm -rf "$SCRIPT_DIR/.expo/web/cache" 2>/dev/null
rm -rf "$TMPDIR/metro-*" 2>/dev/null
rm -rf "$TMPDIR/haste-*" 2>/dev/null
echo -e "   ${GREEN}✓ Keš obrisan${NC}"

# 3) Pokreni backend server
echo ""
echo -e "${YELLOW}🚀 Pokretam Firebase backend (port 3001)...${NC}"
(cd "$SCRIPT_DIR/server" && node index.js >> /tmp/ct-server.log 2>&1) &

sleep 3

if curl -s http://localhost:3001/health > /dev/null 2>&1; then
    echo -e "   ${GREEN}✓ Backend radi na http://localhost:3001${NC}"
    echo -e "   ${GREEN}✓ Firebase baza povezana${NC}"
else
    echo -e "   ${RED}✗ Server se nije pokrenuo!${NC}"
    cat /tmp/ct-server.log
    exit 1
fi

# 4) Pokreni Expo IZ KORIJENSKOG FOLDERA s --clear flagom
echo ""
echo -e "${YELLOW}📱 Pokretam Expo app...${NC}"
echo ""
echo -e "${CYAN}${BOLD}=====================================${NC}"
echo -e "${CYAN}${BOLD}   ✅ Sve radi!                       ${NC}"
echo -e "${CYAN}${BOLD}   🌐 Web app: http://localhost:8081  ${NC}"
echo -e "${CYAN}${BOLD}   🔧 API:     http://localhost:3001  ${NC}"
echo -e "${CYAN}${BOLD}   📱 Skeniraj QR za mobitel          ${NC}"
echo -e "${CYAN}${BOLD}=====================================${NC}"
echo ""

# --clear briše Metro keš pri pokretanju
npx expo start --web --port 8081 --clear
