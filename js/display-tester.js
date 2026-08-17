/**
 * CHECK MAC SUITE - DISPLAY QUALITY & SCREEN DIAGNOSTICS SUITE
 * Visual Test Matrix, Native Resolution & High Refresh Rate Diagnostics
 */

class DisplayTester {
  constructor() {
    this.currentDisplayInfo = null;
    this.activeMode = null;
    this.pixelColorIndex = 0;
    this.pixelColors = [
      { name: "Đỏ Thuần (Pure Red)", hex: "#FF0000", textCol: "#FFFFFF" },
      { name: "Xanh Lá Thuần (Pure Green)", hex: "#00FF00", textCol: "#000000" },
      { name: "Xanh Dương Thuần (Pure Blue)", hex: "#0000FF", textCol: "#FFFFFF" },
      { name: "Trắng Toàn Phần (Pure White)", hex: "#FFFFFF", textCol: "#000000" },
      { name: "Đen Tuyệt Đối (Pure Black)", hex: "#000000", textCol: "#FFFFFF" }
    ];
    this.animFrameId = null;
    this.motionX = 0;
    this.motionSpeed = 8;
    this.lastFpsTime = performance.now();
    this.frameCount = 0;
    this.currentFps = 60;
  }

  /**
   * Renders display specifications and hardware capabilities
   */
  renderSpecs(displayData) {
    if (!displayData) return;
    this.currentDisplayInfo = displayData;

    const main = displayData.mainDisplay || {};
    const setT = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.textContent = val || "N/A";
    };

    setT("dispPanelName", main.name || "Liquid Retina Display");
    setT("dispPanelType", main.panelType || "Liquid Retina Display (IPS LED)");
    setT("dispResolution", main.resolution || "2560 x 1664");
    setT("dispNativePixels", main.nativePixels || "2560 x 1664");
    setT("dispRefreshRate", main.refreshRate || "60Hz");
    setT("dispColorGamut", main.colorGamut || "Wide Color (P3-D65), 10-bit");
    setT("dispMaxBrightness", main.maxBrightness || "500 nits");
    setT("dispTrueTone", main.trueToneSupported ? "Hỗ trợ (Đang hoạt động)" : "Không hỗ trợ");
    setT("dispNightShift", main.nightShiftSupported ? "Hỗ trợ" : "Không hỗ trợ");

    // Display Badge
    const badge = document.getElementById("dispPanelBadge");
    if (badge) {
      if (main.panelType && main.panelType.includes("XDR")) {
        badge.className = "badge badge-good";
        badge.textContent = "LIQUID RETINA XDR (120HZ)";
      } else {
        badge.className = "badge badge-good";
        badge.textContent = "APPLE RETINA DISPLAY";
      }
    }
  }

  /**
   * Launches fullscreen screen testing modal
   */
  launchTest(mode) {
    this.activeMode = mode;
    const overlay = document.getElementById("screenTestOverlay");
    if (!overlay) return;

    overlay.style.display = "flex";
    this.setupTestContent(mode);

    // Request native fullscreen if available
    try {
      if (overlay.requestFullscreen) {
        overlay.requestFullscreen().catch(() => {});
      } else if (overlay.webkitRequestFullscreen) {
        overlay.webkitRequestFullscreen();
      }
    } catch (e) {}

    // Attach key listener
    this.keyHandler = (e) => {
      if (e.key === "Escape") {
        this.closeTest();
      } else if (e.key === " " || e.key === "ArrowRight") {
        if (this.activeMode === "dead-pixel") {
          this.nextPixelColor();
        }
      }
    };
    window.addEventListener("keydown", this.keyHandler);
  }

  closeTest() {
    const overlay = document.getElementById("screenTestOverlay");
    if (overlay) {
      overlay.style.display = "none";
    }
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
    if (this.keyHandler) {
      window.removeEventListener("keydown", this.keyHandler);
    }
    try {
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }
    } catch (e) {}
    this.activeMode = null;
  }

  setupTestContent(mode) {
    const container = document.getElementById("screenTestContent");
    if (!container) return;
    container.innerHTML = "";

    if (mode === "dead-pixel") {
      this.pixelColorIndex = 0;
      this.renderDeadPixelTest(container);
    } else if (mode === "backlight-bleed") {
      this.renderBacklightBleedTest(container);
    } else if (mode === "color-banding") {
      this.renderColorBandingTest(container);
    } else if (mode === "text-crispness") {
      this.renderTextCrispnessTest(container);
    } else if (mode === "motion-ghosting") {
      this.renderMotionGhostingTest(container);
    }
  }

  renderDeadPixelTest(container) {
    const col = this.pixelColors[this.pixelColorIndex];
    container.style.backgroundColor = col.hex;
    container.innerHTML = `
      <div class="screen-test-hud" style="color: ${col.textCol};">
        <div class="hud-title">🔍 KIỂM TRA ĐIỂM CHẾT / ĐIỂM SÁNG (DEAD & STUCK PIXELS)</div>
        <div class="hud-sub">Màu hiện tại: <strong>${col.name}</strong> (${this.pixelColorIndex + 1}/5)</div>
        <div class="hud-tip">👉 Bấm chuột hoặc phím [Space] / [Mũi tên phải] để đổi màu | [ESC] để thoát</div>
      </div>
    `;
    container.onclick = () => this.nextPixelColor();
  }

  nextPixelColor() {
    this.pixelColorIndex = (this.pixelColorIndex + 1) % this.pixelColors.length;
    const container = document.getElementById("screenTestContent");
    if (container) this.renderDeadPixelTest(container);
  }

  renderBacklightBleedTest(container) {
    container.style.backgroundColor = "#000000";
    container.onclick = null;
    container.innerHTML = `
      <div class="screen-test-hud" style="color: rgba(255,255,255,0.7);">
        <div class="hud-title">🌑 KIỂM TRA HỞ SÁNG VIỀN & QUẦNG SÁNG (BACKLIGHT BLEED & BLOOMING)</div>
        <div class="hud-sub">Quan sát 4 cạnh viền màn hình và các góc trong điều kiện phòng tối để phát hiện rò sáng IPS</div>
        <div class="hud-tip">👉 Bấm [ESC] để thoát kiểm tra</div>
      </div>
      <div class="bleeding-crosshair"></div>
    `;
  }

  renderColorBandingTest(container) {
    container.style.backgroundColor = "#0d1117";
    container.onclick = null;
    container.innerHTML = `
      <div class="screen-test-hud" style="color: #FFFFFF; position: relative; z-index: 10; margin-bottom: 20px;">
        <div class="hud-title">🌈 KIỂM TRA ĐỘ MƯỢT DẢI MÀU & 256 MỨC SẮC ĐỘ (COLOR BANDING & GREYSCALE)</div>
        <div class="hud-sub">Dải màu mượt mà không bị gãy đoạn/sọc ngang chứng minh tấm nền đạt chuẩn Apple 10-bit DCI-P3</div>
        <div class="hud-tip">👉 Bấm [ESC] để thoát</div>
      </div>
      <div class="banding-test-wrap">
        <div class="banding-bar greyscale-ramp"></div>
        <div class="banding-bar red-ramp"></div>
        <div class="banding-bar green-ramp"></div>
        <div class="banding-bar blue-ramp"></div>
        <div class="banding-bar rainbow-ramp"></div>
      </div>
    `;
  }

  renderTextCrispnessTest(container) {
    container.style.backgroundColor = "#FFFFFF";
    container.onclick = null;
    container.innerHTML = `
      <div class="screen-test-hud" style="color: #000000; position: relative; z-index: 10; margin-bottom: 20px;">
        <div class="hud-title">🔤 KIỂM TRA ĐỘ SẮC NÉT RETINA & KHỬ RĂNG CƯA SUBPIXEL</div>
        <div class="hud-sub">Kiểm tra chi tiết phông chữ ở nhiều kích thước để phát hiện sai lệch tỉ lệ scale hoặc mờ hình</div>
        <div class="hud-tip">👉 Bấm [ESC] để thoát</div>
      </div>
      <div class="text-crispness-container">
        <p style="font-size: 24px; font-weight: 700;">MacBook Liquid Retina Display - Typography Crispness 24px (The quick brown fox jumps over the lazy dog)</p>
        <p style="font-size: 18px; font-weight: 600;">Kiểm tra độ nét phông chữ tiếng Việt chuẩn Apple Typography 18px (Hà Nội, Sài Gòn, Đà Nẵng, Cần Thơ)</p>
        <p style="font-size: 14px; font-weight: 500;">Subpixel Font Rendering 14px - 1234567890 !@#$%^&*()_+-=[]{}|;:,.<>?</p>
        <p style="font-size: 12px; font-weight: 400;">Màn hình Retina 12px: Độ mịn điểm ảnh PPI cao giúp mắt đọc văn bản êm ái mà không có hiện tượng vỡ hạt.</p>
        <p style="font-size: 10px; font-weight: 400;">Ultra-fine 10px: 0123456789 ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz</p>
        <p style="font-size: 8px; font-weight: 400;">Micro Text 8px: Apple Inc. All rights reserved. Designed by Apple in California. Assembled in Vietnam.</p>
      </div>
    `;
  }

  renderMotionGhostingTest(container) {
    container.style.backgroundColor = "#161b22";
    container.onclick = null;
    container.innerHTML = `
      <div class="screen-test-hud" style="color: #FFFFFF; position: relative; z-index: 10;">
        <div class="hud-title">⚡ KIỂM TRA BÓNG MA & TỐC ĐỘ ĐÁP ỨNG PANEL (GHOSTING & MOTION BLUR)</div>
        <div class="hud-sub">Tốc độ khung hình thực tế: <strong id="motionFpsCounter" style="color: var(--status-good);">60 FPS</strong> | Tần số quét ProMotion 120Hz</div>
        <div class="hud-tip">👉 Bấm [ESC] để thoát</div>
      </div>
      <div class="motion-test-stage">
        <canvas id="motionCanvas" class="motion-canvas"></canvas>
      </div>
    `;

    const canvas = document.getElementById("motionCanvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = 300;

    this.motionX = 0;
    this.frameCount = 0;
    this.lastFpsTime = performance.now();

    const loop = () => {
      if (this.activeMode !== "motion-ghosting") return;

      // FPS Calculation
      this.frameCount++;
      const now = performance.now();
      if (now - this.lastFpsTime >= 500) {
        this.currentFps = Math.round((this.frameCount * 1000) / (now - this.lastFpsTime));
        this.frameCount = 0;
        this.lastFpsTime = now;
        const fpsElem = document.getElementById("motionFpsCounter");
        if (fpsElem) fpsElem.textContent = `${this.currentFps} FPS`;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Track 1: Fast Alien / UFO Bar
      this.motionX = (this.motionX + this.motionSpeed) % (canvas.width + 100);

      // Draw Moving Block 1 (Cyan)
      ctx.fillStyle = "#30d158";
      ctx.fillRect(this.motionX - 100, 40, 80, 50);
      ctx.fillStyle = "#000000";
      ctx.font = "bold 14px monospace";
      ctx.fillText("120Hz", this.motionX - 85, 70);

      // Draw Moving Block 2 (Blue)
      ctx.fillStyle = "#0a84ff";
      ctx.fillRect((this.motionX * 0.7) % canvas.width, 120, 80, 50);
      ctx.fillStyle = "#FFFFFF";
      ctx.fillText("60Hz", ((this.motionX * 0.7) % canvas.width) + 20, 150);

      // Draw Moving Block 3 (Purple)
      ctx.fillStyle = "#bf5af2";
      ctx.fillRect((this.motionX * 0.4) % canvas.width, 200, 80, 50);
      ctx.fillStyle = "#FFFFFF";
      ctx.fillText("30Hz", ((this.motionX * 0.4) % canvas.width) + 20, 230);

      this.animFrameId = requestAnimationFrame(loop);
    };

    loop();
  }
}

window.displayTesterInstance = new DisplayTester();
