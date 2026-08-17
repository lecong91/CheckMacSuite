#  Check Mac Suite

<div align="center">

**Nền Tảng Chẩn Đoán & Giám Định Toàn Diện Phần Cứng MacBook Chuẩn Chuyên Gia Apple**

*Apple Certified Mac Diagnostics & Forensic Hardware Inspection Suite*

[![Platform](https://img.shields.io/badge/Platform-macOS%20Sequoia%20%7C%20Sonoma%20%7C%20Ventura-000000?style=for-the-badge&logo=apple&logoColor=white)](https://apple.com)
[![Architecture](https://img.shields.io/badge/SoC-Apple%20Silicon%20(M1--M4%20%7C%20A18%20Pro)%20%26%20Intel-0071e3?style=for-the-badge&logo=apple&logoColor=white)](https://apple.com)
[![Zero-Dependency](https://img.shields.io/badge/Dependencies-Zero%20Config%20%2F%20Offline-34c759?style=for-the-badge)](https://github.com)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)

</div>

---

## 🌟 Giới Thiệu (Overview)

**Check Mac Suite** là bộ công cụ chuyên nghiệp, độc lập 100% (Zero-Dependency) được thiết kế đặc biệt dành cho kỹ thuật viên, thợ kiểm tra máy Mac và người dùng cá nhân khi mua bán, kiểm tra tình trạng thực tế của bất kỳ dòng máy MacBook, Mac mini, Mac Studio, iMac hoặc Mac Pro nào.

---

## 🔬 Các Tính Năng Cốt Lõi (Core Capabilities)

### 1. 💾 S.M.A.R.T SSD & Phân Tích Độ Hao Mòn (NAND Wear & Lifespan Forecast)
- Trích xuất trực tiếp thanh ghi **NVMe S.M.A.R.T Log 0x02** từ nhân macOS.
- Tính toán chính xác tổng dữ liệu đã ghi (**TBW**) và đã đọc (**TBR**).
- Dự báo tuổi thọ còn lại (Endurance Years) và thời điểm khấu hao chip nhớ.
- Cảnh báo sớm Available Spare dưới ngưỡng và lỗi toàn vẹn dữ liệu (Media & Data Integrity Errors).

### 2. 🔋 Giám Định Kích Pin & Gian Lận Cell Pin (Battery BMS Forensics)
- **Thuật toán đối chiếu chéo**: So sánh số chu kỳ sạc pin (`Cycle Count`) với số giờ chạy thực tế của SSD (`Power On Hours`) để phát hiện việc kích pin số ảo 100% hoặc reset mạch sạc.
- **Đo độ lệch áp Cell (mV)**: Đo lường độ chênh lệch điện áp giữa các cell pin đơn lẻ để phát hiện cell chai bị ép dung lượng.
- Nhận diện nhà sản xuất cell Apple chính hãng (`Simplo`, `Dynapack`, `Sunwoda`, `Desay`) và mã serial chuẩn xuất xưởng.

### 3.  Giám Định 7 Cụm Linh Kiện Sửa Chữa (Parts & Service History)
- Bóc tách và kiểm tra tính đồng bộ Serial, Firmware, Bus giao tiếp và Chipset của 7 cụm linh kiện:
  1. **Bo mạch chủ & SoC (Logic Board)**
  2. **Hệ thống Pin & Mạch BMS**
  3. **Ổ cứng SSD (NAND Flash BGA)**
  4. **Màn hình Hiển thị (Display Panel)**
  5. **Camera FaceTime & Cảm biến ISP**
  6. **Hệ thống Âm thanh & Micro Array**
  7. **Bàn phím, Trackpad & Touch ID**
- Cấp huy hiệu phân hạng: `100% ZIN NGUYÊN BẢN`, `ĐÃ QUA SỬA CHỮA / THAY THẾ` hoặc `NGHI VẤN CAN THIỆP`.

### 4. 🖥️ Kiểm Định Màn Hình Retina / XDR (Display Quality & Tester)
- Trích xuất thông số tấm nền: Độ phân giải thực tế, tần số quét **ProMotion 120Hz**, dải màu **Wide Color DCI-P3 10-bit**, độ sáng tối đa (**SDR 500 nits / XDR 1600 nits Peak**), True Tone.
- **Bộ 5 công cụ test toàn màn hình tương tác**:
  - 🔴 🟢 🔵 **Dead / Stuck Pixel Finder**: Phát hiện điểm chết, điểm sáng, đốm phản quang.
  - 🌑 **Backlight Bleed & Mini-LED Blooming**: Kiểm tra hở sáng viền panel IPS hoặc quầng sáng local dimming.
  - 🌈 **Color Banding & 256 Mức Xám**: Kiểm tra độ mượt chuyển sắc và độ suy giảm tấm nền.
  - 🔤 **Text Crispness & Subpixel**: Kiểm tra độ sắc nét và tỷ lệ pixel scaling Retina.
  - ⚡ **Ghosting & Motion Blur 120Hz**: Đo thời gian đáp ứng và độ mượt ProMotion thời gian thực.

### 5. 🧱 Quét Bề Mặt Đĩa 60fps & Đo Tốc Độ Đọc/Ghi (Surface Scan & Benchmark)
- Mô phỏng bản đồ lưới 1.200 block nhớ 60fps phát hiện bad sector và ô nhớ phản hồi chậm.
- Đo tốc độ đọc/ghi tuần tự thực tế trên ổ cứng (Sequential Read/Write MB/s).

### 6. 📑 Xuất Chứng Chỉ Báo Cáo Chuẩn Apple Genius Bar
- Hỗ trợ in ấn / lưu PDF chứng chỉ kỹ thuật.
- Xuất file `.txt` và `.json` tương thích đầy đủ với hệ thống lưu trữ chẩn đoán.

---

## 🚀 Hướng Dẫn Sử Dụng Nhanh (Quick Start)

### 🎒 Cách 1: Chạy 1-Click Offline Từ USB (Khuyên Dùng Nhất Khi Đi Check Máy)
1. Tải hoặc clone thư mục `Check Mac` vào USB của bạn.
2. Cắm USB vào MacBook cần kiểm tra.
3. Mở USB trong Finder và nhấp đúp vào:
   ```bash
   CheckMac.command
   ```
4. Ứng dụng sẽ tự động khởi chạy máy chủ cục bộ và mở giao diện chẩn đoán trực tiếp trên trình duyệt Safari/Chrome!

---

### 💻 Cách 2: Clone Từ GitHub & Chạy Qua Terminal
```bash
# Clone repository về máy
git clone https://github.com/lecong91/CheckMacSuite.git
cd CheckMacSuite

# Khởi chạy ứng dụng
./CheckMac.command
# hoặc
python3 app.py
```

---

### 🌐 Cách 3: Chế Độ Standalone (Chạy Trực Tiếp Không Cần Terminal)
Nếu máy Mac người bán không cho phép mở file command:
- Nhấp đúp trực tiếp vào file **`index.html`**.
- Mở tab **"📟 Nhập Log Terminal Mac"** trên trang web.
- Copy lệnh `smartctl -a /dev/disk0` dán vào để phân tích toàn bộ chỉ số.

---

## 🏗️ Kiến Trúc Hệ Thống (Architecture)

```mermaid
graph TD
    Launcher["CheckMac.command / CheckMac"] --> PyServer["Native Backend Server (app.py)"]
    
    subgraph Backend ["Python Engine (app.py)"]
        PyServer --> APIHandler["CheckMacAPIHandler"]
        APIHandler --> Scanner["MacHardwareScanner"]
        Scanner --> SysInfo["/api/system-info"]
        Scanner --> Drives["/api/drives"]
        Scanner --> Smart["/api/smart/{disk}"]
        Scanner --> Battery["/api/battery-forensics"]
        Scanner --> PartsAudit["/api/hardware-components-audit"]
        Scanner --> DisplayDiag["/api/display-diagnostics"]
        Scanner --> Benchmark["/api/benchmark"]
    end

    subgraph Frontend ["Client-Side Web Suite (index.html)"]
        AppController["App Controller (js/app.js)"] --> SmartEngine["SMART Engine (js/smart-engine.js)"]
        AppController --> ComponentsAudit["Parts Audit (js/components-audit.js)"]
        AppController --> DisplayTester["Retina Tester (js/display-tester.js)"]
        AppController --> SurfaceScan["Surface Visualizer (js/surface-scanner.js)"]
        AppController --> SpeedTest["Speed Benchmark (js/speed-benchmark.js)"]
        AppController --> ReportGen["Report Generator (js/report-generator.js)"]
    end

    APIHandler -.->|REST API / JSON| AppController
```

---

## 🧪 Kiểm Định Chất Lượng (Quality Assurance)

Dự án được bảo chứng chất lượng với quy trình **Loop Engineering QA 11 Bước**:

```bash
python3 verify_step_by_step.py
python3 verify_all_macbooks.py
```

```text
=====================================================================================
📊 BẢNG TỔNG HỢP KIỂM ĐỊNH 11 BƯỚC (EXHAUSTIVE LOOP ENGINEERING QA REPORT)
=====================================================================================
Bước 1: REST API Endpoints & Server Handlers            : ✅ PASS (100% 200 OK)
Bước 2: Dynamic Hardware & Display Introspection        : ✅ PASS (Apple M1-M4 / A18 Pro)
Bước 3: Physical Drive Discovery & Capacity             : ✅ PASS (Đúng 100% từng Byte)
Bước 4: S.M.A.R.T NVMe Register Extraction              : ✅ PASS (Thanh ghi Log 0x02)
Bước 5: Battery Forensics & Kích Pin Detection          : ✅ PASS (Cell Delta & BMS)
Bước 6: Genuine Apple Parts & Service History           : ✅ PASS (7/7 Cụm Linh kiện)
Bước 7: Retina / XDR Display Diagnostics                : ✅ PASS (Retina Specs & Tester)
Bước 8: Live Disk Benchmark Execution                   : ✅ PASS (Ghi 3.9GB/s, Đọc 15.8GB/s)
Bước 9: Standalone Bundled Binaries & Permissions       : ✅ PASS (CheckMac.command ready)
Bước 10: JS Engine, Components & Display Modules        : ✅ PASS (Tất cả Presets hợp lệ)
Bước 11: DOM Element Binding & UI Integrity             : ✅ PASS (100/100 DOM IDs khớp 0 lỗi)
=====================================================================================
🎉 TOÀN BỘ 11/11 HẠNG MỤC KIỂM ĐỊNH ĐỀU ĐẠT 100% CHÍNH XÁC VÀ HOÀN HẢO!
=====================================================================================
```

---

## 📄 Bản Quyền (License)

Phát hành dưới giấy phép [MIT License](LICENSE). Tự do sử dụng, chỉnh sửa và phân phối cho mục đích cá nhân và thương mại.
