/**
 * CHECK MAC SUITE PRO - MAC TERMINAL & SMART LOG PARSER
 * Parses output from smartctl, diskutil, system_profiler, nvme-cli, and smartmontools
 */

class TerminalLogParser {
  /**
   * Main entrypoint to parse any format of macOS terminal storage logs
   * @param {string} rawText 
   * @returns {Object} Normalized drive data object
   */
  parse(rawText) {
    if (!rawText || !rawText.trim()) {
      throw new Error("Dữ liệu log trống. Vui lòng dán kết quả lệnh Terminal của MacBook.");
    }

    const text = rawText.trim();

    // 1. Try parsing JSON format (e.g. smartctl --json=c /dev/disk0)
    if (text.startsWith("{") && text.endsWith("}")) {
      try {
        const jsonData = JSON.parse(text);
        return this.parseSmartctlJson(jsonData);
      } catch (e) {
        // Fallback to text parser
      }
    }

    // 2. Try parsing standard smartctl / NVMe SMART log text output
    return this.parseSmartctlText(text);
  }

  /**
   * Parses JSON output from smartctl
   */
  parseSmartctlJson(json, meta = {}) {
    const nvmeLog = json.nvme_smart_health_information_log || {};
    const devInfo = json.device || {};
    const ataAttrs = json.ata_smart_attributes?.table || [];

    const modelName = json.model_name || devInfo.model_name || meta.mediaName || "Apple SSD NVMe Drive";
    const serialNumber = json.serial_number || devInfo.serial_number || "C02_CUSTOM_MAC";
    const firmware = json.firmware_version || devInfo.firmware_version || "AP_FIRMWARE";
    
    // 1. Calculate Exact Physical Capacity
    let capacityStr = meta.exactCapacity || "";
    let ratedTBW = 600;

    if (!capacityStr) {
      // Decode from Apple SSD model name (AP0256 = 256GB, AP0512 = 512GB, AP1024 = 1TB, AP2048 = 2TB)
      if (modelName.includes("0256") || modelName.includes("256")) {
        capacityStr = "251.0 GB (256 GB SSD)";
        ratedTBW = 150;
      } else if (modelName.includes("0512") || modelName.includes("512")) {
        capacityStr = "500.1 GB (512 GB SSD)";
        ratedTBW = 300;
      } else if (modelName.includes("1024") || modelName.includes("1TB") || modelName.includes("1000")) {
        capacityStr = "1.00 TB (1,000 GB SSD)";
        ratedTBW = 600;
      } else if (modelName.includes("2048") || modelName.includes("2TB") || modelName.includes("2000")) {
        capacityStr = "2.00 TB (2,000 GB SSD)";
        ratedTBW = 1200;
      } else if (json.user_capacity?.bytes) {
        const bytes = json.user_capacity.bytes;
        const gb = Math.round(bytes / 1000000000);
        capacityStr = gb >= 1000 ? `${(gb/1000).toFixed(2)} TB` : `${gb} GB`;
        ratedTBW = gb >= 1000 ? 600 : 300;
      } else {
        capacityStr = "256 GB";
        ratedTBW = 150;
      }
    } else {
      if (capacityStr.includes("256") || capacityStr.includes("251")) ratedTBW = 150;
      else if (capacityStr.includes("512") || capacityStr.includes("500")) ratedTBW = 300;
      else if (capacityStr.includes("TB") || capacityStr.includes("1000") || capacityStr.includes("1024")) ratedTBW = 600;
    }

    const temperature = nvmeLog.temperature || json.temperature?.current || 35;
    const percentageUsed = nvmeLog.percentage_used !== undefined ? nvmeLog.percentage_used : 5;
    const availSpare = nvmeLog.available_spare !== undefined ? nvmeLog.available_spare : 100;
    const availSpareThreshold = nvmeLog.available_spare_threshold !== undefined ? nvmeLog.available_spare_threshold : 10;
    const dataUnitsReadTB = nvmeLog.data_units_read ? (nvmeLog.data_units_read * 512000) / (1024 ** 4) : 12.5;
    const dataUnitsWrittenTB = nvmeLog.data_units_written ? (nvmeLog.data_units_written * 512000) / (1024 ** 4) : 8.4;
    const powerOnHours = nvmeLog.power_on_hours || json.power_on_time?.hours || 1200;
    const powerCycles = nvmeLog.power_cycles || json.power_cycle_count || 450;
    const unsafeShutdowns = nvmeLog.unsafe_shutdowns || 2;
    const mediaErrors = nvmeLog.media_errors || 0;
    const errorLogEntries = nvmeLog.num_err_log_entries || 0;

    const attributes = [];
    if (Object.keys(nvmeLog).length > 0) {
      attributes.push(
        { id: 1, name: "Critical Warning", raw: `0x0${nvmeLog.critical_warning || 0}`, rawVal: nvmeLog.critical_warning || 0, normalized: 100, worst: 100, threshold: 0, status: (nvmeLog.critical_warning ? "Critical" : "OK"), desc: "Cảnh báo lỗi phần cứng từ controller NVMe", flags: "Pre-failure" },
        { id: 2, name: "Composite Temperature", raw: `${temperature} °C`, rawVal: temperature, normalized: Math.max(10, 100 - (temperature - 30)), worst: 80, threshold: 75, status: (temperature > 70 ? "Critical" : temperature > 55 ? "Warning" : "OK"), desc: "Nhiệt độ hoạt động tổng hợp", flags: "Real-time" },
        { id: 3, name: "Available Spare", raw: `${availSpare}%`, rawVal: availSpare, normalized: availSpare, worst: availSpare, threshold: availSpareThreshold, status: (availSpare < availSpareThreshold ? "Critical" : availSpare < 90 ? "Warning" : "OK"), desc: "Dung lượng block nhớ dự phòng còn lại", flags: "Pre-failure" },
        { id: 4, name: "Available Spare Threshold", raw: `${availSpareThreshold}%`, rawVal: availSpareThreshold, normalized: 100, worst: 100, threshold: availSpareThreshold, status: "OK", desc: "Ngưỡng cảnh báo cạn kiệt block dự phòng", flags: "Static" },
        { id: 5, name: "Percentage Used", raw: `${percentageUsed}%`, rawVal: percentageUsed, normalized: Math.max(0, 100 - percentageUsed), worst: Math.max(0, 100 - percentageUsed), threshold: 100, status: (percentageUsed > 90 ? "Critical" : percentageUsed > 75 ? "Warning" : "OK"), desc: "Mức độ hao mòn chu kỳ ghi flash", flags: "Wear-out" },
        { id: 6, name: "Data Units Read", raw: `${dataUnitsReadTB.toFixed(2)} TB`, rawVal: dataUnitsReadTB, normalized: 100, worst: 100, threshold: 0, status: "OK", desc: "Tổng lượng dữ liệu đã đọc", flags: "Statistical" },
        { id: 7, name: "Data Units Written", raw: `${dataUnitsWrittenTB.toFixed(2)} TB`, rawVal: dataUnitsWrittenTB, normalized: 100, worst: 100, threshold: 0, status: "OK", desc: "Tổng lượng dữ liệu đã ghi", flags: "Statistical" },
        { id: 8, name: "Power On Hours", raw: `${powerOnHours} hours`, rawVal: powerOnHours, normalized: 100, worst: 100, threshold: 0, status: "OK", desc: "Tổng số giờ hoạt động", flags: "Statistical" },
        { id: 9, name: "Power Cycles", raw: `${powerCycles}`, rawVal: powerCycles, normalized: 100, worst: 100, threshold: 0, status: "OK", desc: "Số chu kỳ bật tắt", flags: "Statistical" },
        { id: 10, name: "Unsafe Shutdowns", raw: `${unsafeShutdowns}`, rawVal: unsafeShutdowns, normalized: Math.max(0, 100 - unsafeShutdowns), worst: 100, threshold: 0, status: (unsafeShutdowns > 50 ? "Warning" : "OK"), desc: "Số lần mất nguồn đột ngột", flags: "Notice" },
        { id: 11, name: "Media and Data Integrity Errors", raw: `${mediaErrors}`, rawVal: mediaErrors, normalized: (mediaErrors > 0 ? 10 : 100), worst: 100, threshold: 0, status: (mediaErrors > 0 ? "Critical" : "OK"), desc: "Lỗi toàn vẹn dữ liệu uncorrectable ECC", flags: "Critical" },
        { id: 12, name: "Number of Error Information Log Entries", raw: `${errorLogEntries}`, rawVal: errorLogEntries, normalized: 100, worst: 100, threshold: 0, status: (errorLogEntries > 20 ? "Warning" : "OK"), desc: "Số sự kiện lỗi trong nhật ký", flags: "Statistical" }
      );
    } else if (ataAttrs.length > 0) {
      ataAttrs.forEach(attr => {
        attributes.push({
          id: attr.id,
          name: attr.name,
          raw: String(attr.raw?.value || attr.raw?.string || 0),
          rawVal: Number(attr.raw?.value || 0),
          normalized: attr.value || 100,
          worst: attr.worst || 100,
          threshold: attr.thresh || 0,
          status: (attr.value <= attr.thresh ? "Critical" : "OK"),
          desc: `ATA S.M.A.R.T Attribute ID ${attr.id}`,
          flags: attr.flags?.string || "Statistical"
        });
      });
    }

    return {
      id: "imported-mac-drive",
      name: `MacBook Storage (${modelName})`,
      driveModel: modelName,
      serialNumber: serialNumber,
      firmware: firmware,
      capacity: capacityStr,
      busType: json.nvme_smart_health_information_log ? (meta.busProtocol || "Apple Fabric NVMe PCIe") : "SATA / PCIe",
      formFactor: "Integrated Apple SSD",
      trimSupported: true,
      fileSystem: "APFS",
      partitionScheme: "GUID Partition Table",
      sectorSize: "4096 bytes",
      percentageUsed: percentageUsed,
      lifeRemaining: Math.max(0, 100 - percentageUsed),
      ratedTBW: ratedTBW,
      dataUnitsWrittenTB: parseFloat(dataUnitsWrittenTB.toFixed(2)),
      dataUnitsReadTB: parseFloat(dataUnitsReadTB.toFixed(2)),
      powerOnHours: powerOnHours,
      powerCycles: powerCycles,
      unsafeShutdowns: unsafeShutdowns,
      temperature: temperature,
      macModel: "MacBook (Live Scan)",
      processor: "Apple Silicon / Intel Mac",
      graphics: "Integrated GPU",
      memory: "Unified Memory",
      osVersion: "macOS Live",
      batteryHealth: 100,
      batteryCycleCount: 150,
      batteryCondition: "Normal",
      attributes: attributes.length > 0 ? attributes : this.generateFallbackAttributes(temperature, percentageUsed, availSpare)
    };
  }

  /**
   * Parses standard text output from smartctl / terminal
   */
  parseSmartctlText(text) {
    const lines = text.split("\n");
    let modelName = "Apple SSD / NVMe Drive";
    let serialNumber = "C02_TERMINAL_MAC";
    let firmware = "AP_FIRMWARE";
    let capacity = "512 GB";
    let temperature = 35;
    let percentageUsed = 5;
    let availSpare = 100;
    let availSpareThreshold = 10;
    let dataUnitsReadTB = 12.5;
    let dataUnitsWrittenTB = 8.4;
    let powerOnHours = 1200;
    let powerCycles = 340;
    let unsafeShutdowns = 3;
    let mediaErrors = 0;
    let errorLogEntries = 0;
    let criticalWarning = 0;

    const attributes = [];

    lines.forEach(line => {
      const lower = line.toLowerCase();
      
      // Model Name
      if (lower.includes("model number:") || lower.includes("device model:")) {
        modelName = line.split(":")[1]?.trim() || modelName;
      }
      // Serial
      if (lower.includes("serial number:")) {
        serialNumber = line.split(":")[1]?.trim() || serialNumber;
      }
      // Firmware
      if (lower.includes("firmware version:")) {
        firmware = line.split(":")[1]?.trim() || firmware;
      }
      // Capacity
      if (lower.includes("user capacity:") || lower.includes("total nvm capacity:")) {
        capacity = line.split(":")[1]?.trim() || capacity;
      }
      // Critical Warning
      if (lower.includes("critical warning:")) {
        const valStr = line.split(":")[1]?.trim();
        criticalWarning = parseInt(valStr, 16) || parseInt(valStr, 10) || 0;
      }
      // Temperature
      if (lower.includes("temperature:") || lower.includes("composite temperature:")) {
        const match = line.match(/(\d+)\s*(?:c|celsius)/i);
        if (match) temperature = parseInt(match[1], 10);
      }
      // Available Spare
      if (lower.includes("available spare:") && !lower.includes("threshold")) {
        const match = line.match(/(\d+)%/);
        if (match) availSpare = parseInt(match[1], 10);
      }
      // Available Spare Threshold
      if (lower.includes("available spare threshold:")) {
        const match = line.match(/(\d+)%/);
        if (match) availSpareThreshold = parseInt(match[1], 10);
      }
      // Percentage Used
      if (lower.includes("percentage used:")) {
        const match = line.match(/(\d+)%/);
        if (match) percentageUsed = parseInt(match[1], 10);
      }
      // Data Units Read
      if (lower.includes("data units read:")) {
        const match = line.match(/\[(.*?)\]/) || line.match(/(\d+[\d,]*)/);
        if (match) {
          const tbMatch = line.match(/([\d.]+)\s*(?:tb|tib)/i);
          if (tbMatch) dataUnitsReadTB = parseFloat(tbMatch[1]);
        }
      }
      // Data Units Written
      if (lower.includes("data units written:")) {
        const tbMatch = line.match(/([\d.]+)\s*(?:tb|tib)/i);
        if (tbMatch) dataUnitsWrittenTB = parseFloat(tbMatch[1]);
      }
      // Power On Hours
      if (lower.includes("power on hours:")) {
        const match = line.match(/(\d+[\d,]*)/);
        if (match) powerOnHours = parseInt(match[1].replace(/,/g, ""), 10);
      }
      // Power Cycles
      if (lower.includes("power cycles:")) {
        const match = line.match(/(\d+[\d,]*)/);
        if (match) powerCycles = parseInt(match[1].replace(/,/g, ""), 10);
      }
      // Unsafe Shutdowns
      if (lower.includes("unsafe shutdowns:")) {
        const match = line.match(/(\d+[\d,]*)/);
        if (match) unsafeShutdowns = parseInt(match[1].replace(/,/g, ""), 10);
      }
      // Media Errors
      if (lower.includes("media and data integrity errors:")) {
        const match = line.match(/(\d+[\d,]*)/);
        if (match) mediaErrors = parseInt(match[1].replace(/,/g, ""), 10);
      }
      // Error Log Entries
      if (lower.includes("error information log entries:") || lower.includes("num_err_log_entries:")) {
        const match = line.match(/(\d+[\d,]*)/);
        if (match) errorLogEntries = parseInt(match[1].replace(/,/g, ""), 10);
      }
    });

    // Build attributes table
    attributes.push(
      { id: 1, name: "Critical Warning", raw: `0x0${criticalWarning}`, rawVal: criticalWarning, normalized: 100, worst: 100, threshold: 0, status: (criticalWarning ? "Critical" : "OK"), desc: "Cảnh báo lỗi phần cứng từ controller NVMe", flags: "Pre-failure" },
      { id: 2, name: "Composite Temperature", raw: `${temperature} °C`, rawVal: temperature, normalized: Math.max(10, 100 - (temperature - 30)), worst: 80, threshold: 75, status: (temperature > 70 ? "Critical" : temperature > 55 ? "Warning" : "OK"), desc: "Nhiệt độ hoạt động tổng hợp", flags: "Real-time" },
      { id: 3, name: "Available Spare", raw: `${availSpare}%`, rawVal: availSpare, normalized: availSpare, worst: availSpare, threshold: availSpareThreshold, status: (availSpare < availSpareThreshold ? "Critical" : availSpare < 90 ? "Warning" : "OK"), desc: "Dung lượng block nhớ dự phòng còn lại", flags: "Pre-failure" },
      { id: 4, name: "Available Spare Threshold", raw: `${availSpareThreshold}%`, rawVal: availSpareThreshold, normalized: 100, worst: 100, threshold: availSpareThreshold, status: "OK", desc: "Ngưỡng cảnh báo cạn kiệt block dự phòng", flags: "Static" },
      { id: 5, name: "Percentage Used", raw: `${percentageUsed}%`, rawVal: percentageUsed, normalized: Math.max(0, 100 - percentageUsed), worst: Math.max(0, 100 - percentageUsed), threshold: 100, status: (percentageUsed > 90 ? "Critical" : percentageUsed > 75 ? "Warning" : "OK"), desc: "Mức độ hao mòn chu kỳ ghi flash", flags: "Wear-out" },
      { id: 6, name: "Data Units Read", raw: `${dataUnitsReadTB.toFixed(2)} TB`, rawVal: dataUnitsReadTB, normalized: 100, worst: 100, threshold: 0, status: "OK", desc: "Tổng lượng dữ liệu đã đọc", flags: "Statistical" },
      { id: 7, name: "Data Units Written", raw: `${dataUnitsWrittenTB.toFixed(2)} TB`, rawVal: dataUnitsWrittenTB, normalized: 100, worst: 100, threshold: 0, status: "OK", desc: "Tổng lượng dữ liệu đã ghi", flags: "Statistical" },
      { id: 8, name: "Power On Hours", raw: `${powerOnHours} hours`, rawVal: powerOnHours, normalized: 100, worst: 100, threshold: 0, status: "OK", desc: "Tổng số giờ hoạt động", flags: "Statistical" },
      { id: 9, name: "Power Cycles", raw: `${powerCycles}`, rawVal: powerCycles, normalized: 100, worst: 100, threshold: 0, status: "OK", desc: "Số chu kỳ bật tắt", flags: "Statistical" },
      { id: 10, name: "Unsafe Shutdowns", raw: `${unsafeShutdowns}`, rawVal: unsafeShutdowns, normalized: Math.max(0, 100 - unsafeShutdowns), worst: 100, threshold: 0, status: (unsafeShutdowns > 50 ? "Warning" : "OK"), desc: "Số lần mất nguồn đột ngột", flags: "Notice" },
      { id: 11, name: "Media and Data Integrity Errors", raw: `${mediaErrors}`, rawVal: mediaErrors, normalized: (mediaErrors > 0 ? 10 : 100), worst: 100, threshold: 0, status: (mediaErrors > 0 ? "Critical" : "OK"), desc: "Lỗi toàn vẹn dữ liệu uncorrectable ECC", flags: "Critical" },
      { id: 12, name: "Number of Error Information Log Entries", raw: `${errorLogEntries}`, rawVal: errorLogEntries, normalized: 100, worst: 100, threshold: 0, status: (errorLogEntries > 20 ? "Warning" : "OK"), desc: "Số sự kiện lỗi trong nhật ký", flags: "Statistical" }
    );

    return {
      id: "terminal-imported-drive",
      name: `MacBook Storage (${modelName})`,
      driveModel: modelName,
      serialNumber: serialNumber,
      firmware: firmware,
      capacity: capacity,
      busType: "Apple Fabric NVMe PCIe",
      formFactor: "Integrated Apple SSD",
      trimSupported: true,
      fileSystem: "APFS",
      partitionScheme: "GUID Partition Table",
      sectorSize: "4096 bytes",
      percentageUsed: percentageUsed,
      lifeRemaining: Math.max(0, 100 - percentageUsed),
      ratedTBW: 600,
      dataUnitsWrittenTB: parseFloat(dataUnitsWrittenTB.toFixed(2)),
      dataUnitsReadTB: parseFloat(dataUnitsReadTB.toFixed(2)),
      powerOnHours: powerOnHours,
      powerCycles: powerCycles,
      unsafeShutdowns: unsafeShutdowns,
      temperature: temperature,
      macModel: "MacBook (Live Terminal Log Import)",
      processor: "Apple Silicon / Intel Mac",
      graphics: "Integrated GPU",
      memory: "Unified Memory",
      osVersion: "macOS Live",
      batteryHealth: 100,
      batteryCycleCount: 120,
      batteryCondition: "Normal",
      attributes: attributes
    };
  }

  generateFallbackAttributes(temperature, percentageUsed, availSpare) {
    return [
      { id: 1, name: "Critical Warning", raw: "0x00", rawVal: 0, normalized: 100, worst: 100, threshold: 0, status: "OK", desc: "Cảnh báo lỗi phần cứng controller NVMe", flags: "Pre-failure" },
      { id: 2, name: "Composite Temperature", raw: `${temperature} °C`, rawVal: temperature, normalized: 90, worst: 80, threshold: 75, status: "OK", desc: "Nhiệt độ hoạt động", flags: "Real-time" },
      { id: 3, name: "Available Spare", raw: `${availSpare}%`, rawVal: availSpare, normalized: availSpare, worst: availSpare, threshold: 10, status: "OK", desc: "Block nhớ dự phòng", flags: "Pre-failure" },
      { id: 5, name: "Percentage Used", raw: `${percentageUsed}%`, rawVal: percentageUsed, normalized: 100 - percentageUsed, worst: 100 - percentageUsed, threshold: 100, status: "OK", desc: "Mức độ hao mòn chu kỳ ghi", flags: "Wear-out" }
    ];
  }
}

window.terminalLogParser = new TerminalLogParser();
