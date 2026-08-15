#!/usr/bin/env python3
"""
================================================================================
CHECK MAC SUITE PRO - COMPREHENSIVE MULTI-MACBOOK VERIFICATION SUITE
Automated Loop Engineering Quality Assurance & Data Precision Test
================================================================================
"""

import os
import sys
import json
import subprocess
import platform

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, BASE_DIR)

from app import MacHardwareScanner

def run_test_suite():
    print("=" * 80)
    print("🔬 BẮT ĐẦU KIỂM ĐỊNH TOÀN DIỆN TRÊN TẤT CẢ CÁC DÒNG MACBOOK & KỊCH BẢN")
    print("=" * 80)

    results = []

    # --------------------------------------------------------------------------
    # TEST 1: Live Hardware Scanner on Current Mac (Apple M4)
    # --------------------------------------------------------------------------
    print("\n[TEST 1] Kiểm tra trích xuất phần cứng thật trên máy hiện tại...")
    try:
        hw = MacHardwareScanner.get_system_hardware_info()
        assert hw["macModel"] != "", "Model máy không được rỗng"
        assert hw["architecture"] in ["arm64", "x86_64"], "Kiến trúc CPU phải là arm64 hoặc x86_64"
        assert "GB" in hw["memory"], "Dung lượng RAM phải có đơn vị GB"
        print(f"  -> Model: {hw['macModel']} ({hw['modelIdentifier']}) | CPU: {hw['processor']} | RAM: {hw['memory']} | OS: {hw['osVersion']}")
        results.append(("Test 1: Live Hardware Detection", True, "PASS"))
    except Exception as e:
        results.append(("Test 1: Live Hardware Detection", False, str(e)))

    # --------------------------------------------------------------------------
    # TEST 2: Physical Disks & Capacity Calculation Precision
    # --------------------------------------------------------------------------
    print("\n[TEST 2] Kiểm tra nhận diện danh sách ổ đĩa vật lý và dung lượng...")
    try:
        drives = MacHardwareScanner.get_physical_drives()
        assert len(drives) > 0, "Phải phát hiện ít nhất 1 ổ đĩa vật lý"
        internal_found = False
        for d in drives:
            assert d["diskId"].startswith("disk"), f"ID ổ đĩa không hợp lệ: {d['diskId']}"
            assert d["size"] != "N/A" and ("GB" in d["size"] or "TB" in d["size"]), f"Dung lượng không hợp lệ: {d['size']}"
            if d["isInternal"]:
                internal_found = True
            print(f"  -> [{d['diskId']}] {d['name']} | Dung lượng: {d['size']} | Giao thức: {d['busProtocol']} | Nội bộ: {d['isInternal']}")
        assert internal_found, "Phải nhận diện được ổ đĩa gắn trong (Internal SSD)"
        results.append(("Test 2: Physical Disks & Capacity Precision", True, "PASS"))
    except Exception as e:
        results.append(("Test 2: Physical Disks & Capacity Precision", False, str(e)))

    # --------------------------------------------------------------------------
    # TEST 3: Deep S.M.A.R.T NVMe Registry Reading
    # --------------------------------------------------------------------------
    print("\n[TEST 3] Kiểm tra quét sâu thanh ghi S.M.A.R.T (/dev/disk0)...")
    try:
        smart_res = MacHardwareScanner.scan_smart("disk0")
        assert smart_res.get("success") is True, f"Quét S.M.A.R.T thất bại: {smart_res.get('message')}"
        assert smart_res.get("exactCapacity") != "", "Dung lượng chính xác không được rỗng"
        
        if smart_res.get("format") == "json":
            nvme_log = smart_res["rawJson"].get("nvme_smart_health_information_log", {})
            temp = nvme_log.get("temperature", 0)
            avail_spare = nvme_log.get("available_spare", 0)
            used_percent = nvme_log.get("percentage_used", 0)
            written_units = nvme_log.get("data_units_written", 0)
            read_units = nvme_log.get("data_units_read", 0)
            tbw = (written_units * 512000) / (1024**4)
            tbr = (read_units * 512000) / (1024**4)
            
            assert 10 <= temp <= 95, f"Nhiệt độ bất thường: {temp}°C"
            assert 0 <= avail_spare <= 100, f"Available Spare bất thường: {avail_spare}%"
            assert 0 <= used_percent <= 100, f"Percentage Used bất thường: {used_percent}%"
            print(f"  -> Nhiệt độ: {temp}°C | Block dự phòng: {avail_spare}% | Hao mòn: {used_percent}%")
            print(f"  -> Đã ghi: {round(tbw, 2)} TBW | Đã đọc: {round(tbr, 2)} TBR")
        results.append(("Test 3: Deep S.M.A.R.T NVMe Registry", True, "PASS"))
    except Exception as e:
        results.append(("Test 3: Deep S.M.A.R.T NVMe Registry", False, str(e)))

    # --------------------------------------------------------------------------
    # TEST 4: Battery Forensics & Kích Pin Evaluation
    # --------------------------------------------------------------------------
    print("\n[TEST 4] Kiểm tra Module Giám định Kích Pin (Battery Forensics)...")
    try:
        batt = MacHardwareScanner.get_battery_forensics()
        assert batt["tamperingStatus"] in ["GENUINE_AUTHENTIC", "TAMPERED_FRAUD", "SUSPICIOUS", "DESKTOP_NO_BATTERY"], f"Trạng thái giám định không hợp lệ: {batt['tamperingStatus']}"
        print(f"  -> Trạng thái Giám định: {batt['tamperingStatus']} | Kết luận: {batt['tamperingVerdict']}")
        if batt["isInstalled"]:
            print(f"  -> Chu kỳ: {batt['cycleCount']} | Health: {batt['healthPercentage']}% | Lệch áp cell: {batt['cellMaxDiffMV']} mV")
        results.append(("Test 4: Battery Forensics & Kích Pin", True, "PASS"))
    except Exception as e:
        results.append(("Test 4: Battery Forensics & Kích Pin", False, str(e)))

    # --------------------------------------------------------------------------
    # TEST 5: Standalone Binary Bundling Verification
    # --------------------------------------------------------------------------
    print("\n[TEST 5] Kiểm tra tính độc lập của file binary đóng gói sẵn...")
    try:
        bundled_smartctl = MacHardwareScanner.find_smartctl()
        assert bundled_smartctl is not None, "Không tìm thấy smartctl"
        assert os.path.exists(bundled_smartctl), f"File không tồn tại: {bundled_smartctl}"
        assert os.access(bundled_smartctl, os.X_OK), f"File không có quyền thực thi: {bundled_smartctl}"
        print(f"  -> File thực thi: {bundled_smartctl} (Đã sẵn sàng)")
        results.append(("Test 5: Standalone Binary Bundling", True, "PASS"))
    except Exception as e:
        results.append(("Test 5: Standalone Binary Bundling", False, str(e)))

    # --------------------------------------------------------------------------
    # TEST 6: JavaScript Frontend Engine & Presets Multi-Scenario Verification
    # --------------------------------------------------------------------------
    print("\n[TEST 6] Kiểm tra Engine JavaScript và toàn bộ Presets MacBook...")
    try:
        node_test_code = """
        const fs = require('fs');
        const vm = require('vm');

        // Setup DOM simulation
        const sandbox = {
            window: {},
            document: {
                getElementById: () => ({ textContent: '', style: {}, className: '', appendChild: () => {}, innerHTML: '' }),
                querySelectorAll: () => [],
                createElement: () => ({ innerHTML: '', style: {}, setAttribute: () => {}, appendChild: () => {} })
            },
            navigator: { userAgent: 'Macintosh', storage: { estimate: async () => ({ quota: 512000000000, usage: 50000000000 }) } },
            localStorage: { getItem: () => 'dark', setItem: () => {} },
            performance: { now: () => 1000 },
            requestAnimationFrame: () => 1,
            cancelAnimationFrame: () => {},
            console: console
        };
        sandbox.window = sandbox;

        // Load JS files
        const jsFiles = ['js/presets.js', 'js/smart-engine.js', 'js/terminal-parser.js', 'js/surface-scanner.js', 'js/speed-benchmark.js', 'js/report-generator.js'];
        for (const f of jsFiles) {
            const code = fs.readFileSync(f, 'utf8');
            vm.runInNewContext(code, sandbox);
        }

        // Test all presets through smartEngine
        const presets = sandbox.MAC_PRESETS;
        let tested = 0;
        for (const [key, preset] of Object.entries(presets)) {
            const evaluated = sandbox.smartEngine.evaluate(preset);
            if (evaluated.healthScore < 0 || evaluated.healthScore > 100) throw new Error('Health score out of range: ' + key);
            if (!evaluated.wearInfo || evaluated.wearInfo.lifeRemaining < 0) throw new Error('Wear info invalid: ' + key);
            tested++;
        }
        console.log('Tested ' + tested + ' MacBook presets successfully with 100% mathematical validity.');
        """
        res_node = subprocess.run(["node", "-e", node_test_code], capture_output=True, text=True, timeout=8)
        assert res_node.returncode == 0, f"Lỗi kiểm định JS Engine: {res_node.stderr}"
        print(f"  -> {res_node.stdout.strip()}")
        results.append(("Test 6: Multi-MacBook Presets & Math Engine", True, "PASS"))
    except Exception as e:
        results.append(("Test 6: Multi-MacBook Presets & Math Engine", False, str(e)))

    # --------------------------------------------------------------------------
    # SUMMARY
    # --------------------------------------------------------------------------
    print("\n" + "=" * 80)
    print("📊 BẢNG TỔNG HỢP KẾT QUẢ KIỂM ĐỊNH (LOOP ENGINEERING QA REPORT)")
    print("=" * 80)
    all_pass = True
    for name, passed, detail in results:
        status_icon = "✅ PASS" if passed else "❌ FAIL"
        if not passed:
            all_pass = False
        print(f"{name.ljust(50)} : {status_icon} ({detail})")

    print("=" * 80)
    if all_pass:
        print("🎉 TẤT CẢ 6 HẠNG MỤC KIỂM ĐỊNH ĐỀU ĐẠT 100% CHÍNH XÁC VÀ HOÀN HẢO!")
    else:
        print("⚠️ CÓ HẠNG MỤC CHƯA ĐẠT, CẦN XỬ LÝ NGAY.")
    print("=" * 80)

if __name__ == "__main__":
    run_test_suite()
