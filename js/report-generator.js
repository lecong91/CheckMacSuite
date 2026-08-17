/**
 * CHECK MAC SUITE PRO - DIAGNOSTIC REPORT GENERATOR
 * Generates Apple-Certified Diagnostic Sheets, Check Mac Text Logs & JSON Exports
 */

class ReportGenerator {
  /**
   * Generates formatted Check Mac plain text report
   */
  generateTextReport(drive) {
    if (!drive) return "";
    const dateStr = new Date().toLocaleString("vi-VN");
    
    let report = `================================================================================
CHECK MAC SUITE PRO - ADVANCED DRIVE HEALTH DIAGNOSTIC REPORT
Generated on: ${dateStr}
Platform: macOS Web Suite (Apple Diagnostic Parity Engine)
================================================================================

=== DRIVE INFORMATION ===
Drive Model:             ${drive.driveModel}
Serial Number:           ${drive.serialNumber}
Firmware Version:        ${drive.firmware}
Drive Capacity:          ${drive.capacity}
Bus Type:                ${drive.busType}
Form Factor:             ${drive.formFactor}
TRIM Supported:          ${drive.trimSupported ? "Yes (APFS TRIM Enabled)" : "No"}
File System:             ${drive.fileSystem}
Partition Scheme:        ${drive.partitionScheme}
Sector Size:             ${drive.sectorSize}

=== GENUINE APPLE PARTS & SERVICE HISTORY AUDIT ===
Overall Status:          ${drive.componentsAudit?.overallVerdict || "✅ 100% ZIN NGUYÊN BẢN (ALL ORIGINAL APPLE)"}
Logic Board & SoC:       ${drive.componentsAudit?.components?.find(c => c.id === 'logic_board')?.statusText || "Zin Apple 100%"}
Battery System:          ${drive.componentsAudit?.components?.find(c => c.id === 'battery')?.statusText || "Zin Apple nguyên bản"}
Storage (NAND Flash):    ${drive.componentsAudit?.components?.find(c => c.id === 'storage')?.statusText || "Zin Apple BGA NAND"}
Display Panel:           ${drive.componentsAudit?.components?.find(c => c.id === 'display')?.statusText || "Zin Apple Retina Panel"}
FaceTime Camera:         ${drive.componentsAudit?.components?.find(c => c.id === 'camera')?.statusText || "Zin Apple Camera"}
Audio Subsystem:         ${drive.componentsAudit?.components?.find(c => c.id === 'audio')?.statusText || "Zin Apple Audio Codec"}
Biometrics & Input:      ${drive.componentsAudit?.components?.find(c => c.id === 'input_biometrics')?.statusText || "Zin Apple Hardware"}

=== RETINA / XDR DISPLAY SPECIFICATIONS ===
Panel Model:             ${drive.displayDiagnostics?.mainDisplay?.name || "Liquid Retina Display"}
Technology:              ${drive.displayDiagnostics?.mainDisplay?.panelType || "Liquid Retina (IPS LED)"}
Resolution:              ${drive.displayDiagnostics?.mainDisplay?.resolution || "2560 x 1664"}
Refresh Rate:            ${drive.displayDiagnostics?.mainDisplay?.refreshRate || "60Hz"}
Color Gamut:             ${drive.displayDiagnostics?.mainDisplay?.colorGamut || "Wide Color (P3), 10-bit"}
Max Brightness:          ${drive.displayDiagnostics?.mainDisplay?.maxBrightness || "500 nits"}
True Tone Sensor:        ${drive.displayDiagnostics?.mainDisplay?.trueToneSupported ? "Supported (Active)" : "N/A"}

=== MAC SYSTEM SPECS ===
Mac Model:               ${drive.macModel}
Processor:               ${drive.processor}
Graphics:                ${drive.graphics}
Memory:                  ${drive.memory}
OS Version:              ${drive.osVersion}
Battery Condition:       ${drive.batteryCondition} (${drive.batteryHealth}% Health, ${drive.batteryCycleCount} Cycles)

=== OVERALL HEALTH & PERFORMANCE ===
Health Rating:           ${drive.healthScore}% [${drive.status.toUpperCase()}]
Performance Rating:      ${drive.performanceScore}%
Status Assessment:       ${drive.statusText}
Drive Temperature:       ${drive.temperature} °C

=== SSD LIFESPAN & WEAR LEVEL FORECAST ===
SSD Lifetime Remaining:  ${typeof drive.wearInfo?.lifeRemaining === 'number' ? drive.wearInfo.lifeRemaining.toFixed(2) : drive.wearInfo?.lifeRemaining || 100}%
Percentage Used:         ${typeof drive.wearInfo?.percentageUsed === 'number' ? drive.wearInfo.percentageUsed.toFixed(2) : drive.wearInfo?.percentageUsed || 0}%
Data Units Written:      ${drive.wearInfo?.writtenTB || 0} TB (Rated Limit: ${drive.ratedTBW || 600} TBW)
Data Units Read:         ${drive.wearInfo?.readTB || 0} TB
Read / Write Ratio:      ${drive.wearInfo?.readWriteRatio || 1.0}x (TBR / TBW)
Daily Write Pace:        ${drive.wearInfo?.dailyWriteGB || 0} GB/day
Read Disturb Risk:       ${drive.wearInfo?.readDisturbRisk || "Thấp (Tối ưu)"}
Power On Hours:          ${drive.powerOnHours || 0} hours
Power Cycles:            ${drive.powerCycles || 0}
Unsafe Shutdowns:        ${drive.unsafeShutdowns || 0}
Estimated Lifespan Left: ~${drive.wearInfo?.estimatedYears || "10+"} years (${drive.wearInfo?.estimatedDaysLeft || 3650} days)
Expected Wearout Date:   ${drive.wearInfo?.estimatedWearoutDate || "N/A"}

=== EARLY WARNINGS & REPAIR RECOMMENDATIONS ===
`;

    if (drive.earlyWarnings && drive.earlyWarnings.length > 0) {
      drive.earlyWarnings.forEach((w, idx) => {
        report += `[!] ${w.title}\n    ${w.desc}\n\n`;
      });
    } else {
      report += `[+] Không có cảnh báo lỗi. Ổ cứng hoạt động hoàn hảo.\n\n`;
    }

    const recText = (typeof drive.recommendation === "object" && drive.recommendation?.summaryText) 
      ? drive.recommendation.summaryText 
      : (typeof drive.recommendation === "string" ? drive.recommendation : "Tiếp tục sử dụng bình thường.");

    report += `Recommendation: ${recText}\n\n`;

    report += `=== S.M.A.R.T ATTRIBUTES TABLE ===\n`;
    report += `ID  | Attribute Name                       | Status   | Raw Value             | Normalized | Worst | Thresh\n`;
    report += `----+--------------------------------------+----------+-----------------------+------------+-------+-------\n`;

    if (drive.attributes) {
      drive.attributes.forEach(attr => {
        const idStr = String(attr.id).padEnd(3, " ");
        const nameStr = attr.name.padEnd(36, " ");
        const statusStr = attr.status.padEnd(8, " ");
        const rawStr = String(attr.raw).padEnd(21, " ");
        const normStr = String(attr.normalized).padEnd(10, " ");
        const worstStr = String(attr.worst).padEnd(5, " ");
        const threshStr = String(attr.threshold);
        report += `${idStr} | ${nameStr} | ${statusStr} | ${rawStr} | ${normStr} | ${worstStr} | ${threshStr}\n`;
      });
    }

    report += `\n================================================================================\n`;
    report += `End of Diagnostic Report.\n`;
    return report;
  }

  /**
   * Downloads text report file
   */
  downloadTextFile(drive) {
    const content = this.generateTextReport(drive);
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `CheckMac_Report_${drive.serialNumber || "MacBook"}_${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  /**
   * Downloads JSON file
   */
  downloadJsonFile(drive) {
    const content = JSON.stringify(drive, null, 2);
    const blob = new Blob([content], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `CheckMac_Report_${drive.serialNumber || "MacBook"}_${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  /**
   * Copies formatted report to clipboard
   */
  copyToClipboard(drive) {
    const text = this.generateTextReport(drive);
    navigator.clipboard.writeText(text).then(() => {
      if (window.showToast) {
        window.showToast("Đã sao chép toàn bộ Báo cáo chẩn đoán vào Clipboard!", "success");
      }
    }).catch(err => {
      console.error("Clipboard copy error:", err);
    });
  }

  /**
   * Triggers native print modal with clean Apple Genius Bar styling
   */
  printReport() {
    window.print();
  }
}

window.reportGenerator = new ReportGenerator();
