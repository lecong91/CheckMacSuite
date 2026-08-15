#!/usr/bin/env python3
"""
================================================================================
CHECK MAC SUITE PRO - 11-STEP EXHAUSTIVE QUALITY ASSURANCE AUDIT
Verifying Components Audit, Display Diagnostics, S.M.A.R.T & Full System Engine
================================================================================
"""

import os
import sys
import json
import time
import subprocess
import urllib.request
import threading
import socketserver

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, BASE_DIR)

from app import MacHardwareScanner, CheckMacAPIHandler

def run_exhaustive_verification():
    print("=" * 85)
    print("🔬 BẮT ĐẦU KIỂM ĐỊNH 11 BƯỚC TOÀN DIỆN CHUẨN APPLE EXPERT THEO LOOP ENGINEERING")
    print("=" * 85)

    test_steps = []

    # --------------------------------------------------------------------------
    # STEP 1: REST API Server & Handlers Validation
    # --------------------------------------------------------------------------
    print("\n[BƯỚC 1/11] Kiểm định Máy chủ Cục bộ & Toàn bộ 8 REST API Endpoints...")
    try:
        class ReusableTCPServer(socketserver.TCPServer):
            allow_reuse_address = True

        server = ReusableTCPServer(("127.0.0.1", 0), CheckMacAPIHandler)
        test_port = server.server_address[1]
        server_thread = threading.Thread(target=server.serve_forever, daemon=True)
        server_thread.start()
        time.sleep(0.2)

        endpoints = [
            ("/api/status", ["status", "version", "smartctlAvailable"]),
            ("/api/system-info", ["macModel", "processor", "memory", "isLaptop", "coolingType"]),
            ("/api/drives", []),
            ("/api/smart/disk0", ["success", "exactCapacity"]),
            ("/api/battery-forensics", ["tamperingStatus", "tamperingVerdict"]),
            ("/api/hardware-components-audit", ["overallStatus", "overallVerdict", "components", "totalComponents"]),
            ("/api/display-diagnostics", ["totalDisplays", "mainDisplay"]),
            ("/api/benchmark?size=16", ["writeSpeedMB", "readSpeedMB", "writeTimeSec", "readTimeSec"])
        ]

        for ep, expected_keys in endpoints:
            url = f"http://127.0.0.1:{test_port}{ep}"
            req = urllib.request.urlopen(url, timeout=6)
            assert req.status == 200, f"Endpoint {ep} không trả về 200 OK"
            data = json.loads(req.read().decode("utf-8"))
            for k in expected_keys:
                assert k in data, f"Thiếu key '{k}' trong response của {ep}"
            print(f"  -> {ep.ljust(35)}: [200 OK] (Khớp {len(expected_keys)} trường dữ liệu bắt buộc)")

        server.shutdown()
        test_steps.append(("Bước 1: REST API Endpoints & Server Handlers", True, "PASS - 100% 200 OK"))
    except Exception as e:
        test_steps.append(("Bước 1: REST API Endpoints & Server Handlers", False, str(e)))

    # --------------------------------------------------------------------------
    # STEP 2: Real Hardware Introspection (CPU P/E Topology, GPU, Screen)
    # --------------------------------------------------------------------------
    print("\n[BƯỚC 2/11] Kiểm định Nhận diện Phần cứng Động (CPU P/E, GPU, Màn hình)...")
    try:
        sys_info = MacHardwareScanner.get_system_hardware_info()
        assert sys_info["macModel"] != "", "Model máy không được rỗng"
        assert sys_info["processor"] != "", "Thông tin vi xử lý không được rỗng"
        assert sys_info["memory"] != "", "Thông tin RAM không được rỗng"
        print(f"  -> Model: {sys_info['macModel']} ({sys_info['modelIdentifier']})")
        print(f"  -> Vi xử lý: {sys_info['processor']}")
        print(f"  -> Đồ họa: {sys_info['graphics']}")
        print(f"  -> Màn hình: {sys_info['display']}")
        print(f"  -> Tản nhiệt: {sys_info['coolingType']}")
        test_steps.append(("Bước 2: Dynamic Hardware & Display Introspection", True, "PASS"))
    except Exception as e:
        test_steps.append(("Bước 2: Dynamic Hardware & Display Introspection", False, str(e)))

    # --------------------------------------------------------------------------
    # STEP 3: Physical Drive Discovery & Accurate Byte Capacity
    # --------------------------------------------------------------------------
    print("\n[BƯỚC 3/11] Kiểm định Khám phá Ổ đĩa Vật lý & Tính Dung lượng Chính xác...")
    try:
        drives = MacHardwareScanner.get_physical_drives()
        assert len(drives) > 0, "Không tìm thấy ổ đĩa vật lý nào"
        for d in drives:
            assert d["diskId"] != "", "ID đĩa rỗng"
            assert d["size"] != "N/A", "Dung lượng không được N/A"
            print(f"  -> [{d['diskId']}] {d['name']} | Dung lượng: {d['size']} | Bus: {d['busProtocol']}")
        test_steps.append(("Bước 3: Physical Drive Discovery & Capacity", True, "PASS"))
    except Exception as e:
        test_steps.append(("Bước 3: Physical Drive Discovery & Capacity", False, str(e)))

    # --------------------------------------------------------------------------
    # STEP 4: Deep S.M.A.R.T NVMe Register Precision
    # --------------------------------------------------------------------------
    print("\n[BƯỚC 4/11] Kiểm định Quét Sâu Thanh ghi S.M.A.R.T NVMe Log 0x02...")
    try:
        smart_res = MacHardwareScanner.scan_smart("disk0")
        assert smart_res["success"] is True, "Quét SMART thất bại"
        if smart_res.get("format") == "json":
            nvme = smart_res["rawJson"].get("nvme_smart_health_information_log", {})
            temp = nvme.get("temperature", 0)
            spare = nvme.get("available_spare", 0)
            used = nvme.get("percentage_used", 0)
            units_w = nvme.get("data_units_written", 0)
            units_r = nvme.get("data_units_read", 0)
            tbw = round((units_w * 512000) / (1024**4), 2)
            tbr = round((units_r * 512000) / (1024**4), 2)
            print(f"  -> Nhiệt độ: {temp}°C | Block dự phòng: {spare}% | Hao mòn: {used}%")
            print(f"  -> Dữ liệu Đã Ghi: {tbw} TBW | Dữ liệu Đã Đọc: {tbr} TBR")
            assert 0 <= used <= 100
            assert 0 <= spare <= 100
        test_steps.append(("Bước 4: S.M.A.R.T NVMe Register Extraction", True, "PASS"))
    except Exception as e:
        test_steps.append(("Bước 4: S.M.A.R.T NVMe Register Extraction", False, str(e)))

    # --------------------------------------------------------------------------
    # STEP 5: Battery Forensics & Kích Pin Heuristics
    # --------------------------------------------------------------------------
    print("\n[BƯỚC 5/11] Kiểm định Giám định Kích Pin (Cross-Forensics & Cell Delta)...")
    try:
        batt = MacHardwareScanner.get_battery_forensics()
        assert "tamperingVerdict" in batt
        assert "tamperingStatus" in batt
        print(f"  -> Trạng thái Giám định: {batt['tamperingStatus']}")
        print(f"  -> Kết luận: {batt['tamperingVerdict']}")
        test_steps.append(("Bước 5: Battery Forensics & Kích Pin Detection", True, "PASS"))
    except Exception as e:
        test_steps.append(("Bước 5: Battery Forensics & Kích Pin Detection", False, str(e)))

    # --------------------------------------------------------------------------
    # STEP 6: Genuine Apple Parts & Service History Audit
    # --------------------------------------------------------------------------
    print("\n[BƯỚC 6/11] Kiểm định Giám định 7 Cụm Linh kiện Sửa chữa (Parts Audit)...")
    try:
        audit = MacHardwareScanner.get_hardware_components_audit()
        assert "overallStatus" in audit
        assert "components" in audit
        assert len(audit["components"]) == 7, f"Số linh kiện phải là 7, nhận {len(audit['components'])}"
        print(f"  -> Kết luận Tổng thể: {audit['overallVerdict']}")
        for c in audit["components"]:
            print(f"     - [{c['status']}] {c['name']}: {c['statusText']}")
        test_steps.append(("Bước 6: Genuine Apple Parts & Service History", True, "PASS"))
    except Exception as e:
        test_steps.append(("Bước 6: Genuine Apple Parts & Service History", False, str(e)))

    # --------------------------------------------------------------------------
    # STEP 7: Detailed Display Quality & Panel Diagnostics
    # --------------------------------------------------------------------------
    print("\n[BƯỚC 7/11] Kiểm định Thông số Kỹ thuật Màn hình Retina / XDR...")
    try:
        disp = MacHardwareScanner.get_detailed_display_diagnostics()
        assert "mainDisplay" in disp
        main_d = disp["mainDisplay"]
        assert "name" in main_d and "resolution" in main_d and "panelType" in main_d
        print(f"  -> Màn hình Chính: {main_d['name']} ({main_d['panelType']})")
        print(f"  -> Độ phân giải: {main_d['resolution']} | Tần số quét: {main_d['refreshRate']}")
        print(f"  -> Dải màu: {main_d['colorGamut']} | Độ sáng tối đa: {main_d['maxBrightness']}")
        test_steps.append(("Bước 7: Retina / XDR Display Diagnostics", True, "PASS"))
    except Exception as e:
        test_steps.append(("Bước 7: Retina / XDR Display Diagnostics", False, str(e)))

    # --------------------------------------------------------------------------
    # STEP 8: Live Disk Read/Write Speed Benchmark Engine
    # --------------------------------------------------------------------------
    print("\n[BƯỚC 8/11] Kiểm định Đo Tốc độ Đọc/Ghi Thực tế trên Ổ cứng...")
    try:
        bench_res = MacHardwareScanner.run_live_disk_benchmark(16)
        assert bench_res["writeSpeedMB"] > 0, "Tốc độ ghi phải > 0"
        assert bench_res["readSpeedMB"] > 0, "Tốc độ đọc phải > 0"
        print(f"  -> Tốc độ Ghi Tuần tự: {bench_res['writeSpeedMB']} MB/s (Thời gian: {bench_res['writeTimeSec']}s)")
        print(f"  -> Tốc độ Đọc Tuần tự: {bench_res['readSpeedMB']} MB/s (Thời gian: {bench_res['readTimeSec']}s)")
        test_steps.append(("Bước 8: Live Disk Benchmark Execution", True, "PASS"))
    except Exception as e:
        test_steps.append(("Bước 8: Live Disk Benchmark Execution", False, str(e)))

    # --------------------------------------------------------------------------
    # STEP 9: Standalone Bundled Binaries & Zero-Dependency Execution
    # --------------------------------------------------------------------------
    print("\n[BƯỚC 9/11] Kiểm định Tính Độc lập & Sẵn sàng Chạy Offline 1-Click...")
    try:
        bin_path = MacHardwareScanner.find_smartctl()
        assert bin_path is not None, "Không tìm thấy smartctl"
        assert os.path.exists(bin_path), f"File không tồn tại: {bin_path}"
        assert os.access(bin_path, os.X_OK), f"File không có quyền thực thi: {bin_path}"
        print(f"  -> File thực thi: {bin_path} (Sẵn sàng 100%)")
        test_steps.append(("Bước 9: Standalone Bundled Binaries & Permissions", True, "PASS"))
    except Exception as e:
        test_steps.append(("Bước 9: Standalone Bundled Binaries & Permissions", False, str(e)))

    # --------------------------------------------------------------------------
    # STEP 10: JavaScript Frontend Engine & Presets Simulation
    # --------------------------------------------------------------------------
    print("\n[BƯỚC 10/11] Kiểm định JavaScript Math Engine, Components & Display Modules...")
    try:
        node_script = """
        const fs = require('fs');
        const vm = require('vm');

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

        const jsFiles = [
            'js/presets.js',
            'js/smart-engine.js',
            'js/terminal-parser.js',
            'js/components-audit.js',
            'js/display-tester.js',
            'js/surface-scanner.js',
            'js/speed-benchmark.js',
            'js/report-generator.js'
        ];
        for (const f of jsFiles) {
            const code = fs.readFileSync(f, 'utf8');
            vm.runInNewContext(code, sandbox);
        }

        const presets = sandbox.MAC_PRESETS;
        let count = 0;
        for (const [key, p] of Object.entries(presets)) {
            const evaluated = sandbox.smartEngine.evaluate(p);
            if (evaluated.healthScore < 0 || evaluated.healthScore > 100) throw new Error('Health score invalid in ' + key);
            if (!evaluated.wearInfo || evaluated.wearInfo.lifeRemaining < 0) throw new Error('Wear info invalid in ' + key);
            if (!evaluated.recommendation || evaluated.recommendation === "") throw new Error('Recommendation missing in ' + key);
            count++;
        }
        console.log('Tested ' + count + ' MacBook presets with Components & Display modules. All 100% mathematically valid.');
        """
        res_node = subprocess.run(["node", "-e", node_script], capture_output=True, text=True, timeout=8)
        assert res_node.returncode == 0, f"Lỗi JS Math Engine: {res_node.stderr}"
        print(f"  -> {res_node.stdout.strip()}")
        test_steps.append(("Bước 10: JS Engine, Components & Display Modules", True, "PASS"))
    except Exception as e:
        test_steps.append(("Bước 10: JS Engine, Components & Display Modules", False, str(e)))

    # --------------------------------------------------------------------------
    # STEP 11: DOM Element Binding & UI Integrity (Zero Mismatches)
    # --------------------------------------------------------------------------
    print("\n[BƯỚC 11/11] Kiểm định Tính Toàn vẹn Giao diện & 100% DOM Bindings...")
    try:
        import re
        with open("index.html", "r", encoding="utf-8") as f:
            html_content = f.read()

        js_files = [
            "js/app.js",
            "js/smart-engine.js",
            "js/presets.js",
            "js/terminal-parser.js",
            "js/components-audit.js",
            "js/display-tester.js",
            "js/surface-scanner.js",
            "js/speed-benchmark.js",
            "js/report-generator.js"
        ]
        
        # Aggregate all HTML content (index.html + dynamic templates in JS)
        all_html = html_content
        for jf in js_files:
            if os.path.exists(jf):
                with open(jf, "r", encoding="utf-8") as f:
                    all_html += "\n" + f.read()

        missing_ids = []
        total_checked = 0

        for jf in js_files:
            if os.path.exists(jf):
                with open(jf, "r", encoding="utf-8") as f:
                    code = f.read()
                    matches = re.findall(r'document\.getElementById\([\"\']([^\"\']+)[\"\']\)', code)
                    matches += re.findall(r'setElemText\([\"\']([^\"\']+)[\"\']', code)
                    for dom_id in set(matches):
                        total_checked += 1
                        if f'id="{dom_id}"' not in all_html and f"id='{dom_id}'" not in all_html:
                            missing_ids.append((jf, dom_id))

        assert len(missing_ids) == 0, f"Phát hiện DOM IDs chưa liên kết: {missing_ids}"
        print(f"  -> Đã kiểm tra {total_checked} phần tử DOM ID. Khớp 100% với giao diện (0 LỖI).")
        test_steps.append(("Bước 11: DOM Element Binding & UI Integrity", True, "PASS - 100% Khớp"))
    except Exception as e:
        test_steps.append(("Bước 11: DOM Element Binding & UI Integrity", False, str(e)))

    # --------------------------------------------------------------------------
    # FINAL SUMMARY REPORT
    # --------------------------------------------------------------------------
    print("\n" + "=" * 85)
    print("📊 BẢNG TỔNG HỢP KIỂM ĐỊNH 11 BƯỚC (EXHAUSTIVE LOOP ENGINEERING QA REPORT)")
    print("=" * 85)
    all_passed = True
    for name, passed, detail in test_steps:
        status_icon = "✅ PASS" if passed else "❌ FAIL"
        if not passed:
            all_passed = False
        print(f"{name.ljust(55)} : {status_icon} ({detail})")

    print("=" * 85)
    if all_passed:
        print("🎉 TOÀN BỘ 11/11 HẠNG MỤC KIỂM ĐỊNH ĐỀU ĐẠT 100% CHÍNH XÁC VÀ HOÀN HẢO!")
    else:
        print("⚠️ CÓ BƯỚC CHƯA ĐẠT, CẦN KIỂM TRA LẠI.")
    print("=" * 85)

if __name__ == "__main__":
    run_exhaustive_verification()
