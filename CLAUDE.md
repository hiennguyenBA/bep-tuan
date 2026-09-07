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

   **Riêng cho `state.recipes`**: nó KHÔNG đi qua `applyRemoteMeta` — nó có
   đường đồng bộ cloud riêng (`applyRemoteRecipes`, nghe `recipesCol`
   subcollection), một `onSnapshot` listener hoàn toàn độc lập với
   `applyRemoteMeta`, không đảm bảo thứ tự bắn trước/sau. Đã thử 2 cách gate
   bằng version-flag và cả 2 đều dính race thật (món mới không bao giờ tới
   được người dùng dù code đúng, deploy thành công): lần 1 đặt flag trong
   `META_KEYS` (đi theo đường `applyRemoteMeta`, trong khi mutation lại nằm
   ở `applyRemoteRecipes`); lần 2 thử tách flag ra một sentinel doc riêng
   trong `recipesCol` — vẫn không xác nhận được vì phải phụ thuộc rule bảo
   mật Firestore (không có trong repo này, không kiểm tra được) chấp nhận
   một document mới hình dạng khác hẳn recipe thật.

   Giải pháp cuối cùng: **bỏ hẳn version-flag** cho `topUpMissingRecipes()` —
   nó chỉ so tên (`seedRecipes()` có tên nào mà `state.recipes` chưa có thì
   thêm), chạy vô điều kiện ở cả `normalizeState` lẫn `applyRemoteRecipes`.
   Vì là phép cộng theo tên, chạy lại bao nhiêu lần cũng an toàn (không thêm
   trùng) và không phụ thuộc thứ tự listener nào cả — hết race triệt để.
   Đánh đổi: nếu người dùng xoá hẳn một món có sẵn (seed), nó sẽ tự thêm lại
   ở lần đồng bộ sau — chấp nhận được cho app hộ gia đình quy mô nhỏ này,
   giống hệt cách `RECIPE_PACK_VERSION` vẫn luôn ghi đè toàn bộ thư viện.
   Bài học chung: khi một cơ chế cần phối hợp qua 2 nguồn đồng bộ độc lập mà
   không có cách nào đọc/ghi chúng atomically cùng nhau, đừng cố dùng
   version-flag — tìm cách làm phép toán đó thành vô điều kiện và idempotent
   (an toàn chạy lại nhiều lần) thay vì gate bằng trạng thái.

3. **Push lên `main` xong** → không dừng ở đó. Xác nhận GitHub Actions
   ("pages-build-deployment") chạy xong và Success trước khi báo hoàn tất.

4. **Test bằng tab ẩn danh** vào URL Pages thật để thấy đúng những gì
   server trả về (không dính service worker/cache cũ của chính mình khi
   dev). Nếu nghi ngờ vấn đề đồng bộ cloud, thử tải lại 2-3 lần liên tiếp
   xem có bị tụt về bản cũ không (chính là triệu chứng của lỗi #2).

Chỉ báo "xong" với người dùng sau khi cả 4 bước trên đều ổn.
