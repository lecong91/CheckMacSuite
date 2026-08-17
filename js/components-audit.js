/**
 * CHECK MAC SUITE PRO - GENUINE PARTS & SERVICE HISTORY AUDIT
 * Apple-Certified Component Verification Engine
 */

class ComponentsAuditController {
  constructor() {
    this.currentAuditData = null;
  }

  /**
   * Renders the complete hardware component audit view
   * @param {Object} auditData 
   */
  render(auditData) {
    if (!auditData) return;
    this.currentAuditData = auditData;

    // 1. Update Overall Verdict Banner
    const verdictBanner = document.getElementById("auditVerdictBanner");
    const verdictTitle = document.getElementById("auditVerdictTitle");
    const verdictDesc = document.getElementById("auditVerdictDesc");
    const verdictBadge = document.getElementById("auditVerdictBadge");
    const auditTimeElem = document.getElementById("auditTimestamp");

    if (verdictTitle) verdictTitle.textContent = auditData.overallVerdict;
    if (auditTimeElem) auditTimeElem.textContent = auditData.auditTimestamp || new Date().toLocaleString("vi-VN");

    if (verdictBanner) {
      if (auditData.replacedCount > 0) {
        verdictBanner.className = "audit-banner banner-replaced";
        if (verdictBadge) {
          verdictBadge.className = "badge badge-critical";
          verdictBadge.textContent = "ĐÃ QUA SỬA CHỮA / THAY THẾ";
        }
        if (verdictDesc) verdictDesc.textContent = `Phát hiện ${auditData.replacedCount} cụm linh kiện đã được thay thế hoặc sửa chữa trong quá trình sử dụng.`;
      } else if (auditData.suspiciousCount > 0) {
        verdictBanner.className = "audit-banner banner-warning";
        if (verdictBadge) {
          verdictBadge.className = "badge badge-warning";
          verdictBadge.textContent = "NGHI VẤN CAN THIỆP";
        }
        if (verdictDesc) verdictDesc.textContent = "Phát hiện thông số phần cứng hoặc vi mạch có dấu hiệu bất thường cần chuyên gia mở máy kiểm tra.";
      } else {
        verdictBanner.className = "audit-banner banner-genuine";
        if (verdictBadge) {
          verdictBadge.className = "badge badge-good";
          verdictBadge.textContent = "100% ZIN NGUYÊN BẢN (ALL APPLE ORIGINAL)";
        }
        if (verdictDesc) verdictDesc.textContent = "Tất cả các cụm linh kiện cốt lõi (Mainboard, SoC, Pin, Màn hình, SSD, Camera, Audio, Touch ID) đều đồng nhất 100% nguyên bản chuẩn Apple xuất xưởng.";
      }
    }

    // 2. Render Component Cards Grid
    const container = document.getElementById("componentsAuditGrid");
    if (!container) return;
    container.innerHTML = "";

    const components = auditData.components || [];
    components.forEach(comp => {
      const card = document.createElement("div");
      card.className = "component-audit-card";

      let statusBadgeClass = "badge-good";
      let statusIcon = "✅";
      let borderColor = "var(--status-good)";

      if (comp.status === "REPLACED_THIRD_PARTY" || comp.status === "REPLACED" || comp.status === "REPLACED_OR_TAMPERED") {
        statusBadgeClass = "badge-critical";
        statusIcon = "🚨";
        borderColor = "var(--status-critical)";
      } else if (comp.status === "TAMPERED_FRAUD" || comp.status === "HARDWARE_ERROR") {
        statusBadgeClass = "badge-critical";
        statusIcon = "🚨";
        borderColor = "var(--status-critical)";
      } else if (comp.status === "REPLACED_GENUINE_APPLE") {
        statusBadgeClass = "badge-warning";
        statusIcon = "🔄";
        borderColor = "var(--status-warning)";
      } else if (comp.status === "DEGRADED" || comp.status === "SUSPICIOUS") {
        statusBadgeClass = "badge-warning";
        statusIcon = "⚠️";
        borderColor = "var(--status-warning)";
      } else if (comp.status === "EXTERNAL_CONNECTED") {
        statusBadgeClass = "badge-notice";
        statusIcon = "🔌";
        borderColor = "var(--accent-blue)";
      } else if (comp.status === "DESKTOP_NA") {
        statusBadgeClass = "badge-notice";
        statusIcon = "🖥️";
        borderColor = "var(--border-subtle)";
      }

      card.style.borderLeft = `4px solid ${borderColor}`;
      card.innerHTML = `
        <div class="comp-card-header">
          <div class="comp-header-left">
            <span class="comp-icon">${statusIcon}</span>
            <div>
              <h4 class="comp-name">${comp.name}</h4>
              <div class="comp-part-type">${comp.part}</div>
            </div>
          </div>
          <span class="badge ${statusBadgeClass}">${comp.statusText}</span>
        </div>
        <div class="comp-body">
          <div class="comp-detail-row">
            <span class="comp-label">Serial / Định danh:</span>
            <span class="comp-serial font-mono">${comp.serial || "N/A"}</span>
          </div>
          <div class="comp-detail-row">
            <span class="comp-label">Thông số giám định:</span>
            <span class="comp-spec">${comp.details || "Chuẩn Apple"}</span>
          </div>
        </div>
      `;
      container.appendChild(card);
    });
  }
}

window.componentsAuditController = new ComponentsAuditController();
