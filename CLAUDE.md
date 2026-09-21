# Chip Kitchen (Bếp Tuần)

Static PWA, không build step: `index.html` (toàn bộ UI + logic JS inline),
`service-worker.js` (cache app shell), `manifest.json`. Deploy qua GitHub
Pages tự động khi push lên `main` (xem tab Actions → "pages-build-deployment").
Dữ liệu đồng bộ nhiều thiết bị qua Firestore: `households/shared` doc (meta),
`households/shared/recipes` subcollection (mỗi món 1 document, để ảnh món ăn
có ngân sách 1MB riêng), `households/shared/assets/banner` doc (ảnh banner,
tách riêng cùng lý do — xem lịch sử "chỉ ảnh banner bị mất" trong git log).

**Firestore security rules không nằm trong repo này** (cấu hình trực tiếp ở
Firebase console, session này không xem/sửa được). Mỗi khi thêm một
collection/document path MỚI (như `assets/banner`), rules hiện tại nhiều khả
năng KHÔNG tự động cho phép — collection `recipes` từng cần một lần cập nhật
rule thủ công khi mới tách ra. Nếu người dùng báo dữ liệu ở path mới không
lưu được (hoặc thấy toast "bị từ chối quyền truy cập [permission-denied]"),
đó là dấu hiệu cần họ vào Firebase console thêm rule cho path đó — không có
cách nào tự kiểm tra hay sửa từ phía code.

**Sự cố thật đã xảy ra (2026-09-19 đến 21): "Tuần này"/"Đi chợ" mất dữ liệu
trên diện rộng — nguyên nhân là 1 race condition thật trong dedupe món ăn,
không phải rule/quota.** Quá trình chẩn đoán ban đầu đi sai hướng — ghi lại
đầy đủ để không lặp lại cách đoán mò tốn thời gian đó:

1. Người dùng báo "Tuần này"/"Đi chợ" trống trên MỌI thiết bị (web thường,
   web ẩn danh, điện thoại chị giúp việc); riêng điện thoại chính chủ vẫn
   hiện dữ liệu cũ nhưng KHÔNG sửa/xoá được gì mới.
2. Nghi ngờ đầu tiên (rule Firestore hết hạn/quota) — **kiểm tra rồi loại
   bỏ**: rule không hết hạn, Anonymous auth vẫn Enabled, quota Reads/Writes
   bình thường. Nhưng mục **Deletes trong Firebase Console → Firestore
   Database → Usage lại là ~40.000 trong 2 ngày** — bất thường nặng so với
   quy mô 1 hộ gia đình (~45 món). Đây là manh mối đúng.
3. Nguyên nhân thật: dữ liệu `recipes` thật trong Firestore vẫn còn ở dạng
   ID ngẫu nhiên cũ (`msr3favs...`, từ trước khi có `slugifyName()`), CHƯA
   từng được thật sự hội tụ về ID xác định. `dedupeRecipesByName()` (cũ)
   chọn "giữ bản đầu tiên theo thứ tự mảng nhận từ snapshot" — nhưng
   Firestore KHÔNG đảm bảo thứ tự ổn định giữa các lần đọc/giữa các thiết
   bị. Khi 2-3 thiết bị cùng mở app (đúng lúc này: điện thoại chủ, điện
   thoại chị giúp việc, web) cùng chạy hàm dedupe gần như đồng thời, mỗi
   bên có thể thấy thứ tự khác nhau → **bên A giữ bản 1 xoá bản 2, bên B lại
   giữ bản 2 xoá bản 1 → CẢ HAI bản cùng biến mất** → `topUpMissingRecipes()`
   phát hiện món "thiếu" nên tạo bản thứ 3 để bù → lặp lại → ra đúng ~40K
   lượt xoá. Mỗi lần một món tạm biến mất khỏi `state.recipes` giữa chừng
   như vậy, code cũ trong `applyRemoteRecipes()` có 1 dòng
   `state.plan = state.plan.filter(function(p){ return validIds[p.recipeId]; })`
   ở CUỐI hàm — dòng này xoá LUÔN VĨNH VIỄN đúng entry "Tuần này" đang trỏ
   tới món tạm-biến-mất đó, và chỉ cần 1 hành động bất kỳ sau đó gọi `save()`
   (bấm nút gì cũng được) là bản plan đã bị cắt cụt này được đẩy lên cloud —
   mất thật cho mọi thiết bị.
4. Đã sửa 3 chỗ:
   - `dedupeRecipesByName()`: khi có nhiều bản trùng tên, sắp xếp theo `id`
     trước khi chọn giữ bản nào (`sort` rồi lấy phần tử đầu) — kết quả không
     còn phụ thuộc thứ tự mảng đầu vào, mọi thiết bị luôn chọn đúng 1 bản
     giống hệt nhau dù nhận snapshot theo thứ tự nào.
   - `applyRemoteRecipes()`: **bỏ hẳn** dòng lọc `state.plan` theo
     `validIds` ở cuối hàm. `removeInvalidRecipes()` và
     `dedupeRecipesByName()` đã tự dọn/remap plan an toàn cho đúng những gì
     CHÚNG chủ động xoá; xoá món thủ công từ thư viện cũng tự dọn plan riêng
     (xem handler "Xoá món khỏi thư viện"). Một entry còn trỏ tới recipeId
     tạm thời không có mặt trong `state.recipes` chỉ đơn giản KHÔNG HIỆN RA
     (`renderPlan`/`computeShopping` đã tự bỏ qua an toàn bằng
     `recipeById()` trả `null`) — vô hại hơn nhiều so với xoá thẳng.
   - `onSnapshot(recipesCol, ...)`: gán `d.id` (id THẬT của Firestore
     document) đè lên field `id` bên trong dữ liệu trước khi đưa vào
     `applyRemoteRecipes` — trước đây tin thẳng vào field `id` bên trong dữ
     liệu, nên 1 document rác không có field `id` (sót lại từ lần thử
     nghiệm sentinel-doc cũ, tên `_meta`, nằm ngay trong `recipesCol`)
     không bao giờ bị `removeInvalidRecipes()` xoá được dù bị phát hiện là
     invalid mỗi lần chạy.

   Bài học tổng quát (bổ sung cho bài học "unconditional + idempotent +
   deterministic id" ở mục #2 bên dưới): **idempotent với chính nó là chưa
   đủ khi hàm đó phải RA QUYẾT ĐỊNH giữa nhiều lựa chọn tương đương (ở đây:
   "giữ bản nào") mà nhiều thiết bị cùng chạy song song** — quyết định đó
   PHẢI là một hàm thuần tuý của nội dung (vd sort theo id) chứ không được
   phụ thuộc thứ tự dữ liệu nhận về, nếu không các thiết bị có thể ra quyết
   định KHÁC NHAU cho cùng một tình huống và giẫm chân lên nhau.

5. Riêng lỗi ĐỌC (`onSnapshot`) từng bị im lặng hoàn toàn (chỉ
   `console.warn`, không toast) — không phải nguyên nhân chính của sự cố
   trên, nhưng là một lỗ hổng thật khiến việc chẩn đoán mất nhiều bước hơn
   cần thiết (người dùng không có cách nào tự biết có lỗi). Đã thêm
   `window.ChipKitchenApp.reportReadError(what, err)` (toast riêng cho lỗi
   ĐỌC, phân biệt với `reportSyncError` cho lỗi GHI) và gắn vào cả 3
   listener `onSnapshot(metaRef/recipesCol/bannerRef, ...)`. Bài học: mọi
   `onSnapshot`/`setDoc`/`getDoc` mới thêm sau này đều PHẢI có error
   callback báo toast cho người dùng, không được chỉ `console.warn`.

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

   **Cập nhật (bài học tiếp theo)**: "vô điều kiện + idempotent" chưa đủ nếu
   phép cộng đó còn tự sinh id ngẫu nhiên (`uid()`) cho phần tử mới thêm.
   Thực tế đã xảy ra: 2 thiết bị cùng tải trang gần nhau, cả hai cùng thấy
   "món X còn thiếu", mỗi bên gọi `seedRecipes()` sinh `uid()` khác nhau cho
   "món X" rồi đều `pushRecipe()` — ra 2 document khác id, cùng tên → trùng
   lặp hiển thị trong thư viện món ăn. `topUpMissingRecipes` tự nó vẫn
   idempotent (không tự thêm 2 lần trong CÙNG một lần chạy), nhưng 2 lần
   chạy độc lập ở 2 nơi lại không hội tụ về cùng 1 document vì id không cố
   định. Đã sửa bằng `slugifyName()`: id của mọi recipe trong `seedRecipes()`
   giờ suy ra thẳng từ tên (`"r-"+slug`), không còn `uid()` — nên 2 thiết bị
   nào cũng tính ra đúng 1 id cho "món X", ghi đè lẫn nhau thay vì tạo bản
   mới. Thêm `dedupeRecipesByName()` (gọi cùng chỗ với `topUpMissingRecipes`)
   để dọn các bản trùng đã lỡ lọt vào dữ liệu thật trước khi có fix này —
   giữ bản đầu tiên, xoá các bản còn lại khỏi cloud, và chuyển hướng mọi
   entry trong `plan` đang trỏ vào bản bị xoá sang bản được giữ, để không
   làm rơi món khỏi thực đơn tuần của người dùng.

   Bài học tổng quát: khi một phép "thêm nếu thiếu" chạy độc lập ở nhiều
   nơi/nhiều thiết bị và tự sinh danh tính (id) cho phần tử mới, danh tính
   đó PHẢI suy ra được (deterministic) từ nội dung — không được để ngẫu
   nhiên quyết định, nếu không "idempotent" chỉ đúng cho một lần chạy chứ
   không đúng khi nhiều nơi cùng chạy.

3. **Push lên `main` xong** → không dừng ở đó. Xác nhận GitHub Actions
   ("pages-build-deployment") chạy xong và Success trước khi báo hoàn tất.

4. **Test bằng tab ẩn danh** vào URL Pages thật để thấy đúng những gì
   server trả về (không dính service worker/cache cũ của chính mình khi
   dev). Nếu nghi ngờ vấn đề đồng bộ cloud, thử tải lại 2-3 lần liên tiếp
   xem có bị tụt về bản cũ không (chính là triệu chứng của lỗi #2).

Chỉ báo "xong" với người dùng sau khi cả 4 bước trên đều ổn.
