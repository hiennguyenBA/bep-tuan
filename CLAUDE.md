# Chip Kitchen (Bếp Tuần)

Static PWA, không build step: `index.html` (toàn bộ UI + logic JS inline),
`service-worker.js` (cache app shell), `manifest.json`. Deploy qua GitHub
Pages tự động khi push lên `main` (xem tab Actions → "pages-build-deployment").
Dữ liệu đồng bộ nhiều thiết bị qua Firestore (`households/shared` doc +
`households/shared/recipes` subcollection).

## Checklist bắt buộc trước khi báo "cập nhật xong"

Một thay đổi chỉ tính là "xong" khi người dùng mở app lên là thấy ngay,
không phải khi code đã đúng trên GitHub. Làm đủ các bước sau:

1. **Đổi `index.html`, `manifest.json`, hoặc `icon.svg`?** → Bắt buộc bump
   `CACHE_NAME` trong `service-worker.js` (vd `chip-kitchen-v31` → `v32`).
   Quên bước này thì service worker vẫn phát bản cache cũ dù server đã có
   bản mới — đây là lỗi đã xảy ra thật, đừng lặp lại.

2. **Thêm/đổi field nào có versioned migration trong `normalizeState()`
   (các biến `..._VERSION` + block `if(!parsed.xxxVersion || ...)`)?**
   → Logic đó PHẢI chạy ở cả hai nơi dữ liệu có thể vào state:
   - `normalizeState()` — khi load từ localStorage.
   - `applyRemoteMeta()` — khi nhận dữ liệu từ Firestore (`onSnapshot`).

   Hai đường này độc lập nhau. `applyRemoteMeta` copy thẳng field từ cloud
   vào `state` mà KHÔNG tự chạy qua `normalizeState`. Nếu chỉ sửa migration
   ở `normalizeState`, cloud (nếu còn giữ dữ liệu cũ) sẽ ghi đè state mới
   ngay sau khi trang tải xong — hiện đúng vài giây rồi tụt về bản cũ. Cách
   làm đúng: viết migration thành 1 hàm dùng chung (xem mẫu
   `migrateHouseholdPack()`), gọi ở cả hai chỗ, và nếu `applyRemoteMeta`
   phát hiện phải migrate thì tự đẩy state đã sửa lên lại cloud
   (`window.ChipKitchenSync.push()`, qua `setTimeout` vì lúc đó
   `applyingRemote` đang `true`) để cloud hết giữ bản cũ.

3. **Push lên `main` xong** → không dừng ở đó. Xác nhận GitHub Actions
   ("pages-build-deployment") chạy xong và Success trước khi báo hoàn tất.

4. **Test bằng tab ẩn danh** vào URL Pages thật để thấy đúng những gì
   server trả về (không dính service worker/cache cũ của chính mình khi
   dev). Nếu nghi ngờ vấn đề đồng bộ cloud, thử tải lại 2-3 lần liên tiếp
   xem có bị tụt về bản cũ không (chính là triệu chứng của lỗi #2).

Chỉ báo "xong" với người dùng sau khi cả 4 bước trên đều ổn.
