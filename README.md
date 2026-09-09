# IELTS 02 — Gulora Muzaffarova

02 saytning sariq rangli kodli nusxasi.

## Tayyor qismlar

- 347 px kenglikdagi dizayn telefon va kompyuterda markazda qoladi.
- Mahalliy PNG rasmlar, alohida tahrirlanadigan matn va tugmalar.
- Har ochilganda 50 soniyadan boshlanib, 00:00 da to‘xtaydigan taymer.
- Ikkala tugma ham ism va telefon formasini ochadi. Taymer tugmalarga ta’sir qilmaydi.
- Forma server tasdig‘idan keyingina thank-you.html sahifasiga o‘tadi.
- Thank you sahifasida Telegram tugmasi bor.

## Yakunlanmagan ulanishlar

1. `dist/config.js` ichidagi `telegramUrl` ga haqiqiy kanal havolasi kiritilishi kerak.
2. Google Sheets manzili tanlangan. `google-sheets/Code.gs` aynan shu jadvalga moslangan; `google-sheets/ULASH.md` ulash tartibini tushuntiradi.
3. Google hisobida Apps Script’ni deploy qilish va Vercel’da `LEAD_WEBHOOK_URL` hamda `LEAD_WEBHOOK_TOKEN` ni kiritish qolgan. Hozir arizalar hali jadvalga tushmaydi.
4. Server Apps Script javobida `ok: true` bo‘lsagina muvaffaqiyat qaytaradi. Bir arizani takror yuborish bir xil Ariza ID bilan ikkinchi satr yaratmaydi.

## Ko‘rish

`dist/index.html` va `dist/thank-you.html` fayllarini brauzerda ochib dizaynni ko‘rish mumkin. API mahalliy HTML faylini ochish bilan ishlamaydi.

## Vercel

Arxivni oching. `vercel.json`, `package.json`, `api` va `dist` birgalikda GitHub reposining asosiy papkasida bo‘lsin. Vercel’da shu reponi import qiling. Framework: Other; Output Directory: dist; build buyrug‘i talab qilinmaydi. `vercel.json` chiqish papkasini belgilaydi.

Rasmiy hujjatlar: https://vercel.com/docs/project-configuration va https://vercel.com/docs/functions/runtimes/node-js

Ommaga tarqatishdan oldin haqiqiy Telegram havolasi va ma’lumot qabul qiluvchi xizmatni ulang; sinov arizasi saqlangani va undan keyin Thank you ochilganini tekshiring.

## Matn tahrirlari

“2000+ o‘quvchilar” → “2000+ o‘quvchi”; takrorlangan “uchun” olib tashlandi; Speaking bandining tugallanmagan “hamda” qismi to‘liq gapga almashtirildi.
