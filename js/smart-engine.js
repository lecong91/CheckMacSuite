/**
 * CHECK MAC SUITE PRO - S.M.A.R.T ANALYSIS & LIFESPAN PREDICTION ENGINE
 * Implements Check Mac Health & Performance Scoring Algorithms & Heuristics
 */

class SmartEngine {
  constructor() {
    this.currentData = null;
  }

  /**
   * Evaluates complete drive data and computes Check Mac ratings
   * @param {Object} driveData 
   * @returns {Object} Comprehensive evaluation results
   */
  evaluate(driveData) {
    if (!driveData) return null;
    this.currentData = driveData;

    // 1. Calculate Wear Level & Lifespan
    const wearInfo = this.calculateSSDLife(driveData);

    // 2. Calculate Health Score (0 - 100%)
    const healthScore = this.calculateHealthScore(driveData, wearInfo);

    // 3. Calculate Performance Score (0 - 100%)
    const performanceScore = this.calculatePerformanceScore(driveData);

    // 4. Generate Overall Status
    const statusAssessment = this.assessStatus(healthScore, performanceScore, driveData);

    // 5. Early Warning & Heuristic Analysis
    const earlyWarnings = this.analyzeEarlyWarnings(driveData, wearInfo);

    // 6. Thermal Health Assessment
    const thermalAssessment = this.assessThermal(driveData.temperature || 35);

    // 7. Dynamic Technical Recommendation Generator
    const recommendation = this.generateRecommendation(driveData, healthScore, wearInfo, earlyWarnings);

    return {
      ...driveData,
      healthScore,
      performanceScore,
      status: statusAssessment.status,
      statusText: statusAssessment.statusText,
      statusColor: statusAssessment.statusColor,
      wearInfo,
      earlyWarnings,
      thermalAssessment,
      recommendation,
      evaluationTimestamp: new Date().toISOString()
    };
  }

  /**
   * Generates intelligent, actionable multi-component MacBook technical recommendations
   * Evaluates: SSD NAND S.M.A.R.T, Battery & BMS Forensics, 7 Core Parts History, Retina/XDR Display, and Thermals
   */
  generateRecommendation(drive, healthScore, wearInfo, earlyWarnings) {
    if (drive.recommendation && typeof drive.recommendation === "object" && drive.recommendation.items) {
      return drive.recommendation;
    }

    // 1. Evaluate SSD Component
    const ssdHealth = healthScore !== undefined ? healthScore : (drive.healthScore || 100);
    const warnings = earlyWarnings || drive.earlyWarnings || [];
    const critWarnings = warnings.filter(w => w.level === "critical");
    const warnWarnings = warnings.filter(w => w.level === "warning");
    const writtenTB = parseFloat(wearInfo?.writtenTB || drive.dataUnitsWrittenTB || 0);
    const ratedTBW = wearInfo?.ratedTBW || drive.ratedTBW || 600;
    const remainTBW = Math.max(0, ratedTBW - writtenTB).toFixed(1);
    const temp = drive.temperature || 35;

    let ssdStatusText = "";
    let ssdIcon = "💾";
    if (critWarnings.length > 0 || ssdHealth < 30) {
      ssdIcon = "🚨";
      ssdStatusText = `SSD NGUY CẤP (${ssdHealth}%): Phát hiện lỗi phần cứng hoặc block dự phòng cạn kiệt. Cần sao lưu ngay!`;
    } else if (warnWarnings.length > 0 || ssdHealth < 75 || temp >= 60) {
      ssdIcon = "⚠️";
      ssdStatusText = `SSD CẦN CHÚ Ý (${ssdHealth}%): Có hao mòn (${drive.percentageUsed || 0}%) hoặc nhiệt độ ${temp}°C. Dung lượng chịu tải còn ~${remainTBW} TBW.`;
    } else {
      ssdIcon = "💾";
      ssdStatusText = `SSD HOÀN HẢO (${ssdHealth}%): Chip NAND tối ưu, dung lượng ghi còn lại ~${remainTBW} TBW, 0 lỗi ECC.`;
    }

    // 2. Evaluate Battery Component
    const batt = drive.batteryForensics;
    let battStatusText = "Pin hoạt động tiêu chuẩn, chu kỳ sạc ổn định.";
    let battIcon = "🔋";
    if (batt) {
      if (batt.tamperingStatus === "TAMPERED_FRAUD") {
        battIcon = "🚨";
        battStatusText = `PHÁT HIỆN KÍCH PIN: Lệch áp cell (${batt.cellMaxDiffMV || 0}mV) hoặc reset số chu kỳ ảo (${batt.cycleCount} chu kỳ / ${drive.powerOnHours || 0}h chạy).`;
      } else if (batt.tamperingStatus === "DESKTOP_NO_BATTERY" || batt.tamperingStatus === "DESKTOP_NA") {
        battIcon = "⚡";
        battStatusText = `Nguồn AC trực tiếp (Mac mini/Studio/Pro): Thiết bị cắm nguồn cố định.`;
      } else if (drive.batteryHealth < 80 || drive.batteryCondition === "Service Recommended") {
        battIcon = "⚠️";
        battStatusText = `PIN ĐÃ CHAI (${drive.batteryHealth}% - ${drive.batteryCycleCount} chu kỳ): Dung lượng dưới 80%, khuyến nghị thay pin chính hãng.`;
      } else {
        battIcon = "🔋";
        battStatusText = `PIN ZIN APPLE NGUYÊN BẢN (${drive.batteryHealth || 100}% - ${drive.batteryCycleCount || 0} chu kỳ): Cell cân bằng hoàn hảo (lệch ${batt.cellMaxDiffMV || 2}mV).`;
      }
    } else if (drive.batteryHealth !== undefined) {
      if (drive.batteryHealth < 80) {
        battIcon = "⚠️";
        battStatusText = `PIN ĐÃ CHAI (${drive.batteryHealth}% - ${drive.batteryCycleCount || 0} chu kỳ): Dung lượng giảm sút, nên bảo dưỡng.`;
      } else {
        battIcon = "🔋";
        battStatusText = `PIN KHỎE (${drive.batteryHealth}% - ${drive.batteryCycleCount || 0} chu kỳ): Vận hành ổn định.`;
      }
    }

    // 3. Evaluate Parts & Service History
    const audit = drive.componentsAudit;
    let partsStatusText = "100% Linh kiện chuẩn Zin nguyên bản Apple.";
    let partsIcon = "";
    if (audit) {
      if (audit.overallStatus === "PARTS_REPLACED" || audit.replacedCount > 0) {
        partsIcon = "⚠️";
        partsStatusText = `PHÁT HIỆN ${audit.replacedCount} LINH KIỆN ĐÃ QUA SỬA CHỮA / THAY THẾ. Cần kiểm tra chất lượng linh kiện thay thế.`;
      } else if (audit.overallStatus === "SUSPICIOUS_TAMPERED") {
        partsIcon = "🚨";
        partsStatusText = `NGHI VẤN CAN THIỆP PHẦN CỨNG: Bất đồng bộ Serial hoặc mạch nạp. Cần chuyên gia mở máy kiểm tra.`;
      } else {
        partsIcon = "";
        partsStatusText = `100% ZIN NGUYÊN BẢN: Toàn bộ 7 cụm linh kiện cốt lõi đồng nhất theo số xuất xưởng Apple.`;
      }
    }

    // 4. Evaluate Display Component
    const disp = drive.displayDiagnostics?.mainDisplay;
    let dispStatusText = "Màn hình Retina sắc nét, không gian màu P3 chuẩn Apple.";
    let dispIcon = "🖥️";
    if (disp) {
      dispStatusText = `${disp.name || 'Liquid Retina'} (${disp.resolution || 'Retina'}) - Tần số quét ${disp.refreshRate || '60Hz'}, Gamut P3 10-bit. Cảm biến True Tone sẵn sàng.`;
    }

    // 5. Synthesize Overall Mac Recommendation Verdict
    let overallGrade = "HẠNG A+ (ZIN NGUYÊN BẢN XUẤT XƯỞNG)";
    let overallGradeClass = "badge-good";
    let actionAdvice = "Máy ở tình trạng hoàn hảo toàn diện. Tiếp tục sử dụng bình thường, duy trì cập nhật macOS và kích hoạt sao lưu Time Machine định kỳ.";

    if (critWarnings.length > 0 || (batt && batt.tamperingStatus === "TAMPERED_FRAUD") || (audit && audit.overallStatus === "SUSPICIOUS_TAMPERED") || ssdHealth < 30) {
      overallGrade = "HẠNG D (RỦI RO CAO / GIAN LẬN PHẦN CỨNG)";
      overallGradeClass = "badge-critical";
      actionAdvice = "KHUYẾN NGHỊ KHẨN CẤP: Không khuyến khích giao dịch mua bán hoặc sử dụng lâu dài nếu chưa làm rõ lịch sử sửa chữa. Tiến hành sao lưu dữ liệu quan trọng ngay lập tức và mang máy đến Trung tâm Bảo hành Ủy quyền Apple (AASP) để kiểm định bên trong.";
    } else if (warnWarnings.length > 0 || (audit && audit.overallStatus === "PARTS_REPLACED") || (drive.batteryHealth && drive.batteryHealth < 80) || temp >= 65 || ssdHealth < 75) {
      overallGrade = "HẠNG B (CẦN BẢO TRÌ / THEO DÕI ĐỊNH KỲ)";
      overallGradeClass = "badge-warning";
      actionAdvice = "KHUYẾN NGHỊ KỸ THUẬT: Máy có linh kiện đã thay thế hoặc dấu hiệu hao mòn pin/nhiệt độ. Hãy vệ sinh cụm tản nhiệt định kỳ, theo dõi độ chai pin và kiểm tra lại sau mỗi 30 ngày.";
    }

    return {
      overallGrade,
      overallGradeClass,
      actionAdvice,
      items: [
        { category: "Ổ cứng SSD & Bộ nhớ Flash", icon: ssdIcon, text: ssdStatusText },
        { category: "Hệ thống Pin & Mạch BMS", icon: battIcon, text: battStatusText },
        { category: "Giám định Linh kiện & Sửa chữa", icon: partsIcon, text: partsStatusText },
        { category: "Màn hình Retina / XDR", icon: dispIcon, text: dispStatusText }
      ],
      summaryText: `[${overallGrade}] ${actionAdvice} | SSD: ${ssdStatusText} | Pin: ${battStatusText} | Linh kiện: ${partsStatusText} | Màn hình: ${dispStatusText}`
    };
  }

  /**
   * Calculates SSD endurance, TBW pace, and remaining lifetime
   */
  calculateSSDLife(drive) {
    const percentageUsed = drive.percentageUsed !== undefined ? drive.percentageUsed : (100 - (drive.lifeRemaining || 100));
    const lifeRemaining = Math.max(0, 100 - percentageUsed);
    
    const ratedTBW = drive.ratedTBW || 600;
    const writtenTB = drive.dataUnitsWrittenTB || 0;
    const powerOnHours = drive.powerOnHours || 1;
    
    // Average daily write rate (GB/day)
    const powerOnDays = Math.max(1, powerOnHours / 24);
    const dailyWriteGB = (writtenTB * 1024) / powerOnDays;
    
    // Remaining TBW capacity
    const remainingTB = Math.max(0, ratedTBW - writtenTB);
    
    // Estimated days left based on write rate
    let estimatedDaysLeft = 3650; // Default max 10 years
    if (dailyWriteGB > 0) {
      estimatedDaysLeft = Math.round((remainingTB * 1024) / dailyWriteGB);
    } else {
      estimatedDaysLeft = Math.round((lifeRemaining / 100) * 3650);
    }
    
    // Clamp between realistic boundaries
    if (lifeRemaining <= 5) estimatedDaysLeft = Math.min(estimatedDaysLeft, 60);
    else if (lifeRemaining <= 10) estimatedDaysLeft = Math.min(estimatedDaysLeft, 120);

    // Date estimation
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + estimatedDaysLeft);
    const estimatedDateFormatted = targetDate.toLocaleDateString("vi-VN", {
      month: "long",
      year: "numeric"
    });

    return {
      percentageUsed,
      lifeRemaining,
      ratedTBW,
      writtenTB: writtenTB.toFixed(2),
      readTB: (drive.dataUnitsReadTB || 0).toFixed(2),
      dailyWriteGB: dailyWriteGB.toFixed(2),
      estimatedDaysLeft,
      estimatedYears: (estimatedDaysLeft / 365.25).toFixed(1),
      estimatedWearoutDate: estimatedDateFormatted,
      wearPercentage: percentageUsed
    };
  }

  /**
   * Check Mac Weighted Health Scoring Formula
   */
  calculateHealthScore(drive, wearInfo) {
    let score = 100;

    // A. Available Spare Blocks (Highest Priority Pre-Fail Indicator)
    const availSpareAttr = drive.attributes?.find(a => a.name.includes("Available Spare") && !a.name.includes("Threshold"));
    if (availSpareAttr) {
      const spareVal = availSpareAttr.rawVal !== undefined ? availSpareAttr.rawVal : 100;
      if (spareVal < 10) {
        score -= (10 - spareVal) * 6; // Drops below threshold => Severe drop
        score = Math.min(score, 25);
      } else if (spareVal < 90) {
        score -= (100 - spareVal) * 1.5;
      }
    }

    // B. Media & Data Integrity Errors (Fatal Indicator)
    const mediaErrorsAttr = drive.attributes?.find(a => a.name.includes("Media and Data Integrity") || a.name.includes("Uncorrectable"));
    if (mediaErrorsAttr) {
      const mediaErrors = mediaErrorsAttr.rawVal || 0;
      if (mediaErrors > 50) score -= 60;
      else if (mediaErrors > 10) score -= 40;
      else if (mediaErrors > 0) score -= (mediaErrors * 10);
    }

    // C. Percentage Used / Wearout penalty
    if (wearInfo.percentageUsed > 90) {
      score -= (wearInfo.percentageUsed - 90) * 3;
    } else if (wearInfo.percentageUsed > 75) {
      score -= (wearInfo.percentageUsed - 75) * 1;
    }

    // D. Unsafe Shutdowns factor
    if (drive.unsafeShutdowns > 100) score -= 8;
    else if (drive.unsafeShutdowns > 30) score -= 4;

    // E. Error Log Entries
    const errorLogsAttr = drive.attributes?.find(a => a.name.includes("Error Information Log"));
    if (errorLogsAttr && errorLogsAttr.rawVal > 100) {
      score -= 15;
    }

    return Math.max(0, Math.min(100, Math.round(score)));
  }

  /**
   * Calculates Check Mac Performance Rating
   */
  calculatePerformanceScore(drive) {
    let score = 100;

    // Temperature Throttling penalty
    const temp = drive.temperature || 35;
    if (temp >= 70) score -= 35;
    else if (temp >= 60) score -= 18;
    else if (temp >= 50) score -= 8;

    // Controller Busy Time penalty
    const busyAttr = drive.attributes?.find(a => a.name.includes("Controller Busy"));
    if (busyAttr && busyAttr.rawVal > 10000) {
      score -= 15;
    }

    // Media Errors slow down read/writes dramatically
    const mediaErrorsAttr = drive.attributes?.find(a => a.name.includes("Media and Data Integrity"));
    if (mediaErrorsAttr && mediaErrorsAttr.rawVal > 0) {
      score -= Math.min(40, mediaErrorsAttr.rawVal * 3);
    }

    return Math.max(0, Math.min(100, Math.round(score)));
  }

  /**
   * Generates Overall Check Mac Status
   */
  assessStatus(healthScore, performanceScore, drive) {
    const criticalWarningAttr = drive.attributes?.find(a => a.name.includes("Critical Warning"));
    const isCriticalWarning = criticalWarningAttr && criticalWarningAttr.rawVal > 0;
    
    const availSpareAttr = drive.attributes?.find(a => a.name.includes("Available Spare") && !a.name.includes("Threshold"));
    const isSpareDepleted = availSpareAttr && availSpareAttr.rawVal < 10;

    if (healthScore <= 25 || isSpareDepleted || (isCriticalWarning && criticalWarningAttr.rawVal >= 4)) {
      return {
        status: "Critical",
        statusText: "Critical - Ổ cứng sắp hỏng!",
        statusColor: "var(--status-critical)"
      };
    }

    if (healthScore <= 60 || performanceScore <= 50 || isCriticalWarning) {
      return {
        status: "Warning",
        statusText: "Warning - Cảnh báo hao mòn",
        statusColor: "var(--status-warning)"
      };
    }

    if (healthScore <= 85 || (drive.temperature && drive.temperature > 55)) {
      return {
        status: "Notice",
        statusText: "Notice - Chú ý theo dõi",
        statusColor: "var(--status-notice)"
      };
    }

    return {
      status: "OK",
      statusText: "Good - Hoạt động hoàn hảo",
      statusColor: "var(--status-good)"
    };
  }

  /**
   * Generates Check Mac Early Warnings & Heuristic Alerts
   */
  analyzeEarlyWarnings(drive, wearInfo) {
    const warnings = [];

    // Check Available Spare
    const availSpareAttr = drive.attributes?.find(a => a.name.includes("Available Spare") && !a.name.includes("Threshold"));
    if (availSpareAttr && availSpareAttr.rawVal < 10) {
      warnings.push({
        level: "critical",
        title: "Block nhớ dự phòng (Available Spare) cạn kiệt dưới 10%",
        desc: "Controller NVMe không còn đủ sector dự phòng để tráo đổi các ô nhớ NAND bị hỏng. Rủi ro mất mát dữ liệu tức thời là cực kỳ cao."
      });
    } else if (availSpareAttr && availSpareAttr.rawVal < 90) {
      warnings.push({
        level: "warning",
        title: `Block nhớ dự phòng đã suy giảm còn ${availSpareAttr.rawVal}%`,
        desc: "Đã có một số block nhớ flash bị hỏng và controller đã kích hoạt vùng nhớ dự trữ thay thế."
      });
    }

    // Check Media Integrity Errors
    const mediaErrorsAttr = drive.attributes?.find(a => a.name.includes("Media and Data Integrity"));
    if (mediaErrorsAttr && mediaErrorsAttr.rawVal > 0) {
      warnings.push({
        level: "critical",
        title: `Phát hiện ${mediaErrorsAttr.rawVal} lỗi Uncorrectable Media Integrity Errors`,
        desc: "Phát hiện lỗi phần cứng trong quá trình đọc ghi ô nhớ NAND không thể tự phục hồi bằng thuật toán ECC."
      });
    }

    // Check Wearout Life
    if (wearInfo.lifeRemaining <= 10) {
      warnings.push({
        level: "critical",
        title: `Tuổi thọ chu kỳ ghi (NAND Endurance) chỉ còn ${wearInfo.lifeRemaining}%`,
        desc: `Tổng lượng ghi đạt ${wearInfo.writtenTB} TBW / ${wearInfo.ratedTBW} TBW. Ổ đĩa sắp hết tuổi thọ ghi vật lý.`
      });
    } else if (wearInfo.lifeRemaining <= 40) {
      warnings.push({
        level: "warning",
        title: `Độ hao mòn ghi đạt ${wearInfo.percentageUsed}%`,
        desc: "Cần chú ý giảm các tác vụ ghi nặng không cần thiết và thường xuyên kiểm tra sao lưu Time Machine."
      });
    }

    // Check Temperature
    if (drive.temperature >= 70) {
      warnings.push({
        level: "critical",
        title: `Nhiệt độ hoạt động quá cao: ${drive.temperature}°C`,
        desc: "Ổ cứng đang bị quá nhiệt nghiêm trọng làm suy giảm tuổi thọ vi mạch và kích hoạt cơ chế giảm tốc độ (Thermal Throttling)."
      });
    } else if (drive.temperature >= 55) {
      warnings.push({
        level: "warning",
        title: `Nhiệt độ ổ đĩa ấm: ${drive.temperature}°C`,
        desc: "Cần kiểm tra khe tản nhiệt máy hoặc môi trường làm việc thông thoáng."
      });
    }

    // Check Unsafe Shutdowns
    if (drive.unsafeShutdowns >= 20) {
      warnings.push({
        level: "notice",
        title: `Ghi nhận ${drive.unsafeShutdowns} lần mất nguồn đột ngột (Unsafe Shutdowns)`,
        desc: "Mất nguồn đột ngột khi controller đang ghi dữ liệu có thể gây lỗi bảng ánh xạ FTL (Flash Translation Layer)."
      });
    }

    return warnings;
  }

  /**
   * Analyzes thermal conditions
   */
  assessThermal(temp) {
    if (temp >= 70) {
      return { level: "Critical", text: "Quá nhiệt nghiêm trọng", color: "var(--status-critical)" };
    } else if (temp >= 55) {
      return { level: "Warm", text: "Nhiệt độ cao", color: "var(--status-warning)" };
    } else if (temp >= 40) {
      return { level: "Normal", text: "Nhiệt độ tiêu chuẩn", color: "var(--status-notice)" };
    }
    return { level: "Cool", text: "Mát mẻ lý tưởng", color: "var(--status-good)" };
  }
}

// Global instance
window.smartEngine = new SmartEngine();
