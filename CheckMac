#!/bin/bash
# ==============================================================================
# CheckMac - MacBook Hardware, S.M.A.R.T & Battery Forensics Suite
# Double-click this file to launch on any MacBook / Mac (Apple Silicon & Intel)
# ==============================================================================

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$DIR"

echo "======================================================================"
echo "           CHECKMAC - MACBOOK HARDWARE & SSD DIAGNOSTICS"
echo "======================================================================"
echo ""
echo "Đang khởi động hệ thống chẩn đoán S.M.A.R.T & phần cứng MacBook..."
echo ""

# Ensure execution permissions for bundled binaries on fresh machines
chmod +x "$DIR/app.py" 2>/dev/null
chmod +x "$DIR/bin/"* 2>/dev/null

# Check python3
if command -v python3 &>/dev/null; then
    python3 "$DIR/app.py"
elif command -v python &>/dev/null; then
    python "$DIR/app.py"
else
    echo "[-] Lỗi: Không tìm thấy Python 3 trên máy Mac của bạn."
    echo "[-] Vui lòng mở file index.html trực tiếp bằng trình duyệt."
    read -p "Nhấn Enter để thoát..."
fi
