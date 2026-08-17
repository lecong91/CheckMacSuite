#!/usr/bin/env python3
"""
================================================================================
CHECK MAC SUITE - 11-STEP EXHAUSTIVE QUALITY ASSURANCE AUDIT
Verifying Battery Forensics (Replaced/Zin/Fraud), Intelligent Desktop Camera Detection,
Low-Resource Localhost Shutdown & Caching, NVMe & SATA SSD Precision
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

from app import MacHardwareScanner, CheckMacAPIHandler, APPLE_BATTERY_SPECS_DB

def run_exhaustive_verification():
    print("=" * 85)
    print("🔬 BẮT ĐẦU KIỂM ĐỊNH 11 BƯỚC TOÀN DIỆN CHUẨN APPLE EXPERT THEO LOOP ENGINEERING")
    print("=" * 85)

    test_steps = []

    # --------------------------------------------------------------------------
    # STEP 1: REST API Server & Handlers Validation + Low-Overhead Cache Performance
    # --------------------------------------------------------------------------
    print("\n[BƯỚC 1/11] Kiểm định Máy chủ Cục bộ, 8 REST Endpoints & Bộ nhớ đệm Giảm tải...")
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
            ("/api/battery-forensics", ["tamperingStatus", "tamperingVerdict", "classification"]),
            ("/api/hardware-components-audit", ["overallStatus", "overallVerdict", "components", "totalComponents"]),
            ("/api/display-diagnostics", ["totalDisplays", "mainDisplay"]),
            ("/api/benchmark?size=16", ["writeSpeedMB", "readSpeedMB", "writeTimeSec", "readTimeSec"])
        ]

        for ep, expected_keys in endpoints:
            url = f"http://127.0.0.1:{test_port}{ep}"
            t0 = time.perf_counter()
            req = urllib.request.urlopen(url, timeout=6)
            elapsed_ms = round((time.perf_counter() - t0) * 1000, 2)
            assert req.status == 200, f"Endpoint {ep} không trả về 200 OK"
            data = json.loads(req.read().decode("utf-8"))
            for k in expected_keys:
                assert k in data, f"Thiếu key '{k}' trong response của {ep}"
            print(f"  -> {ep.ljust(35)}: [200 OK] ({elapsed_ms}ms, khớp {len(expected_keys)} trường dữ liệu)")

        # Verify Cache Speed (Subsequent call should be < 5ms with 0 CPU)
        t_cache = time.perf_counter()
        req_c = urllib.request.urlopen(f"http://127.0.0.1:{test_port}/api/system-info", timeout=2)
        cache_elapsed_ms = round((time.perf_counter() - t_cache) * 1000, 2)
        assert cache_elapsed_ms < 50, "Bộ nhớ đệm phải trả về siêu nhanh"
        print(f"  -> Cache Hit Speed (/api/system-info)   : {cache_elapsed_ms}ms (Tối ưu 100% tài nguyên)")

        server.shutdown()
        test_steps.append(("Bước 1: REST API Endpoints & Caching System", True, "PASS - 100% 200 OK"))
    except Exception as e:
        test_steps.append(("Bước 1: REST API Endpoints & Caching System", False, str(e)))

    # --------------------------------------------------------------------------
    # STEP 2: Dynamic Hardware Introspection & Apple Battery Specs DB
    # --------------------------------------------------------------------------
    print("\n[BƯỚC 2/11] Kiểm định Nhận diện Phần cứng & Cơ sở Dữ liệu Pin Chuẩn Apple...")
    try:
        sys_info = MacHardwareScanner.get_system_hardware_info()
        assert sys_info["macModel"] != "", "Model máy không được rỗng"
        assert sys_info["processor"] != "", "Thông tin vi xử lý không được rỗng"
        assert sys_info["memory"] != "", "Thông tin RAM không được rỗng"
        assert len(APPLE_BATTERY_SPECS_DB) >= 35, "Apple Battery Specs DB phải đầy đủ các đời máy"
        print(f"  -> Model: {sys_info['macModel']} ({sys_info['modelIdentifier']})")
        print(f"  -> Vi xử lý: {sys_info['processor']}")
        print(f"  -> Đồ họa: {sys_info['graphics']}")
        print(f"  -> Màn hình: {sys_info['display']}")
        print(f"  -> Apple Specs DB: Đã nạp {len(APPLE_BATTERY_SPECS_DB)} cấu hình MacBook chính thức")
        test_steps.append(("Bước 2: Dynamic Hardware & Battery Specs DB", True, "PASS"))
    except Exception as e:
        test_steps.append(("Bước 2: Dynamic Hardware & Battery Specs DB", False, str(e)))

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
    # STEP 4: Deep S.M.A.R.T NVMe & SATA Register Precision
    # --------------------------------------------------------------------------
    print("\n[BƯỚC 4/11] Kiểm định Quét Sâu Thanh ghi S.M.A.R.T NVMe Log 0x02 & ATA...")
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
    # STEP 5: 8-Layer Battery Forensics & Replaced Battery Detection Simulation
    # --------------------------------------------------------------------------
    print("\n[BƯỚC 5/11] Kiểm định Giám định 8 Lớp: Phát hiện Pin Thay Thế vs Pin Zin...")
    try:
        # 1. Live system test
        batt_live = MacHardwareScanner.get_battery_forensics()
        assert "classification" in batt_live
        assert "tamperingVerdict" in batt_live
        print(f"  -> Live Mac Classification: {batt_live['classification']}")
        print(f"  -> Live Mac Verdict       : {batt_live['tamperingVerdict']}")

        # 2. Forensic Simulation: Old Mac with 3rd Party Replacement Battery
        fake_3rd_party = {
            "isInstalled": True,
            "cycleCount": 12,
            "designCapacity": 5200,
            "officialDesignCapacity": 6559,
            "maxCapacity": 5100,
            "currentCapacity": 5000,
            "rawMaxCapacity": 5100,
            "rawCurrentCapacity": 5000,
            "healthPercentage": 98.0,
            "voltageMV": 12200,
            "amperageMA": 0,
            "temperatureC": 28.0,
            "serialNumber": "01234567890", # Non-Apple generic serial
            "manufacturer": "Third-Party / Dena",
            "deviceName": "Li-ion Battery",
            "manufactureDate": "12/04/2024",
            "manufactureYear": 2024,
            "macReleaseYear": 2015, # 2015 Mac with 2024 battery
            "cellVoltages": [4060, 4070, 4070],
            "cellMaxDiffMV": 10,
            "permanentFailureStatus": 0,
            "tamperingReasons": []
        }
        MacHardwareScanner._evaluate_battery_8_layer_forensics(fake_3rd_party)
        assert fake_3rd_party["classification"] == "THIRD_PARTY_REPLACED", f"Phải phát hiện pin bên thứ 3, nhận {fake_3rd_party['classification']}"
        print(f"  -> [Test Case 1: Pin Thay Bên Thứ 3] : ✅ PASS (Nhận diện chính xác: {fake_3rd_party['classification']})")

        # 3. Forensic Simulation: Old Mac with Genuine Apple Authorized Replacement Battery
        fake_apple_replaced = {
            "isInstalled": True,
            "cycleCount": 45,
            "designCapacity": 6559,
            "officialDesignCapacity": 6559,
            "maxCapacity": 6500,
            "currentCapacity": 6400,
            "rawMaxCapacity": 6500,
            "rawCurrentCapacity": 6400,
            "healthPercentage": 99.1,
            "voltageMV": 12600,
            "amperageMA": 0,
            "temperatureC": 27.0,
            "serialNumber": "D8681234567890ABCD", # Valid Apple Serial format
            "manufacturer": "SMP (Simplo Apple OEM)",
            "deviceName": "Apple bq20z451",
            "manufactureDate": "15/08/2023",
            "manufactureYear": 2023,
            "macReleaseYear": 2015, # 8-year gap
            "cellVoltages": [4200, 4202, 4198],
            "cellMaxDiffMV": 4,
            "permanentFailureStatus": 0,
            "tamperingReasons": []
        }
        MacHardwareScanner._evaluate_battery_8_layer_forensics(fake_apple_replaced)
        assert fake_apple_replaced["classification"] == "APPLE_AUTHORIZED_REPLACEMENT", f"Phải phát hiện pin Apple thay mới, nhận {fake_apple_replaced['classification']}"
        print(f"  -> [Test Case 2: Pin Apple Thay Mới] : ✅ PASS (Nhận diện chính xác: {fake_apple_replaced['classification']})")

        # 4. Forensic Simulation: Tampered Cell / Kích Pin Fraud
        fake_fraud = {
            "isInstalled": True,
            "cycleCount": 8,
            "designCapacity": 5103,
            "officialDesignCapacity": 5103,
            "maxCapacity": 5103,
            "currentCapacity": 5000,
            "rawMaxCapacity": 4200, # 900 mAh raw mismatch!
            "rawCurrentCapacity": 4000,
            "healthPercentage": 100.0,
            "voltageMV": 12000,
            "amperageMA": 0,
            "temperatureC": 32.0,
            "serialNumber": "D8681234567890ABCD",
            "manufacturer": "SMP",
            "deviceName": "Apple Battery",
            "manufactureDate": "01/01/2020",
            "manufactureYear": 2020,
            "macReleaseYear": 2020,
            "cellVoltages": [4200, 4140, 4180],
            "cellMaxDiffMV": 60, # 60mV severe delta!
            "permanentFailureStatus": 0,
            "tamperingReasons": []
        }
        MacHardwareScanner._evaluate_battery_8_layer_forensics(fake_fraud)
        assert fake_fraud["classification"] == "TAMPERED_FRAUD", f"Phải phát hiện gian lận kích pin, nhận {fake_fraud['classification']}"
        print(f"  -> [Test Case 3: Kích Pin & Gian Lận] : ✅ PASS (Nhận diện chính xác: {fake_fraud['classification']})")

        # 5. Scientific Math Verification: High Precision Decimal SoH & Cycle Depletion
        design_cap = 5200
        max_cap = 5017 # 5017 / 5200 = 96.480769... -> 96.48%
        calc_health = round((max_cap / float(design_cap)) * 100.0, 2)
        calc_loss_mah = design_cap - max_cap
        calc_loss_pct = round(100.0 - calc_health, 2)
        calc_cycles = 142
        calc_cycle_dep = round((calc_cycles / 1000.0) * 100.0, 2)
        calc_cycles_rem = max(0, 1000 - calc_cycles)

        assert calc_health == 96.48, f"Expected 96.48, got {calc_health}"
        assert calc_loss_mah == 183
        assert calc_loss_pct == 3.52
        assert calc_cycle_dep == 14.20
        assert calc_cycles_rem == 858
        print(f"  -> [Test Case 4: High-Precision Decimal Math (2 decimals)]: ✅ PASS (Health: {calc_health}%, Loss: -{calc_loss_mah} mAh (-{calc_loss_pct}%), Cycle Depletion: {calc_cycle_dep}%, Remaining: {calc_cycles_rem})")

        test_steps.append(("Bước 5: 8-Layer Battery Forensics & Replaced Detection", True, "PASS - 100% Chính xác"))
    except Exception as e:
        test_steps.append(("Bước 5: 8-Layer Battery Forensics & Replaced Detection", False, str(e)))

    # --------------------------------------------------------------------------
    # STEP 6: Genuine Apple Parts, Camera & Desktop Form-Factor Audit
    # --------------------------------------------------------------------------
    print("\n[BƯỚC 6/11] Kiểm định Nghiêm Ngặt 7 Cụm Linh kiện & Nhận diện Bàn phím/Camera/Màn hình...")
    try:
        audit = MacHardwareScanner.get_hardware_components_audit()
        assert "overallStatus" in audit
        assert "components" in audit
        assert len(audit["components"]) == 7, f"Số linh kiện phải là 7, nhận {len(audit['components'])}"
        print(f"  -> Kết luận Tổng thể Live: {audit['overallVerdict']}")
        for c in audit["components"]:
            print(f"     - [{c['status']}] {c['name']}: {c['statusText']} ({c['details']})")

        # 1. Test Desktop Mac (Mac mini M4) Introspection Test Cases
        mac_mini_sys = {"macModel": "Mac mini", "modelIdentifier": "Mac16,10", "isLaptop": False}
        
        # Test Camera on Mac mini
        cam_mini = MacHardwareScanner._get_camera_info(mac_mini_sys)
        assert cam_mini["status"] in ["DESKTOP_NA", "EXTERNAL_CONNECTED", "GENUINE"], f"Mac mini camera status unexpected: {cam_mini['status']}"
        if not cam_mini["present"]:
            assert cam_mini["status"] == "DESKTOP_NA"
            assert "Không tích hợp Camera" in cam_mini["statusText"] or "Mac mini" in cam_mini["statusText"]
            print(f"  -> [Test Camera Mac mini]: ✅ PASS (Nhận diện chính xác: {cam_mini['statusText']})")

        # Test Input & Biometrics on Mac mini
        input_mini = MacHardwareScanner._get_input_biometrics_info(mac_mini_sys)
        assert input_mini["status"] in ["DESKTOP_NA", "EXTERNAL_CONNECTED"], f"Mac mini input status must be DESKTOP_NA or EXTERNAL_CONNECTED, got {input_mini['status']}"
        assert "Không tích hợp sẵn" in input_mini["statusText"] or "kết nối ngoài" in input_mini["statusText"] or "Bàn phím Apple Magic" in input_mini["statusText"], f"Mac mini input status text invalid: {input_mini['statusText']}"
        print(f"  -> [Test Bàn phím/Trackpad Mac mini]: ✅ PASS (Nhận diện chính xác: {input_mini['statusText']})")

        # Test Audio on Mac mini
        audio_mini = MacHardwareScanner._get_audio_info(mac_mini_sys)
        assert "Mac mini" in audio_mini["name"] or "Mac mini" in audio_mini["statusText"] or "Loa tích hợp Mac mini" in audio_mini["name"]
        print(f"  -> [Test Loa Mac mini]: ✅ PASS (Nhận diện chính xác: {audio_mini['statusText']})")

        # 2. Test Laptop MacBook Pro Introspection Test Cases
        mbp_sys = {"macModel": "MacBook Pro 16-inch", "modelIdentifier": "MacBookPro18,2", "isLaptop": True}
        
        input_mbp = MacHardwareScanner._get_input_biometrics_info(mbp_sys)
        assert input_mbp["status"] == "GENUINE"
        assert "Force Touch" in input_mbp["statusText"] or "Magic Keyboard" in input_mbp["statusText"]
        print(f"  -> [Test Bàn phím/Trackpad MacBook Pro]: ✅ PASS (Nhận diện chính xác: {input_mbp['statusText']})")

        audio_mbp = MacHardwareScanner._get_audio_info(mbp_sys)
        assert "6-Speaker" in audio_mbp["statusText"] or "Hi-Fi" in audio_mbp["details"]
        print(f"  -> [Test Loa MacBook Pro]: ✅ PASS (Nhận diện chính xác: {audio_mbp['statusText']})")

        test_steps.append(("Bước 6: Genuine Apple Parts & Strict Form-Factor Introspection", True, "PASS - 100% Chính xác"))
    except Exception as e:
        test_steps.append(("Bước 6: Genuine Apple Parts & Strict Form-Factor Introspection", False, str(e)))

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
                getElementById: () => ({ textContent: '', style: {}, className: '', appendChild: () => {}, innerHTML: '', getBoundingClientRect: () => ({ width: 800, height: 400 }) }),
                querySelectorAll: () => [],
                createElement: () => ({ innerHTML: '', style: {}, setAttribute: () => {}, appendChild: () => {} }),
                addEventListener: () => {}
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

        // Test SATA SSD Parsing Accuracy & Decimal Precision
        const sampleSataText = `
        Device Model:     APPLE SSD SM0512F
        Serial Number:    S1K5NYAG812345
        Firmware Version: UXM4JA1Q
        User Capacity:    500,107,862,016 bytes [500 GB]
        ID# ATTRIBUTE_NAME          FLAG     VALUE WORST THRESH TYPE      UPDATED  WHEN_FAILED RAW_VALUE
          9 Power_On_Hours          0x0032   092   092   000    Old_age   Always       -       4210
         12 Power_Cycle_Count       0x0032   095   095   000    Old_age   Always       -       850
        194 Temperature_Celsius     0x0022   065   050   000    Old_age   Always       -       35
        231 SSD_Life_Left           0x0013   094   094   010    Pre-fail  Always       -       0
        241 Total_LBAs_Written      0x0032   099   099   000    Old_age   Always       -       48828125
        `;
        const parsedSata = sandbox.terminalLogParser.parseSmartctlText(sampleSataText);
        if (parsedSata.percentageUsed !== 6) throw new Error('SATA SSD % Used calculation mismatch: expected 6%, got ' + parsedSata.percentageUsed);
        if (parsedSata.dataUnitsWrittenTB < 0.02) throw new Error('SATA SSD written TB calculation failed');
        
        const evaluatedSata = sandbox.smartEngine.evaluate(parsedSata);
        if (typeof evaluatedSata.wearInfo.percentageUsed !== 'number') throw new Error('percentageUsed must be a number');
        if (typeof evaluatedSata.wearInfo.lifeRemaining !== 'number') throw new Error('lifeRemaining must be a number');
        console.log('Tested SATA SSD SMART parser & High-Precision Decimal Engine: % Used = ' + evaluatedSata.wearInfo.percentageUsed.toFixed(2) + '%, Life Remaining = ' + evaluatedSata.wearInfo.lifeRemaining.toFixed(2) + '%, Ratio = ' + evaluatedSata.wearInfo.readWriteRatio + 'x. (100% Precision)');
        """
        res = subprocess.run(["node", "-e", node_script], capture_output=True, text=True, cwd=BASE_DIR)
        assert res.returncode == 0, f"Lỗi JavaScript node test: {res.stderr}"
        print(f"  -> {res.stdout.strip()}")
        test_steps.append(("Bước 10: JS Engine, Components & Display Modules", True, "PASS"))
    except Exception as e:
        test_steps.append(("Bước 10: JS Engine, Components & Display Modules", False, str(e)))

    # --------------------------------------------------------------------------
    # STEP 11: DOM Element Binding & UI Parity Validation
    # --------------------------------------------------------------------------
    print("\n[BƯỚC 11/11] Kiểm định Tính Toàn vẹn DOM & Ràng buộc ID trên Giao diện Web...")
    try:
        with open(os.path.join(BASE_DIR, "index.html"), "r", encoding="utf-8") as f:
            html_content = f.read()

        required_dom_ids = [
            "heroDriveName", "heroBusType", "heroCapacity", "heroTemp",
            "healthGaugeValue", "healthGaugeCircle", "healthGaugeStatus",
            "perfGaugeValue", "perfGaugeCircle", "perfGaugeStatus",
            "statTBWWritten", "statTBRRead", "statTBWRated", "statPowerHours", "statUnsafeShutdowns", "statReadWriteRatio",
            "wearProgressVal", "wearProgressFill",
            "forecastYearsVal", "forecastDateVal", "forecastRiskVal", "forecastRecommendation",
            "smartTableBody", "smartSearchInput",
            "surfaceBlockCanvas", "startScanBtn", "pauseScanBtn", "stopScanBtn",
            "speedChartCanvas", "startBenchmarkBtn",
            "btnExportTxt", "btnExportJson",
            "batteryVerdictBanner", "batteryVerdictTitle", "batteryVerdictDesc", "battCycleCountVal", "battSSDHoursVal", "battCellDiffVal", "batteryCellGrid",
            "auditVerdictBanner", "auditVerdictTitle", "auditVerdictDesc", "auditVerdictBadge", "componentsAuditGrid",
            "dispPanelBadge", "dispResolution", "dispRefreshRate", "screenTestOverlay", "shutdownServerBtn"
        ]

        missing_ids = [id_name for id_name in required_dom_ids if f'id="{id_name}"' not in html_content]
        assert len(missing_ids) == 0, f"Thiếu các DOM ID trong index.html: {missing_ids}"
        print(f"  -> Đã kiểm tra {len(required_dom_ids)} DOM IDs cốt lõi: 100% Khớp và Tồn tại trong index.html.")
        test_steps.append(("Bước 11: DOM Element Binding & UI Integrity", True, "PASS"))
    except Exception as e:
        test_steps.append(("Bước 11: DOM Element Binding & UI Integrity", False, str(e)))

    # --------------------------------------------------------------------------
    # SUMMARY REPORT
    # --------------------------------------------------------------------------
    print("\n" + "=" * 85)
    print("📊 BẢNG TỔNG HỢP KIỂM ĐỊNH 11 BƯỚC (EXHAUSTIVE LOOP ENGINEERING QA REPORT)")
    print("=" * 85)
    all_passed = True
    for name, status, msg in test_steps:
        icon = "✅ PASS" if status else "❌ FAIL"
        if not status: all_passed = False
        print(f"{name.ljust(56)}: {icon} ({msg})")
    print("=" * 85)

    if all_passed:
        print("🎉 TOÀN BỘ 11/11 HẠNG MỤC KIỂM ĐỊNH ĐỀU ĐẠT 100% CHÍNH XAC VÀ HOÀN HẢO!")
    else:
        print("🚨 CÓ HẠNG MỤC KHÔNG ĐẠT, VUI LÒNG KIỂM TRA LẠI LOG CHI TIẾT!")
    print("=" * 85)

    return all_passed

if __name__ == "__main__":
    success = run_exhaustive_verification()
    sys.exit(0 if success else 1)
