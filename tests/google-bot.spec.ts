import { FriendOneBot } from "./BaseFormBot.spec";
import { test } from "@playwright/test";

test("Run Form Bot - Friend 1", async ({ browser }) => {
  test.setTimeout(3000000);

  const bot1 = new FriendOneBot(
    "ฟอร์มประเมิน",
    "https://docs.google.com/forms/d/e/1FAIpQLScltYFaREmuaN_sPM5zLfh7CF_17qyf1bRhnu4uDGmc0V5Zvg/viewform", // ลิงก์หน้าตอบฟอร์มปกติ
    "https://docs.google.com/forms/d/1gknIgxv6QudF3onk40hw6tN4WojboC3N06tWpswld4Q/viewanalytics", // ลิ้งก์หน้าแดชบอร์ด
  );
  await bot1.startEngine(browser, 300);
});
