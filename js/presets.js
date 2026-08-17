/**
 * CHECK MAC SUITE - PRESET HARDWARE & SMART DATASETS
 * Realistic Apple Silicon & Intel Mac Storage Datasets
 */

const MAC_PRESETS = {
  "macbook-neo-a18": {
    id: "macbook-neo-a18",
    name: "MacBook Neo 13-inch (Apple A18 Pro, 2026)",
    driveModel: "APPLE SSD AP0256N (Apple NVMe 256GB BGA)",
    serialNumber: "C02N9810A18P",
    firmware: "412.80.6",
    capacity: "251.0 GB (256 GB SSD)",
    busType: "Apple Fabric NVMe PCIe Gen4",
    formFactor: "Integrated Ultra-Dense NAND BGA",
    trimSupported: true,
    fileSystem: "APFS (Encrypted FileVault)",
    partitionScheme: "GUID Partition Table",
    sectorSize: "4096 bytes (4K Native)",
    
    healthScore: 100,
    performanceScore: 98,
    status: "OK",
    statusText: "Good - Hoàn hảo",
    statusColor: "var(--status-good)",
    
    percentageUsed: 0,
    lifeRemaining: 100,
    estimatedLifetimeDays: 3650,
    ratedTBW: 150,
    dataUnitsWrittenTB: 1.85,
    dataUnitsReadTB: 3.90,
    powerOnHours: 240,
    powerCycles: 68,
    unsafeShutdowns: 0,
    temperature: 30,
    
    macModel: "MacBookNeo1,1 (MacBook Neo 13-inch, 2026)",
    processor: "Apple A18 Pro (6-core: 2 performance and 4 efficiency)",
    graphics: "Apple A18 Pro 5-core GPU, 16-core Neural Engine",
    memory: "8 GB Unified Memory",
    osVersion: "macOS Sequoia 15.3 (Build 24D60)",
    batteryHealth: 100.00,
    batteryCycleCount: 14,
    batteryCondition: "Normal",

    batteryForensics: {
      isInstalled: true,
      cycleCount: 14,
      maxCycles: 1000,
      cyclesRemaining: 986,
      cycleDepletionPercent: 1.40,
      designCapacity: 5200,
      maxCapacity: 5240,
      currentCapacity: 5180,
      rawMaxCapacity: 5240,
      healthPercentage: 100.00,
      capacityLossMAh: 0,
      capacityLossPercent: 0.00,
      stateOfChargePercent: 98.85,
      voltageMV: 8740, // 2-cell configuration
      amperageMA: -210, // Ultra-low idle draw
      temperatureC: 26.20,
      serialNumber: "D86419088NLA18P",
      manufacturer: "Sunwoda / Apple Original BMS",
      deviceName: "Apple bq20z453-Neo",
      manufactureDate: "2024-10-05",
      cellVoltages: [4370, 4370],
      cellMaxDiffMV: 0,
      tamperingStatus: "GENUINE_AUTHENTIC",
      tamperingRiskPercent: 0,
      tamperingVerdict: "✅ PIN NGUYÊN BẢN (ZIN APPLE A-SERIES): Cấu hình 2-cell cân bằng tuyệt đối 0mV, chu kỳ khớp 100% tuổi thọ máy.",
      tamperingReasons: []
    },

    attributes: [
      { id: 1, name: "Critical Warning", raw: "0x00", rawVal: 0, normalized: 100, worst: 100, threshold: 0, status: "OK", desc: "Không phát hiện lỗi phần cứng NVMe", flags: "Pre-failure" },
      { id: 2, name: "Composite Temperature", raw: "31 °C (304 K)", rawVal: 31, normalized: 98, worst: 92, threshold: 75, status: "OK", desc: "Nhiệt độ chip nhớ A-Series tối ưu không quạt (Fanless)", flags: "Real-time" },
      { id: 3, name: "Available Spare", raw: "100%", rawVal: 100, normalized: 100, worst: 100, threshold: 10, status: "OK", desc: "Dung lượng block nhớ dự phòng còn lại", flags: "Pre-failure" },
      { id: 4, name: "Available Spare Threshold", raw: "10%", rawVal: 10, normalized: 100, worst: 100, threshold: 10, status: "OK", desc: "Ngưỡng cảnh báo cạn kiệt block dự phòng", flags: "Static" },
      { id: 5, name: "Percentage Used", raw: "0%", rawVal: 0, normalized: 100, worst: 100, threshold: 100, status: "OK", desc: "Mức độ hao mòn chu kỳ ghi flash NAND", flags: "Wear-out" },
      { id: 6, name: "Data Units Read", raw: "9,375,000 (4.80 TB)", rawVal: 4.80, normalized: 100, worst: 100, threshold: 0, status: "OK", desc: "Tổng lượng dữ liệu đã đọc", flags: "Statistical" },
      { id: 7, name: "Data Units Written", raw: "4,200,000 (2.15 TB)", rawVal: 2.15, normalized: 100, worst: 100, threshold: 0, status: "OK", desc: "Tổng lượng dữ liệu đã ghi", flags: "Statistical" },
      { id: 8, name: "Host Read Commands", raw: "84,510,200", rawVal: 84510200, normalized: 100, worst: 100, threshold: 0, status: "OK", desc: "Lệnh đọc từ Host OS", flags: "Statistical" },
      { id: 9, name: "Host Write Commands", raw: "42,100,800", rawVal: 42100800, normalized: 100, worst: 100, threshold: 0, status: "OK", desc: "Lệnh ghi từ Host OS", flags: "Statistical" },
      { id: 10, name: "Controller Busy Time", raw: "68 minutes", rawVal: 68, normalized: 100, worst: 100, threshold: 0, status: "OK", desc: "Thời gian xử lý I/O", flags: "Statistical" },
      { id: 11, name: "Power Cycles", raw: "94", rawVal: 94, normalized: 100, worst: 100, threshold: 0, status: "OK", desc: "Số chu kỳ bật tắt", flags: "Statistical" },
      { id: 12, name: "Power On Hours", raw: "320 hours (13.3 days)", rawVal: 320, normalized: 100, worst: 100, threshold: 0, status: "OK", desc: "Tổng số giờ hoạt động", flags: "Statistical" },
      { id: 13, name: "Unsafe Shutdowns", raw: "0", rawVal: 0, normalized: 100, worst: 100, threshold: 0, status: "OK", desc: "Số lần mất nguồn đột ngột", flags: "Pre-failure" },
      { id: 14, name: "Media and Data Integrity Errors", raw: "0", rawVal: 0, normalized: 100, worst: 100, threshold: 0, status: "OK", desc: "Không có lỗi ECC", flags: "Critical" },
      { id: 15, name: "Number of Error Information Log Entries", raw: "0", rawVal: 0, normalized: 100, worst: 100, threshold: 0, status: "OK", desc: "Không có lỗi trong nhật ký", flags: "Statistical" }
    ],

    failureRisk: "None",
    failureProbabilityPercent: 0.1,
    earlyWarnings: [],
    recommendation: "MacBook Neo chạy chip Apple A18 Pro hoạt động hoàn hảo, nhiệt độ mát mẻ lý tưởng và toàn bộ chip nhớ NVMe ở trạng thái mới xuất xưởng."
  },

  "macbook-m3-max": {
    id: "macbook-m3-max",
    name: "MacBook Pro 16-inch (M3 Max, 2023)",
    driveModel: "APPLE SSD AP1024Z (Apple NVMe 1TB)",
    serialNumber: "C02G9001MD6R",
    firmware: "343.100.12",
    capacity: "1.00 TB (1,000,204,886,016 Bytes)",
    busType: "Apple Fabric NVMe PCIe 4.0 x4",
    formFactor: "Apple Integrated NAND BGA",
    trimSupported: true,
    fileSystem: "APFS (Encrypted FileVault)",
    partitionScheme: "GUID Partition Table",
    sectorSize: "4096 bytes (4K Native)",
    
    // Overall Health & Performance
    healthScore: 100,
    performanceScore: 100,
    status: "OK",
    statusText: "Good - Hoàn hảo",
    statusColor: "var(--status-good)",
    
    // Lifetime & Wear
    percentageUsed: 1, // 1% wear
    lifeRemaining: 99, // 99%
    estimatedLifetimeDays: 3450, // ~9.5 years
    ratedTBW: 600, // TBW limit
    dataUnitsWrittenTB: 4.85,
    dataUnitsReadTB: 8.24,
    powerOnHours: 642,
    powerCycles: 184,
    unsafeShutdowns: 0,
    temperature: 33, // °C
    
    // Mac Hardware Specs
    macModel: "MacBookPro19,1 (MacBook Pro 16-inch, Nov 2023)",
    processor: "Apple M3 Max (16-core: 12 performance and 4 efficiency)",
    graphics: "Apple M3 Max 40-core GPU, 16-core Neural Engine",
    memory: "64 GB Unified LPDDR5-6400",
    osVersion: "macOS Sequoia 15.1 (Build 24B83)",
    batteryHealth: 100.00,
    batteryCycleCount: 28,
    batteryCondition: "Normal",

    // Deep Battery Forensics & Kích Pin Verification
    batteryForensics: {
      isInstalled: true,
      cycleCount: 28,
      maxCycles: 1000,
      cyclesRemaining: 972,
      cycleDepletionPercent: 2.80,
      designCapacity: 8700,
      maxCapacity: 8740,
      currentCapacity: 8650,
      rawMaxCapacity: 8740,
      healthPercentage: 100.00,
      capacityLossMAh: 0,
      capacityLossPercent: 0.00,
      stateOfChargePercent: 98.97,
      voltageMV: 12840,
      amperageMA: -420,
      temperatureC: 28.50,
      serialNumber: "D86348109FBL5M3A9",
      manufacturer: "SMP / Simplo (Apple Original BMS)",
      deviceName: "Apple bq20z451",
      manufactureDate: "2023-11-12",
      cellVoltages: [4280, 4281, 4279],
      cellMaxDiffMV: 2, // Perfect 2mV balance
      tamperingStatus: "GENUINE_AUTHENTIC",
      tamperingRiskPercent: 0,
      tamperingVerdict: "✅ PIN NGUYÊN BẢN (ZIN APPLE): Các cell cân bằng hoàn hảo, chu kỳ khớp 100% thời gian chạy SSD.",
      tamperingReasons: []
    },
    
    // SMART NVMe Attributes
    attributes: [
      { id: 1, name: "Critical Warning", raw: "0x00", rawVal: 0, normalized: 100, worst: 100, threshold: 0, status: "OK", desc: "Cảnh báo lỗi phần cứng nghiêm trọng từ controller NVMe", flags: "Pre-failure" },
      { id: 2, name: "Composite Temperature", raw: "33 °C (306 K)", rawVal: 33, normalized: 95, worst: 88, threshold: 75, status: "OK", desc: "Nhiệt độ tổng hợp của controller và chip nhớ NAND", flags: "Real-time" },
      { id: 3, name: "Available Spare", raw: "100%", rawVal: 100, normalized: 100, worst: 100, threshold: 10, status: "OK", desc: "Dung lượng block nhớ dự phòng còn lại", flags: "Pre-failure" },
      { id: 4, name: "Available Spare Threshold", raw: "10%", rawVal: 10, normalized: 100, worst: 100, threshold: 10, status: "OK", desc: "Ngưỡng cảnh báo cạn kiệt block dự phòng", flags: "Static" },
      { id: 5, name: "Percentage Used", raw: "1%", rawVal: 1, normalized: 99, worst: 99, threshold: 100, status: "OK", desc: "Tỉ lệ phần trăm hao mòn chu kỳ ghi của chip NAND", flags: "Wear-out" },
      { id: 6, name: "Data Units Read", raw: "16,093,750 (8.24 TB)", rawVal: 8.24, normalized: 100, worst: 100, threshold: 0, status: "OK", desc: "Tổng lượng dữ liệu đã đọc từ ổ cứng", flags: "Statistical" },
      { id: 7, name: "Data Units Written", raw: "9,472,656 (4.85 TB)", rawVal: 4.85, normalized: 100, worst: 100, threshold: 0, status: "OK", desc: "Tổng lượng dữ liệu đã ghi vào chip nhớ", flags: "Statistical" },
      { id: 8, name: "Host Read Commands", raw: "124,582,100", rawVal: 124582100, normalized: 100, worst: 100, threshold: 0, status: "OK", desc: "Số lượng lệnh đọc từ Host OS", flags: "Statistical" },
      { id: 9, name: "Host Write Commands", raw: "88,321,940", rawVal: 88321940, normalized: 100, worst: 100, threshold: 0, status: "OK", desc: "Số lượng lệnh ghi từ Host OS", flags: "Statistical" },
      { id: 10, name: "Controller Busy Time", raw: "142 minutes", rawVal: 142, normalized: 100, worst: 100, threshold: 0, status: "OK", desc: "Tổng thời gian bộ điều khiển NVMe bận xử lý I/O", flags: "Statistical" },
      { id: 11, name: "Power Cycles", raw: "184", rawVal: 184, normalized: 100, worst: 100, threshold: 0, status: "OK", desc: "Số lần bật/tắt nguồn của thiết bị", flags: "Statistical" },
      { id: 12, name: "Power On Hours", raw: "642 hours (26.7 days)", rawVal: 642, normalized: 100, worst: 100, threshold: 0, status: "OK", desc: "Tổng số giờ ổ đĩa hoạt động", flags: "Statistical" },
      { id: 13, name: "Unsafe Shutdowns", raw: "0", rawVal: 0, normalized: 100, worst: 100, threshold: 0, status: "OK", desc: "Số lần mất nguồn đột ngột không theo chuẩn NVMe", flags: "Pre-failure" },
      { id: 14, name: "Media and Data Integrity Errors", raw: "0", rawVal: 0, normalized: 100, worst: 100, threshold: 0, status: "OK", desc: "Lỗi toàn vẹn dữ liệu uncorrectable ECC", flags: "Critical" },
      { id: 15, name: "Number of Error Information Log Entries", raw: "0", rawVal: 0, normalized: 100, worst: 100, threshold: 0, status: "OK", desc: "Số lượng bản ghi sự kiện lỗi trong bộ nhớ controller", flags: "Statistical" },
      { id: 16, name: "Warning Composite Temperature Time", raw: "0 minutes", rawVal: 0, normalized: 100, worst: 100, threshold: 0, status: "OK", desc: "Thời gian ổ đĩa chạy ở mức nhiệt độ cảnh báo", flags: "Statistical" },
      { id: 17, name: "Critical Composite Temperature Time", raw: "0 minutes", rawVal: 0, normalized: 100, worst: 100, threshold: 0, status: "OK", desc: "Thời gian ổ đĩa vượt ngưỡng nhiệt độ nguy hiểm", flags: "Critical" }
    ],
    
    // Check Mac Failure Prediction Heuristics
    failureRisk: "None",
    failureProbabilityPercent: 0.1,
    earlyWarnings: [],
    recommendation: "Ổ SSD hoạt động trong tình trạng hoàn hảo như mới xuất xưởng. Không có bất kỳ dấu hiệu suy giảm hay lỗi phần cứng nào."
  },

  "macbook-m2-air": {
    id: "macbook-m2-air",
    name: "MacBook Air 13-inch (M2, 2022)",
    driveModel: "APPLE SSD AP0512Z (Apple NVMe 512GB)",
    serialNumber: "C02F8120L9K1",
    firmware: "287.80.1",
    capacity: "500.11 GB (500,107,862,016 Bytes)",
    busType: "Apple Fabric NVMe PCIe Gen3 x4",
    formFactor: "Apple Integrated NAND BGA",
    trimSupported: true,
    fileSystem: "APFS",
    partitionScheme: "GUID Partition Table",
    sectorSize: "4096 bytes (4K Native)",
    
    healthScore: 88,
    performanceScore: 95,
    status: "OK",
    statusText: "Good - Hoạt động tốt",
    statusColor: "var(--status-good)",
    
    percentageUsed: 16, // 16% wear
    lifeRemaining: 84, // 84%
    estimatedLifetimeDays: 1820, // ~5 years
    ratedTBW: 300,
    dataUnitsWrittenTB: 48.2,
    dataUnitsReadTB: 92.5,
    powerOnHours: 4210,
    powerCycles: 890,
    unsafeShutdowns: 4,
    temperature: 39,
    
    macModel: "Mac14,2 (MacBook Air 13-inch, M2, 2022)",
    processor: "Apple M2 (8-core: 4 performance and 4 efficiency)",
    graphics: "Apple M2 8-core GPU",
    memory: "16 GB Unified RAM",
    osVersion: "macOS Sonoma 14.5",
    batteryHealth: 91.33,
    batteryCycleCount: 215,
    batteryCondition: "Normal",

    batteryForensics: {
      isInstalled: true,
      cycleCount: 215,
      maxCycles: 1000,
      cyclesRemaining: 785,
      cycleDepletionPercent: 21.50,
      designCapacity: 4500,
      maxCapacity: 4110,
      currentCapacity: 3890,
      rawMaxCapacity: 4110,
      healthPercentage: 91.33,
      capacityLossMAh: 390,
      capacityLossPercent: 8.67,
      stateOfChargePercent: 94.65,
      voltageMV: 12150,
      amperageMA: -310,
      temperatureC: 29.80,
      serialNumber: "D86224109FFM2A0",
      manufacturer: "Desay / Apple Original BMS",
      deviceName: "Apple bq20z451",
      manufactureDate: "2022-07-15",
      cellVoltages: [4050, 4052, 4048],
      cellMaxDiffMV: 4,
      tamperingStatus: "GENUINE_AUTHENTIC",
      tamperingRiskPercent: 0,
      tamperingVerdict: "✅ PIN NGUYÊN BẢN (ZIN APPLE): Cell cân bằng hoàn hảo, độ chai 8.67% hoàn toàn tự nhiên tương ứng 215 chu kỳ sạc.",
      tamperingReasons: []
    },
    
    attributes: [
      { id: 1, name: "Critical Warning", raw: "0x00", rawVal: 0, normalized: 100, worst: 100, threshold: 0, status: "OK", desc: "Cảnh báo lỗi phần cứng nghiêm trọng từ controller NVMe", flags: "Pre-failure" },
      { id: 2, name: "Composite Temperature", raw: "39 °C (312 K)", rawVal: 39, normalized: 90, worst: 76, threshold: 75, status: "OK", desc: "Nhiệt độ tổng hợp của controller và chip nhớ NAND", flags: "Real-time" },
      { id: 3, name: "Available Spare", raw: "100%", rawVal: 100, normalized: 100, worst: 100, threshold: 10, status: "OK", desc: "Dung lượng block nhớ dự phòng còn lại", flags: "Pre-failure" },
      { id: 4, name: "Available Spare Threshold", raw: "10%", rawVal: 10, normalized: 100, worst: 100, threshold: 10, status: "OK", desc: "Ngưỡng cảnh báo cạn kiệt block dự phòng", flags: "Static" },
      { id: 5, name: "Percentage Used", raw: "16%", rawVal: 16, normalized: 84, worst: 84, threshold: 100, status: "OK", desc: "Tỉ lệ phần trăm hao mòn chu kỳ ghi của chip NAND", flags: "Wear-out" },
      { id: 6, name: "Data Units Read", raw: "180,664,062 (92.5 TB)", rawVal: 92.5, normalized: 100, worst: 100, threshold: 0, status: "OK", desc: "Tổng lượng dữ liệu đã đọc từ ổ cứng", flags: "Statistical" },
      { id: 7, name: "Data Units Written", raw: "94,140,625 (48.2 TB)", rawVal: 48.2, normalized: 84, worst: 84, threshold: 0, status: "OK", desc: "Tổng lượng dữ liệu đã ghi vào chip nhớ", flags: "Statistical" },
      { id: 8, name: "Host Read Commands", raw: "945,120,400", rawVal: 945120400, normalized: 100, worst: 100, threshold: 0, status: "OK", desc: "Số lượng lệnh đọc từ Host OS", flags: "Statistical" },
      { id: 9, name: "Host Write Commands", raw: "680,240,100", rawVal: 680240100, normalized: 100, worst: 100, threshold: 0, status: "OK", desc: "Số lượng lệnh ghi từ Host OS", flags: "Statistical" },
      { id: 10, name: "Controller Busy Time", raw: "850 minutes", rawVal: 850, normalized: 100, worst: 100, threshold: 0, status: "OK", desc: "Tổng thời gian bộ điều khiển NVMe bận xử lý I/O", flags: "Statistical" },
      { id: 11, name: "Power Cycles", raw: "890", rawVal: 890, normalized: 100, worst: 100, threshold: 0, status: "OK", desc: "Số lần bật/tắt nguồn của thiết bị", flags: "Statistical" },
      { id: 12, name: "Power On Hours", raw: "4,210 hours (175.4 days)", rawVal: 4210, normalized: 100, worst: 100, threshold: 0, status: "OK", desc: "Tổng số giờ ổ đĩa hoạt động", flags: "Statistical" },
      { id: 13, name: "Unsafe Shutdowns", raw: "4", rawVal: 4, normalized: 96, worst: 96, threshold: 0, status: "OK", desc: "Số lần mất nguồn đột ngột không theo chuẩn NVMe", flags: "Notice" },
      { id: 14, name: "Media and Data Integrity Errors", raw: "0", rawVal: 0, normalized: 100, worst: 100, threshold: 0, status: "OK", desc: "Lỗi toàn vẹn dữ liệu uncorrectable ECC", flags: "Critical" },
      { id: 15, name: "Number of Error Information Log Entries", raw: "0", rawVal: 0, normalized: 100, worst: 100, threshold: 0, status: "OK", desc: "Số lượng bản ghi sự kiện lỗi trong bộ nhớ controller", flags: "Statistical" }
    ],
    
    failureRisk: "Low",
    failureProbabilityPercent: 2.5,
    earlyWarnings: [
      { level: "notice", title: "Phát hiện 4 lần tắt máy đột ngột (Unsafe Shutdowns)", desc: "Hãy hạn chế để máy cạn kiệt pin sập nguồn đột ngột nhằm bảo vệ Controller SSD." }
    ],
    recommendation: "Ổ SSD vẫn đang hoạt động ổn định và an toàn, tốc độ hao mòn phù hợp với cường độ làm việc thông thường."
  },

  "macbook-m1-warning": {
    id: "macbook-m1-warning",
    name: "MacBook Pro 13-inch (M1, 2020) - Heavy Swap Wear",
    driveModel: "APPLE SSD AP0256Q (Apple NVMe 256GB)",
    serialNumber: "C02DW150Q6L8",
    firmware: "198.60.2",
    capacity: "251.00 GB (251,000,190,464 Bytes)",
    busType: "Apple Fabric NVMe PCIe Gen3 x4",
    formFactor: "Apple Integrated NAND BGA",
    trimSupported: true,
    fileSystem: "APFS",
    partitionScheme: "GUID Partition Table",
    sectorSize: "4096 bytes (4K Native)",
    
    healthScore: 56,
    performanceScore: 78,
    status: "Warning",
    statusText: "Warning - Cảnh báo hao mòn",
    statusColor: "var(--status-warning)",
    
    percentageUsed: 44, // 44% wear
    lifeRemaining: 56, // 56%
    estimatedLifetimeDays: 610, // ~1.6 years
    ratedTBW: 150,
    dataUnitsWrittenTB: 66.4,
    dataUnitsReadTB: 145.8,
    powerOnHours: 12480,
    powerCycles: 2310,
    unsafeShutdowns: 38,
    temperature: 46,
    
    macModel: "MacBookPro17,1 (MacBook Pro 13-inch, M1, 2020)",
    processor: "Apple M1 (8-core)",
    graphics: "Apple M1 8-core GPU",
    memory: "8 GB Unified RAM (Heavy Swap Writing)",
    osVersion: "macOS Monterey 12.7",
    batteryHealth: 78.39,
    batteryCycleCount: 680,
    batteryCondition: "Service Recommended",

    batteryForensics: {
      isInstalled: true,
      cycleCount: 680,
      maxCycles: 1000,
      cyclesRemaining: 320,
      cycleDepletionPercent: 68.00,
      designCapacity: 5100,
      maxCapacity: 3998,
      currentCapacity: 2850,
      rawMaxCapacity: 3998,
      healthPercentage: 78.39,
      capacityLossMAh: 1102,
      capacityLossPercent: 21.61,
      stateOfChargePercent: 71.29,
      voltageMV: 11620,
      amperageMA: -850,
      temperatureC: 36.40,
      serialNumber: "D86048109FBL5M1A1",
      manufacturer: "Celxpert / Apple OEM BMS",
      deviceName: "Apple bq20z451",
      manufactureDate: "2020-11-20",
      cellVoltages: [3870, 3885, 3865],
      cellMaxDiffMV: 20,
      tamperingStatus: "DEGRADED_SERVICE_REQUIRED",
      tamperingRiskPercent: 35,
      tamperingVerdict: "⚠️ PIN ZIN ĐÃ CHAI (78.39%): Dung lượng tối đa đã suy giảm dưới ngưỡng 80.00% chuẩn Apple. Khuyến nghị thay pin mới.",
      tamperingReasons: ["Dung lượng pin thực tế còn 3998 mAh / 5100 mAh (chai 21.61%). Đã sử dụng 680 chu kỳ sạc."]
    },
    
    attributes: [
      { id: 1, name: "Critical Warning", raw: "0x00", rawVal: 0, normalized: 100, worst: 100, threshold: 0, status: "OK", desc: "Cảnh báo lỗi phần cứng nghiêm trọng từ controller NVMe", flags: "Pre-failure" },
      { id: 2, name: "Composite Temperature", raw: "46 °C (319 K)", rawVal: 46, normalized: 82, worst: 64, threshold: 75, status: "OK", desc: "Nhiệt độ tổng hợp của controller và chip nhớ NAND", flags: "Real-time" },
      { id: 3, name: "Available Spare", raw: "88%", rawVal: 88, normalized: 88, worst: 88, threshold: 10, status: "Warning", desc: "Dung lượng block nhớ dự phòng còn lại (đã giảm 12%)", flags: "Pre-failure" },
      { id: 4, name: "Available Spare Threshold", raw: "10%", rawVal: 10, normalized: 100, worst: 100, threshold: 10, status: "OK", desc: "Ngưỡng cảnh báo cạn kiệt block dự phòng", flags: "Static" },
      { id: 5, name: "Percentage Used", raw: "44%", rawVal: 44, normalized: 56, worst: 56, threshold: 100, status: "Warning", desc: "Tỉ lệ phần trăm hao mòn chu kỳ ghi của chip NAND", flags: "Wear-out" },
      { id: 6, name: "Data Units Read", raw: "284,765,625 (145.8 TB)", rawVal: 145.8, normalized: 100, worst: 100, threshold: 0, status: "OK", desc: "Tổng lượng dữ liệu đã đọc từ ổ cứng", flags: "Statistical" },
      { id: 7, name: "Data Units Written", raw: "129,687,500 (66.4 TB)", rawVal: 66.4, normalized: 56, worst: 56, threshold: 0, status: "Warning", desc: "Tổng lượng dữ liệu đã ghi vào chip nhớ", flags: "Statistical" },
      { id: 8, name: "Host Read Commands", raw: "1,845,120,400", rawVal: 1845120400, normalized: 100, worst: 100, threshold: 0, status: "OK", desc: "Số lượng lệnh đọc từ Host OS", flags: "Statistical" },
      { id: 9, name: "Host Write Commands", raw: "1,420,240,100", rawVal: 1420240100, normalized: 100, worst: 100, threshold: 0, status: "OK", desc: "Số lượng lệnh ghi từ Host OS", flags: "Statistical" },
      { id: 10, name: "Controller Busy Time", raw: "4,320 minutes", rawVal: 4320, normalized: 88, worst: 88, threshold: 0, status: "OK", desc: "Tổng thời gian bộ điều khiển NVMe bận xử lý I/O", flags: "Statistical" },
      { id: 11, name: "Power Cycles", raw: "2,310", rawVal: 2310, normalized: 100, worst: 100, threshold: 0, status: "OK", desc: "Số lần bật/tắt nguồn của thiết bị", flags: "Statistical" },
      { id: 12, name: "Power On Hours", raw: "12,480 hours (520 days)", rawVal: 12480, normalized: 70, worst: 70, threshold: 0, status: "Notice", desc: "Tổng số giờ ổ đĩa hoạt động", flags: "Statistical" },
      { id: 13, name: "Unsafe Shutdowns", raw: "38", rawVal: 38, normalized: 62, worst: 62, threshold: 0, status: "Warning", desc: "Số lần mất nguồn đột ngột", flags: "Notice" },
      { id: 14, name: "Media and Data Integrity Errors", raw: "2", rawVal: 2, normalized: 90, worst: 90, threshold: 0, status: "Warning", desc: "Đã xuất hiện 2 sự kiện lỗi đọc ghi", flags: "Critical" },
      { id: 15, name: "Number of Error Information Log Entries", raw: "4", rawVal: 4, normalized: 90, worst: 90, threshold: 0, status: "Warning", desc: "Có 4 bản ghi cảnh báo trong controller log", flags: "Statistical" }
    ],
    
    failureRisk: "Medium",
    failureProbabilityPercent: 28.4,
    earlyWarnings: [
      { level: "warning", title: "Block nhớ dự phòng (Available Spare) đã suy giảm xuống 88%", desc: "Controller đã phải kích hoạt các block dự trữ để thay thế các block hỏng." },
      { level: "warning", title: "Phát hiện 2 lỗi Media Integrity Errors", desc: "Các sector nhớ flash bắt đầu có dấu hiệu xuống cấp do tần suất Swap memory cao." },
      { level: "notice", title: "Tốc độ hao mòn cao do RAM 8GB dùng nhiều Swap SSD", desc: "Tổng lượng ghi 66.4 TBW chiếm gần 50% định mức chịu tải của chip 256GB." }
    ],
    recommendation: "Khuyến nghị người dùng nên sao lưu dữ liệu quan trọng qua Time Machine hoặc iCloud thường xuyên. Theo dõi sát sao chỉ số Available Spare mỗi 2 tuần."
  },

  "macbook-intel-failing": {
    id: "macbook-intel-failing",
    name: "MacBook Pro 15-inch (Intel i9, 2019) - FAILING SSD",
    driveModel: "APPLE SSD AP1024M (Apple NVMe 1TB PCIe)",
    serialNumber: "C02YM284LVD0",
    firmware: "115.140.2",
    capacity: "1.00 TB (1,000,204,886,016 Bytes)",
    busType: "Apple Custom NVMe PCIe Gen3 x4",
    formFactor: "Proprietary Apple Module",
    trimSupported: true,
    fileSystem: "APFS",
    partitionScheme: "GUID Partition Table",
    sectorSize: "4096 bytes (4K Native)",
    
    healthScore: 18,
    performanceScore: 35,
    status: "Failing",
    statusText: "Critical - Ổ cứng sắp hỏng!",
    statusColor: "var(--status-critical)",
    
    percentageUsed: 92, // 92% wear
    lifeRemaining: 8, // 8%
    estimatedLifetimeDays: 45, // 45 days left
    ratedTBW: 600,
    dataUnitsWrittenTB: 554.8,
    dataUnitsReadTB: 890.2,
    powerOnHours: 28940,
    powerCycles: 5410,
    unsafeShutdowns: 142,
    temperature: 58,
    
    macModel: "MacBookPro15,1 (MacBook Pro 15-inch, 2019)",
    processor: "2.4 GHz 8-Core Intel Core i9-9980HK",
    graphics: "AMD Radeon Pro Vega 20 4GB + Intel UHD 630",
    memory: "32 GB 2400 MHz DDR4",
    osVersion: "macOS Sonoma 14.2",
    batteryHealth: 100.00, // Fake 100.00% (Thực tế raw: 65.70%)
    batteryCycleCount: 8, // Fake 8 cycles (Reset từ 890 chu kỳ)
    batteryCondition: "Normal (Fake)",

    // Kích Pin Detection Flagged
    batteryForensics: {
      isInstalled: true,
      cycleCount: 8, // Reset from 890 cycles down to 8!
      maxCycles: 1000,
      cyclesRemaining: 992,
      cycleDepletionPercent: 0.80,
      designCapacity: 7336,
      maxCapacity: 7350, // Overwritten to 100%
      currentCapacity: 7100,
      rawMaxCapacity: 4820, // Real raw capacity is only 4820 mAh (65.70%)!
      healthPercentage: 100.00,
      rawHealthPercentage: 65.70,
      capacityLossMAh: 2516,
      capacityLossPercent: 34.30,
      stateOfChargePercent: 96.60,
      voltageMV: 11950,
      amperageMA: -1450,
      temperatureC: 38.20,
      serialNumber: "C01099238L00F0000",
      manufacturer: "Third-party Clone (Desolder / Re-programmed BMS)",
      deviceName: "bq20z451 (Faked)",
      manufactureDate: "2019-06-18",
      cellVoltages: [4120, 3980, 3850], // Huge 270mV cell imbalance!
      cellMaxDiffMV: 270,
      tamperingStatus: "TAMPERED_FRAUD",
      tamperingRiskPercent: 98,
      tamperingVerdict: "🚨 PHÁT HIỆN GIAN LẬN: PIN ĐÃ BỊ KÍCH SỐ ẢO & RESET CHU KỲ SẠC!",
      tamperingReasons: [
        "Ổ SSD đã chạy 28,940 giờ (hơn 3.3 năm) và ghi 554.8 TBW, nhưng Pin chỉ báo mới sạc 8 chu kỳ (Health 100%). Đây là bằng chứng không thể chối cãi của việc Reset chu kỳ sạc!",
        "Lệch điện áp các cell pin cực lớn (270 mV chênh lệch). Cell 3 đang bị tụt áp nhanh, chứng tỏ cell đã bị chai nặng.",
        "Dung lượng phần cứng thô (4,820 mAh) tụt sâu so với dung lượng ghi đè ảo (7,350 mAh)."
      ]
    },
    
    attributes: [
      { id: 1, name: "Critical Warning", raw: "0x05 (Available Spare Below Threshold, Reliability Degraded)", rawVal: 5, normalized: 10, worst: 10, threshold: 0, status: "Critical", desc: "CẢNH BÁO NGUY CẤP: Controller báo cáo độ tin cậy bị suy giảm nghiêm trọng", flags: "Pre-failure" },
      { id: 2, name: "Composite Temperature", raw: "58 °C (331 K)", rawVal: 58, normalized: 55, worst: 30, threshold: 75, status: "Warning", desc: "Nhiệt độ hoạt động cao, tiệm cận ngưỡng quá nhiệt", flags: "Real-time" },
      { id: 3, name: "Available Spare", raw: "7% (DƯỚI NGƯỠNG AN TOÀN)", rawVal: 7, normalized: 7, worst: 7, threshold: 10, status: "Critical", desc: "NGUY CẤP: Block dự phòng chỉ còn 7%, dưới mức tối thiểu 10%", flags: "Pre-failure" },
      { id: 4, name: "Available Spare Threshold", raw: "10%", rawVal: 10, normalized: 100, worst: 100, threshold: 10, status: "Critical", desc: "Ngưỡng bảo vệ cạn kiệt", flags: "Static" },
      { id: 5, name: "Percentage Used", raw: "92%", rawVal: 92, normalized: 8, worst: 8, threshold: 100, status: "Critical", desc: "Chip nhớ NAND đã bị ăn mòn 92% chu kỳ ghi", flags: "Wear-out" },
      { id: 6, name: "Data Units Read", raw: "1,738,671,875 (890.2 TB)", rawVal: 890.2, normalized: 10, worst: 10, threshold: 0, status: "Notice", desc: "Tổng lượng dữ liệu đã đọc từ ổ cứng", flags: "Statistical" },
      { id: 7, name: "Data Units Written", raw: "1,083,593,750 (554.8 TB)", rawVal: 554.8, normalized: 8, worst: 8, threshold: 0, status: "Critical", desc: "Tổng dữ liệu ghi đã chạm ngưỡng tối đa (554.8 TBW / 600 TBW)", flags: "Statistical" },
      { id: 8, name: "Host Read Commands", raw: "9,845,120,400", rawVal: 9845120400, normalized: 100, worst: 100, threshold: 0, status: "OK", desc: "Lệnh đọc từ OS", flags: "Statistical" },
      { id: 9, name: "Host Write Commands", raw: "7,420,240,100", rawVal: 7420240100, normalized: 100, worst: 100, threshold: 0, status: "OK", desc: "Lệnh ghi từ OS", flags: "Statistical" },
      { id: 10, name: "Controller Busy Time", raw: "18,450 minutes", rawVal: 18450, normalized: 40, worst: 40, threshold: 0, status: "Warning", desc: "Thời gian nghẽn controller cao", flags: "Statistical" },
      { id: 11, name: "Power Cycles", raw: "5,410", rawVal: 5410, normalized: 100, worst: 100, threshold: 0, status: "OK", desc: "Số chu kỳ bật tắt", flags: "Statistical" },
      { id: 12, name: "Power On Hours", raw: "28,940 hours (1,205 days)", rawVal: 28940, normalized: 20, worst: 20, threshold: 0, status: "Critical", desc: "Ổ đĩa đã hoạt động liên tục hơn 3.3 năm", flags: "Statistical" },
      { id: 13, name: "Unsafe Shutdowns", raw: "142", rawVal: 142, normalized: 10, worst: 10, threshold: 0, status: "Critical", desc: "Số lần sập nguồn đột ngột quá cao", flags: "Notice" },
      { id: 14, name: "Media and Data Integrity Errors", raw: "86", rawVal: 86, normalized: 10, worst: 10, threshold: 0, status: "Critical", desc: "86 LỖI TOÀN VẸN DỮ LIỆU UNRECOVERABLE ECC", flags: "Critical" },
      { id: 15, name: "Number of Error Information Log Entries", raw: "248", rawVal: 248, normalized: 10, worst: 10, threshold: 0, status: "Critical", desc: "248 bản ghi lỗi ghi nhận trong chip", flags: "Critical" },
      { id: 16, name: "Warning Composite Temperature Time", raw: "1,240 minutes", rawVal: 1240, normalized: 30, worst: 30, threshold: 0, status: "Warning", desc: "Thời gian hoạt động ở nhiệt độ cao", flags: "Statistical" }
    ],
    
    failureRisk: "Critical",
    failureProbabilityPercent: 94.2,
    earlyWarnings: [
      { level: "critical", title: "CẢNH BÁO NGUY CẤP: SSD CÓ NGUY CƠ MẤT DỮ LIỆU ĐỘT NGỘT", desc: "Available Spare đã tụt xuống 7% (dưới ngưỡng 10%). Các cell nhớ NAND không còn khả năng tự sửa chữa và thay thế block hỏng." },
      { level: "critical", title: "86 lỗi đọc/ghi Unrecoverable Media Integrity Errors", desc: "Dữ liệu trên một số phân vùng đã bị hỏng vật lý hoặc không thể đọc được." },
      { level: "critical", title: "Hao mòn ghi (TBW) đạt 92% tuổi thọ tối đa", desc: "Dự kiến ổ cứng chỉ còn hoạt động được khoảng 30-45 ngày trước khi chuyển sang chế độ Read-Only hoặc chết hẳn." }
    ],
    recommendation: "SAO LƯU DỮ LIỆU KHẨN CẤP NGAY LẬP TỨC! Đưa máy đến trung tâm dịch vụ kỹ thuật hoặc Apple Authorized Service Provider để thay thế ổ cứng SSD mới."
  },

  "thunderbolt-nvme-hot": {
    id: "thunderbolt-nvme-hot",
    name: "Samsung 990 PRO 2TB (Thunderbolt 4 Pro Enclosure)",
    driveModel: "Samsung SSD 990 PRO 2TB (PCIe 4.0 NVMe)",
    serialNumber: "S73UNJ0W102934X",
    firmware: "4B2QJXD7",
    capacity: "2.00 TB (2,000,398,934,016 Bytes)",
    busType: "Thunderbolt 4 / USB4 (PCIe Gen4 x4 Tunnel)",
    formFactor: "M.2 2280 NVMe in Acasis TBU405 Enclosure",
    trimSupported: true,
    fileSystem: "APFS (Case-sensitive)",
    partitionScheme: "GUID Partition Table",
    sectorSize: "4096 bytes",
    
    healthScore: 92,
    performanceScore: 68,
    status: "Warning",
    statusText: "Thermal Warning - Cảnh báo quá nhiệt",
    statusColor: "var(--status-warning)",
    
    percentageUsed: 5,
    lifeRemaining: 95,
    estimatedLifetimeDays: 2800,
    ratedTBW: 1200,
    dataUnitsWrittenTB: 62.1,
    dataUnitsReadTB: 110.4,
    powerOnHours: 1840,
    powerCycles: 320,
    unsafeShutdowns: 18,
    temperature: 74, // High temperature warning
    
    macModel: "MacBook Pro (Connected via Thunderbolt 4 Port)",
    processor: "Host: Apple Silicon M-Series",
    graphics: "Thunderbolt 4 40Gbps Direct Link",
    memory: "DMA Buffer Enabled",
    osVersion: "macOS Sequoia 15.0",
    batteryHealth: 100.00,
    batteryCycleCount: 0,
    batteryCondition: "N/A (Nguồn ngoài)",

    batteryForensics: {
      isInstalled: false,
      cycleCount: 0,
      maxCycles: 1000,
      cyclesRemaining: 1000,
      cycleDepletionPercent: 0.00,
      designCapacity: 0,
      maxCapacity: 0,
      currentCapacity: 0,
      rawMaxCapacity: 0,
      healthPercentage: 100.00,
      capacityLossMAh: 0,
      capacityLossPercent: 0.00,
      stateOfChargePercent: 0.00,
      voltageMV: 0,
      amperageMA: 0,
      temperatureC: 0,
      serialNumber: "N/A - Direct Power",
      manufacturer: "N/A",
      deviceName: "External Enclosure Power",
      manufactureDate: "N/A",
      cellVoltages: [],
      cellMaxDiffMV: 0,
      classification: "DESKTOP_NO_BATTERY",
      tamperingStatus: "DESKTOP_NO_BATTERY",
      tamperingRiskPercent: 0,
      tamperingVerdict: "⚡ THIẾT BỊ CẮM NGUỒN TRỰC TIẾP: Ổ cứng ngoài hoặc thiết bị để bàn không trang bị pin.",
      tamperingReasons: []
    },
    
    attributes: [
      { id: 1, name: "Critical Warning", raw: "0x02 (Temperature Above High Threshold)", rawVal: 2, normalized: 60, worst: 60, threshold: 0, status: "Warning", desc: "Cảnh báo nhiệt độ vượt ngưỡng cho phép", flags: "Real-time" },
      { id: 2, name: "Composite Temperature", raw: "74 °C (347 K) - QUÁ NHIỆT", rawVal: 74, normalized: 40, worst: 35, threshold: 70, status: "Critical", desc: "Nhiệt độ 74°C gây giảm tốc độ (Thermal Throttling)", flags: "Real-time" },
      { id: 3, name: "Available Spare", raw: "100%", rawVal: 100, normalized: 100, worst: 100, threshold: 10, status: "OK", desc: "Dung lượng block dự phòng hoàn hảo", flags: "Pre-failure" },
      { id: 4, name: "Available Spare Threshold", raw: "10%", rawVal: 10, normalized: 100, worst: 100, threshold: 10, status: "OK", desc: "Ngưỡng cảnh báo", flags: "Static" },
      { id: 5, name: "Percentage Used", raw: "5%", rawVal: 5, normalized: 95, worst: 95, threshold: 100, status: "OK", desc: "Tỉ lệ hao mòn rất thấp", flags: "Wear-out" },
      { id: 6, name: "Data Units Read", raw: "215,625,000 (110.4 TB)", rawVal: 110.4, normalized: 100, worst: 100, threshold: 0, status: "OK", desc: "Dữ liệu đã đọc", flags: "Statistical" },
      { id: 7, name: "Data Units Written", raw: "121,289,062 (62.1 TB)", rawVal: 62.1, normalized: 100, worst: 100, threshold: 0, status: "OK", desc: "Dữ liệu đã ghi", flags: "Statistical" },
      { id: 8, name: "Controller Busy Time", raw: "680 minutes", rawVal: 680, normalized: 100, worst: 100, threshold: 0, status: "OK", desc: "Thời gian bận", flags: "Statistical" },
      { id: 9, name: "Power Cycles", raw: "320", rawVal: 320, normalized: 100, worst: 100, threshold: 0, status: "OK", desc: "Chu kỳ nguồn", flags: "Statistical" },
      { id: 10, name: "Power On Hours", raw: "1,840 hours", rawVal: 1840, normalized: 100, worst: 100, threshold: 0, status: "OK", desc: "Giờ hoạt động", flags: "Statistical" },
      { id: 11, name: "Unsafe Shutdowns", raw: "18", rawVal: 18, normalized: 82, worst: 82, threshold: 0, status: "Notice", desc: "Số lần ngắt cáp đột ngột không Eject", flags: "Notice" },
      { id: 12, name: "Media and Data Integrity Errors", raw: "0", rawVal: 0, normalized: 100, worst: 100, threshold: 0, status: "OK", desc: "Không có lỗi ECC", flags: "Critical" },
      { id: 13, name: "Warning Composite Temperature Time", raw: "340 minutes", rawVal: 340, normalized: 60, worst: 60, threshold: 0, status: "Warning", desc: "Tổng thời gian ổ bị nóng trên ngưỡng", flags: "Statistical" },
      { id: 14, name: "Critical Composite Temperature Time", raw: "45 minutes", rawVal: 45, normalized: 50, worst: 50, threshold: 0, status: "Warning", desc: "Thời gian ổ bị quá nhiệt nghiêm trọng", flags: "Critical" }
    ],
    
    failureRisk: "Medium",
    failureProbabilityPercent: 12.0,
    earlyWarnings: [
      { level: "critical", title: "CẢNH BÁO NHIỆT ĐỘ CAO: 74°C (Thermal Throttling)", desc: "Ổ NVMe ngoài đang bị quá nhiệt nghiêm trọng. Controller tự động giảm tốc độ đọc/ghi để tránh cháy nổ cell nhớ." },
      { level: "warning", title: "Phát hiện 18 lần ngắt cáp đột ngột (Unsafe Eject)", desc: "Hãy luôn bấm Eject ổ đĩa trên macOS Finder trước khi rút dây Thunderbolt." }
    ],
    recommendation: "Bổ sung tản nhiệt nhôm hoặc quạt làm mát cho box Thunderbolt. Tránh ghi file dung lượng lớn liên tục khi nhiệt độ vượt quá 70°C."
  }
};

window.MAC_PRESETS = MAC_PRESETS;
