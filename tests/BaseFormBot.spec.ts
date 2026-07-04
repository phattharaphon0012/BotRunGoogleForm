import { test, Page, BrowserContext, Browser } from "@playwright/test";

export const rnd = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1) + min);
export const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

const userAgents = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:123.0) Gecko/20100101 Firefox/123.0",
];

export class BaseFormBot {
  protected formUrl: string;
  protected dashboardUrl: string;
  protected botName: string;
  protected page!: Page;
  protected context!: BrowserContext;

  constructor(botName: string, formUrl: string, dashboardUrl: string) {
    this.botName = botName;
    this.formUrl = formUrl;
    this.dashboardUrl = dashboardUrl;
  }

  async getDashboardResponse(browser: any): Promise<number> {
    const tempContext = await browser.newContext();
    const tempPage = await tempContext.newPage();

    try {
      console.log(
        `[${this.botName}] กำลังเข้าไปอ่านค่าจริงจาก dashboard google form....`,
      );

      await tempPage.goto(this.dashboardUrl, {
        waitUntil: "networkidle",
        timeout: 20000,
      });
      await tempPage.waitForTimeout(2000);

      const responseCountLocator = tempPage
        .getByText(/การตอบกลับ|คำตอบ|responses/i)
        .first();

      if (await responseCountLocator.isVisible()) {
        const fullText = await responseCountLocator.innerText();

        console.log(
          `${this.botName} ข้อความที่ตรวจเจอในหน้าเว็บ: "${fullText}"`,
        );

        const match = fullText.match(/\d+/);
        if (match) {
          const totoalCount = parseInt(match[0], 10);
          await tempContext.close();
          console.log(`ยอดทั้งหมดคือ ${totoalCount}`);
          return totoalCount;
        }
      }

      console.log(
        `[${this.botName}] ไม่เจอตัวเลขสรุปคำตอบในหน้าดังกล่าว (ระบบอาจยังไม่ได้ Login สิทธิ์ผู้สร้างฟอร์ม)`,
      );
      await tempContext.close();
      return 0;
    } catch (error) {
      console.log(
        `[${this.botName}] เข้าหน้า Responses ไม่สำเร็จ ข้ามไปเริ่มทำต่อจากยอด 0`,
      );
      await tempContext.close();
      return 0;
    }
  }

  async startEngine(browser: any, targetGoal: number = 300) {
    const currentCount = await this.getDashboardResponse(browser);
    const roundsNeeded = targetGoal - currentCount;

    if (roundsNeeded <= 0) {
      console.log(
        `[${this.botName}] ยอดปัจจุบัน ${currentCount}/${targetGoal} ครบถ้วนแล้ว`,
      );
      return;
    }

    console.log(
      `[${this.botName}] ตรวจพบยอดสรุปในระบบขณะนี้ ${currentCount} รอบ บอทจะลุยต่อให้อีก ${roundsNeeded} รอบ!`,
    );

    for (let i = 0; i <= roundsNeeded; i++) {
      console.log("=============================");
      console.log(`[${this.botName}] กำลังรันรอบที่ ${i}/${roundsNeeded}`);

      const randomUA = userAgents[rnd(0, userAgents.length - 1)];
      this.context = await browser.newContext({ userAgent: randomUA });
      this.page = await this.context.newPage();

      let isConnected = false;
      while (!isConnected) {
        try {
          await this.page.goto(this.formUrl, { timeout: 25000 });
          isConnected = true;
        } catch (error) {
          console.log(
            `[${this.botName}] เข้าลิ้งก์ไม่ได้รอ 10 วินาทีแล้วลองกดเข้าใหม่...`,
          );
          await sleep(10000);
        }
      }

      try {
        await this.fillFormLogic();

        const delay = rnd(3000, 6000);
        await sleep(delay);
      } catch (error) {
        console.log(
          `[${this.botName}] เกิดบั๊กจังหวะกรอกฟอร์มรอบนี้ ปิดแท็บแล้วข้ามไปเริ่มรอบใหม่ทันที`,
        );
      } finally {
        await this.context.close();
      }
    }

    console.log(
      `[${this.botName}] successfully! ดันยอดจนครบ ${targetGoal} สำเร็จ!`,
    );
  }

  protected async fillFormLogic(): Promise<void> {}
}

export class FriendOneBot extends BaseFormBot {
  protected async fillFormLogic(): Promise<void> {
    // ท่าล็อก 1: รอให้ปุ่มแรกปรากฏตัวเห็นชัดๆ บนจอก่อน ค่อยเริ่มกด
    const firstRadio = this.page.getByRole("radio").first();
    await firstRadio.waitFor({ state: "visible", timeout: 10000 });

    const page1Radios = await this.page.getByRole("radio").all();
    console.log(`จำนวน radio ทีเจอ จำนวน ${page1Radios.length} ปุ่ม`);

    const genders = ["ชาย", "หญิง"];
    await this.page.getByRole("radio", { name: genders[rnd(0, 1)] }).click();

    const status = [
      "ครู/บุคลากร",
      "นักเรียน/นักศึกษา",
      "นักเรียน/นักศึกษา",
      "นักเรียน/นักศึกษา",
    ];
    await this.page
      .getByRole("radio", { name: status[rnd(0, status.length - 1)] })
      .click();

    // กดปุ่ม "ถัดไป"
    const nextButton1 = this.page.getByRole("button", { name: /ถัดไป|Next/ });
    await nextButton1.click();

    // ---------------- [ หน้าที่ 2: ตารางประเมิน 1-5 ] ----------------
    // รอให้หัวข้อตารางแรกโผล่ขึ้นมาก่อน
    const firstRow = this.page.locator('div[role="radiogroup"]').first();
    await firstRow.waitFor({ state: "visible", timeout: 10000 });

    // รอให้โหลดครบ 18 ข้อก่อน
    let totalRows = 0;

    for (let retry = 0; retry < 10; retry++) {
      totalRows = await this.page.locator('div[role="radiogroup"]').count();

      console.log(`โหลดได้ ${totalRows}/18 ข้อ`);

      if (totalRows >= 18) {
        break;
      }

      await this.page.waitForTimeout(1000);
    }

    const rows = await this.page.locator('div[role="radiogroup"]').all();

    console.log(
      `หน้า 2: พบหัวข้อประเมินทั้งหมด ${rows.length} ข้อย่อย กำลังไล่ติ๊กคะแนน...`,
    );

    for (const row of rows) {
      // เลื่อนให้ข้อนั้นอยู่บนจอก่อน
      await row.scrollIntoViewIfNeeded();

      const radioButtons = await row.locator('div[role="radio"]').all();

      if (radioButtons.length > 0) {
        const scoreIndexPool = [0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 3, 4];
        const selectedIndex = scoreIndexPool[rnd(0, scoreIndexPool.length - 1)];

        if (radioButtons[selectedIndex]) {
          await radioButtons[selectedIndex].click();

          // กัน Google Forms เอ๋อเวลาไล่คลิกเร็วเกิน
          await this.page.waitForTimeout(100);
        }
      }
    }

    // กดปุ่ม "ถัดไป" เข้าสู่หน้าสุดท้าย
    const nextButton2 = this.page.getByRole("button", { name: /ถัดไป|Next/ });
    await nextButton2.click();

    // ---------------- [ หน้าที่ 3: ความคิดเห็นเพิ่มเติม ] ----------------
    const textBox = this.page.getByRole("textbox");
    await textBox.waitFor({ state: "visible", timeout: 10000 });

    const comments = [
      "ดีมากครับ",
      "มีประโยชน์ครับ",
      "ไม่มีข้อเสนอแนะเพิ่มเติมครับ",
      "อยากให้มีตัวอย่างเพิ่มขึ้นอีกนิดครับ",
    ];
    await textBox.fill(comments[rnd(0, comments.length - 1)]);

    // กดปุ่ม "ส่ง"
    const submitButton = this.page.getByRole("button", { name: /ส่ง|Submit/ });
    await submitButton.click();
  }
}
