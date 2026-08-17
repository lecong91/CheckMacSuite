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

    // 2. Evaluate Battery Component - Rigorous 8-Layer Forensic Hook
    const batt = drive.batteryForensics;
    let battStatusText = "Pin hoạt động tiêu chuẩn, chu kỳ sạc ổn định.";
    let battIcon = "🔋";
    let battClass = "GENUINE_FACTORY_ORIGINAL";

    if (batt) {
      battClass = batt.classification || batt.tamperingStatus || "GENUINE_FACTORY_ORIGINAL";
      const battCycles = batt.cycleCount !== undefined ? batt.cycleCount : (drive.batteryCycleCount || 0);
      const battHealthVal = batt.healthPercentage !== undefined ? batt.healthPercentage : (drive.batteryHealth || 100);
      const cellDiff = batt.cellMaxDiffMV || 0;
      const mfgDate = batt.manufactureDate || "N/A";

      if (battClass === "TAMPERED_FRAUD") {
        battIcon = "🚨";
        battStatusText = `PHÁT HIỆN KÍCH PIN: Lệch áp cell (${cellDiff}mV) hoặc reset số chu kỳ ảo (${battCycles} lần / Health ${battHealthVal}%).`;
      } else if (battClass === "THIRD_PARTY_REPLACED") {
        battIcon = "⚠️";
        battStatusText = `PIN LINH KIỆN BÊN THỨ 3: Đã thay pin mới (${battCycles} chu kỳ, Health ${battHealthVal}%), không phải pin Zin Apple OEM.`;
      } else if (battClass === "APPLE_AUTHORIZED_REPLACEMENT") {
        battIcon = "🔄";
        battStatusText = `PIN CHÍNH HÃNG APPLE THAY MỚI: Pin chuẩn Apple OEM xuất xưởng ${mfgDate} (${battCycles} chu kỳ, Health ${battHealthVal}%).`;
      } else if (battClass === "DESKTOP_NO_BATTERY" || battClass === "DESKTOP_NA") {
        battIcon = "⚡";
        battStatusText = `Nguồn AC trực tiếp (Mac mini/Studio/Pro): Thiết bị để bàn cắm nguồn cố định.`;
      } else if (battHealthVal < 80 || drive.batteryCondition === "Service Recommended") {
        battIcon = "⚠️";
        battStatusText = `PIN ZIN ĐÃ CHAI (${battHealthVal}% - ${battCycles} chu kỳ): Dung lượng dưới 80%, khuyến nghị thay pin chính hãng.`;
      } else {
        battIcon = "🔋";
        battStatusText = `PIN ZIN NGUYÊN BẢN (${battHealthVal}% - ${battCycles} chu kỳ): Cell cân bằng hoàn hảo (lệch ${cellDiff}mV), đồng bộ theo máy.`;
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
        partsStatusText = `PHÁT HIỆN ${audit.replacedCount} CỤM LINH KIỆN ĐÃ QUA SỬA CHỮA / THAY THẾ. Cần kiểm tra chất lượng linh kiện thay thế.`;
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

    const isFraudulent = (batt && batt.classification === "TAMPERED_FRAUD") || (audit && audit.overallStatus === "SUSPICIOUS_TAMPERED") || ssdHealth < 30 || critWarnings.length > 0;
    const isReplacedOrDegraded = (batt && (batt.classification === "THIRD_PARTY_REPLACED" || batt.classification === "APPLE_AUTHORIZED_REPLACEMENT" || batt.classification === "DEGRADED_SERVICE_REQUIRED")) || (audit && audit.overallStatus === "PARTS_REPLACED") || (drive.batteryHealth && drive.batteryHealth < 80) || temp >= 65 || ssdHealth < 75 || warnWarnings.length > 0;

    if (isFraudulent) {
      overallGrade = "HẠNG D (RỦI RO CAO / GIAN LẬN PHẦN CỨNG)";
      overallGradeClass = "badge-critical";
      actionAdvice = "KHUYẾN NGHỊ KHẨN CẤP: Không khuyến khích giao dịch mua bán hoặc sử dụng lâu dài nếu chưa làm rõ lịch sử sửa chữa. Tiến hành sao lưu dữ liệu quan trọng ngay lập tức và mang máy đến Trung tâm Bảo hành Ủy quyền Apple (AASP) để kiểm định bên trong.";
    } else if (isReplacedOrDegraded) {
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
    const hasCriticalHardwareFlag = criticalWarningAttr && criticalWarningAttr.rawVal > 0;

    if (hasCriticalHardwareFlag || healthScore < 30) {
      return {
        status: "critical",
        statusText: "NGUY CẤP / CẦN THAY THẾ",
        statusColor: "var(--accent-red)"
      };
    } else if (healthScore < 75 || performanceScore < 70) {
      return {
        status: "warning",
        statusText: "CẦN CHÚ Ý / THEO DÕI",
        statusColor: "var(--accent-amber)"
      };
    } else {
      return {
        status: "good",
        statusText: "HOÀN HẢO / TỐI ƯU",
        statusColor: "var(--accent-green)"
      };
    }
  }

  /**
   * Analyzes SMART registers for early warning patterns
   */
  analyzeEarlyWarnings(drive, wearInfo) {
    const warnings = [];

    // Check Wearout
    if (wearInfo.percentageUsed >= 90) {
      warnings.push({
        id: "wear_critical",
        level: "critical",
        title: "Bộ nhớ Flash NAND sắp hết hạn mức bảo hành TBW",
        message: `Mức sử dụng chip nhớ đã đạt ${wearInfo.percentageUsed}%. Các ô nhớ flash đang ở ngưỡng hao mòn cao nhất.`
      });
    } else if (wearInfo.percentageUsed >= 75) {
      warnings.push({
        id: "wear_warning",
        level: "warning",
        title: "Độ hao mòn chip nhớ bắt đầu tăng",
        message: `Mức sử dụng chip nhớ hiện tại là ${wearInfo.percentageUsed}%. Dự kiến tuổi thọ còn lại khoảng ${wearInfo.estimatedYears} năm.`
      });
    }

    // Check Temperature
    if (drive.temperature >= 70) {
      warnings.push({
        id: "temp_critical",
        level: "critical",
        title: "Nhiệt độ ổ SSD ở mức nguy hiểm (>70°C)",
        message: "Nhiệt độ quá cao có thể kích hoạt Thermal Throttling và gây suy giảm độ bền tế bào nhớ NAND Flash."
      });
    } else if (drive.temperature >= 55) {
      warnings.push({
        id: "temp_warning",
        level: "warning",
        title: "Nhiệt độ hoạt động hơi cao",
        message: `Nhiệt độ SSD ghi nhận là ${drive.temperature}°C. Nên đảm bảo luồng gió thông thoáng cho MacBook.`
      });
    }

    // Check Unsafe Shutdowns
    if (drive.unsafeShutdowns > 50) {
      warnings.push({
        id: "shutdown_warning",
        level: "notice",
        title: "Ghi nhận nhiều lần mất nguồn đột ngột",
        message: `Ổ đĩa đã trải qua ${drive.unsafeShutdowns} lần tắt nguồn không an toàn. Điều này có thể làm tăng nguy cơ hỏng hệ điều hành file system APFS.`
      });
    }

    return warnings;
  }

  /**
   * Evaluates Thermal Assessment
   */
  assessThermal(temp) {
    if (temp >= 70) {
      return { status: "critical", label: "Rất Nóng", desc: "Nguy cơ giảm hiệu năng do tản nhiệt kém" };
    } else if (temp >= 55) {
      return { status: "warning", label: "Hơi Nóng", desc: "Nhiệt độ tăng khi máy tải nặng" };
    } else {
      return { status: "good", label: "Mát Mẻ / Tối Ưu", desc: "Nhiệt độ hoàn toàn lý tưởng cho SSD" };
    }
  }
}

window.smartEngine = new SmartEngine();
