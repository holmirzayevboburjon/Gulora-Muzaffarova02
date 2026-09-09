# Google Sheets’ga ulash

Kod aynan berilgan 1NrhRas-PERK_9JW5K59ay0xW_01qb04GnU-cB-47Y9U jadvaliga mo‘ljallangan. Jadval hali o‘zgartirilmagan, ulanish hali ishga tushirilmagan.

1. Jadvalda **Extensions / Расширения → Apps Script** ni oching. Mavjud kod bo‘lsa uni o‘chirmang; alohida yangi Apps Script loyihasida shu kodni ishlating.
2. Yangi loyiha uchun `Code.gs` mazmunini ko‘chiring. Saqlang. Yuqoridagi funksiyalar ro‘yxatidan `setup` ni tanlab **Run / Выполнить** ni bosing. O‘z Google hisobingiz bilan kodning jadvalga yozish ruxsatini tasdiqlang.
3. `setup` berilgan jadvalda **IELTS arizalar** nomli varaq yaratadi. Sana (Toshkent), Ism, Telefon, Sayt va Ariza ID ustunlarini qo‘shadi. Boshqa varaqlarga tegmaydi. Pastdagi Execution log’da `LEAD_WEBHOOK_TOKEN` ko‘rinadi; qiymatini faqat Vercel sozlamalariga saqlang.
4. **Deploy → New deployment → Web app**: **Execute as: Me**, **Who has access: Anyone**. So‘ng **Deploy**. Olingan `/exec` bilan tugaydigan URL kerak; `/dev` havolasini ishlatmang. Agar hisobingiz siyosati Anyone variantini bermasa, shu yerda to‘xtab xabar bering.
5. Vercel loyihasida **Settings → Environment Variables** ga `LEAD_WEBHOOK_URL` (olingan `/exec` URL) va `LEAD_WEBHOOK_TOKEN` (setup log’idagi qiymat) kiriting. Production va kerak bo‘lsa Preview uchun belgilang. Saytni qayta deploy qiling. Tokenni `dist/config.js` yoki GitHub’ga yozmang.
6. Saytda sinov ism va telefon yuboring. Jadvalda bitta satr paydo bo‘lishi, so‘ng Thank you ochilishi kerak. Xatolikda Thank you ochilmasligi kerak. Telegram uchun `dist/config.js` dagi `telegramUrl` ham to‘ldiriladi.

Apps Script kodi keyin tahrirlansa, Deploy → Manage deployments orqali yangi versiyani faol deployment’ga qo‘llang.

Rasmiy qo‘llanma: https://developers.google.com/apps-script/guides/web
