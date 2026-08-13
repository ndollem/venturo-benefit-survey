#!/usr/bin/env sh
# Hook InstructionsLoaded — mencatat SETIAP kali sebuah file instruksi masuk context.
#
# Dipakai di w06 K3 sebagai alat bukti path-scoped rules:
#   - CLAUDE.md muncul dengan load_reason=session_start  → dibayar di SETIAP sesi
#   - .claude/rules/*.md muncul dengan load_reason=path_glob_match → dibayar HANYA
#     saat Claude menyentuh file yang cocok dengan glob-nya
#
# Output: .claude/rules-load.log (satu baris terbaca) + .claude/rules-load.jsonl (payload mentah)

DIR="${CLAUDE_PROJECT_DIR:-$PWD}/.claude"
mkdir -p "$DIR"

PAYLOAD=$(cat)

# payload mentah, untuk yang ingin melihat seluruh field
printf '%s\n' "$PAYLOAD" >> "$DIR/rules-load.jsonl"

# baris ringkas dan terbaca
printf '%s' "$PAYLOAD" | python3 -c '
import json, os, sys, datetime
try:
    d = json.load(sys.stdin)
except Exception:
    sys.exit(0)

def rapikan(p):
    if not p:
        return ""
    home = os.path.expanduser("~")
    proyek = os.environ.get("CLAUDE_PROJECT_DIR") or os.getcwd()
    if p.startswith(proyek):
        return p[len(proyek):].lstrip("/")
    if p.startswith(home):
        return "~" + p[len(home):]
    return p

jam    = datetime.datetime.now().strftime("%H:%M:%S")
alasan = d.get("load_reason", "?")
jenis  = d.get("memory_type", "?")
berkas = rapikan(d.get("file_path", ""))
pemicu = rapikan(d.get("trigger_file_path", ""))

baris = "{}  {:<16}{:<9}{}".format(jam, alasan, jenis, berkas)
if pemicu:
    baris += "   <- dipicu: " + pemicu
print(baris)
' >> "$DIR/rules-load.log" 2>/dev/null

exit 0
