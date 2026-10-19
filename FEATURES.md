# Chip Kitchen — Danh sách chức năng

Cập nhật lần cuối: 19/10/2026 (đối chiếu với code và lịch sử thay đổi trên GitHub đến bản `chip-kitchen-v56`)

**Ký hiệu:** ✅ đã làm · 🔧 đã làm nhưng cần bạn kiểm tra/xác nhận · 🔲 dự kiến làm · 💡 đề xuất (chưa bàn kỹ với bạn)

> Cách dùng: muốn thêm/sửa/bỏ chức năng, nói với Claude "cập nhật danh sách chức năng" — Claude sửa file này cùng lúc với app.

---

## 1. Thực đơn tuần ("Tuần này")

| # | Chức năng | Trạng thái |
|---|-----------|-----------|
| 1.1 | Là tab đầu tiên và là màn hình mặc định khi mở app | ✅ |
| 1.2 | Thêm món vào tuần từ thư viện món ăn (nút "+ Thêm vào tuần" trên thẻ món) — đã bỏ ô chọn món ở tab này | ✅ |
| 1.3 | Món gom theo nhóm (Món mặn, Xào, Canh rau, Ăn sáng, Tráng miệng, Hoa tươi) | ✅ |
| 1.4 | Mỗi món có ảnh nhỏ bên cạnh (vừa phải để không cuộn nhiều trên điện thoại) | ✅ |
| 1.5 | Tăng/giảm số lần nấu của từng món trong tuần | ✅ |
| 1.6 | Nút "Đã nấu": còn nhiều lần thì bớt 1 lần; còn đúng 1 lần thì làm mờ món (bấm lại để hoàn tác) | ✅ |
| 1.7 | Menu "⋯" từng món: Xem nguyên liệu · Bỏ khỏi tuần | ✅ |
| 1.8 | Xem nguyên liệu đã quy đổi theo số người trong nhà | ✅ |
| 1.9 | Có link "Xem hướng dẫn" ngay trong phần nguyên liệu (nếu món có link) | ✅ |
| 1.10 | Popup xác nhận trước khi bỏ món khỏi tuần (tránh bấm nhầm) | ✅ |
| 1.11 | Hiện khoảng ngày của tuần hiện tại (vd: 10–16 tháng 8) | ✅ |
| 1.12 | "Bắt đầu tuần mới" (nằm ở tab Đi chợ): xoá thực đơn, trạng thái mua và mục tự thêm; bấm 2 lần để xác nhận | ✅ |

## 2. Thư viện món ăn ("Món ăn")

| # | Chức năng | Trạng thái |
|---|-----------|-----------|
| 2.1 | Thư viện món có sẵn theo danh sách của bạn, đã quy đổi cho 3 người; có thêm 16 món (gà, vịt/ngan, lợn, bò/bê, trứng, cá kho, mỳ Ý) | ✅ |
| 2.2 | Nhóm chính: Món mặn · Xào · Canh rau · Ăn sáng · Tráng miệng · Hoa tươi (không còn nhóm "Tất cả") | ✅ |
| 2.3 | Nhóm phụ của Món mặn: Gà · Lợn · Vịt · Bò · Cá · Trứng · Khác | ✅ |
| 2.4 | Menu lọc cuộn ngang trên điện thoại, xuống dòng trên máy tính | ✅ |
| 2.5 | Tìm món theo tên | ✅ |
| 2.6 | Thêm / sửa món: tên, nhóm, nhóm phụ, khẩu phần, nguyên liệu (tên, số lượng, đơn vị, loại), ảnh, link hướng dẫn | ✅ |
| 2.7 | Xoá món có popup xác nhận (xoá nhầm là rất mệt) | ✅ |
| 2.8 | Upload ảnh món từ điện thoại/máy tính, tự nén ảnh | ✅ |
| 2.9 | Chưa có ảnh → hiện icon minh hoạ theo nhóm; một số món có ảnh mặc định sẵn trong app (đang thử với "Gà rang gừng nghệ") | 🔧 |
| 2.10 | Link hướng dẫn nấu (video/bài viết) cho từng món, có nút mở nhanh trên thẻ món | ✅ |
| 2.11 | Thẻ món thu gọn để thấy nhiều món hơn trên một màn hình; bấm để mở nguyên liệu | ✅ |
| 2.12 | Tự bổ sung món có sẵn còn thiếu, tự dọn món bị trùng tên (id cố định theo tên) | ✅ |
| 2.13 | Ảnh món tỉ lệ 4:3 | ✅ |

## 3. Đi chợ ("Đi chợ")

| # | Chức năng | Trạng thái |
|---|-----------|-----------|
| 3.1 | Tự gộp nguyên liệu cả tuần thành một danh sách, cộng dồn số lượng | ✅ |
| 3.2 | Xem theo loại thực phẩm: Thịt · Cá & hải sản · Rau củ · Trái cây · Hoa tươi · Trứng, sữa & khác · Gia vị & đồ khô | ✅ |
| 3.3 | Xem theo nơi mua: Chợ · Siêu thị · Gofood · Moom · Được cho · Chưa chọn nơi mua | ✅ |
| 3.4 | Gán nơi mua cho từng món (nhớ theo tên món, dùng chung cho mọi nơi món đó xuất hiện) | ✅ |
| 3.5 | 4 trạng thái cho mỗi món: Cần mua · Đã mua · Vẫn còn (nhà còn, không cần mua) · Không mua được | ✅ |
| 3.6 | Thanh tiến độ "Đã mua x/y" | ✅ |
| 3.7 | Tự đổi đơn vị cho dễ đọc (g → kg, ml → lít, làm tròn đơn vị đếm) | ✅ |
| 3.8 | Gia vị (nhóm "Gia vị & đồ khô") không tự vào danh sách đi chợ từ công thức | ✅ |
| 3.9 | Đồ dùng sắp hết/đã hết tự hiện ở cột/khối riêng ("Sắp hết") | ✅ |
| 3.10 | Tự thêm mục khác (giấy ăn, trái cây tráng miệng…) | ✅ |
| 3.11 | Sao chép danh sách thành văn bản để gửi người khác | ✅ |
| 3.12 | Bố cục máy tính: cột phụ bên phải cho đồ dùng sắp hết và mục tự thêm | ✅ |

## 4. Đồ dùng cần refill ("Đồ dùng")

| # | Chức năng | Trạng thái |
|---|-----------|-----------|
| 4.1 | 9 nhóm: Gạo & ngũ cốc · Gia vị & nêm nếm · Đồ khô & đóng hộp · Sữa & chế phẩm từ sữa · Đồ uống · Đồ vệ sinh nhà cửa · Đồ vệ sinh cá nhân · Đồ dùng nhà bếp tiêu hao · Đồ ăn vặt & tráng miệng | ✅ |
| 4.2 | Nhập "Ngày bắt đầu dùng" cho từng món (chọn ngày, kể cả ngày cũ) | ✅ |
| 4.3 | Tự ước tính bao lâu nữa hết, dựa trên số ngày dùng của lần trước | ✅ |
| 4.4 | Trạng thái: ổn · sắp hết · đã hết · chưa dùng; có tóm tắt đầu trang | ✅ |
| 4.5 | Đánh dấu "Đã hết" → tự vào danh sách đi chợ | ✅ |
| 4.6 | Thêm mục mới (tên, dung lượng/đơn vị, nhóm) | ✅ |
| 4.7 | Huy hiệu số lượng trên menu Đồ dùng (số mục sắp hết/đã hết) | ✅ |

## 5. Giao diện & trải nghiệm

| # | Chức năng | Trạng thái |
|---|-----------|-----------|
| 5.1 | Tên "Chip Kitchen", phong cách sách nấu ăn ấm áp; chỉ có giao diện sáng (không có chế độ tối) | ✅ |
| 5.2 | Điện thoại: menu chính cố định ở cuối màn hình (icon + chữ, mục đang chọn khoanh vàng) | ✅ |
| 5.3 | Máy tính: menu dọc bên trái, bố cục nhiều cột theo thiết kế | ✅ |
| 5.4 | Banner ảnh mặc định ở đầu mọi màn hình (cao hơn, dùng ảnh nguyên bản) | ✅ |
| 5.5 | Nền hoa văn bếp mờ nhẹ cho toàn app | ✅ |
| 5.6 | Menu Cài đặt (icon bánh răng): chỉnh số người trong nhà · Xuất dữ liệu · Nhập dữ liệu | ✅ |
| 5.7 | Thông báo nhỏ (toast) khi lưu/đồng bộ lỗi, kèm mã lỗi để báo lại cho Claude | ✅ |
| 5.8 | Toàn bộ giao diện bằng tiếng Việt | ✅ |
| 5.9 | Đổi/bỏ ảnh banner bằng tay | 🔧 đã bỏ nút đổi ảnh ở bản 26/9 — banner nay là ảnh mặc định; bạn xác nhận có muốn thêm lại không |

## 6. Đồng bộ & dữ liệu

| # | Chức năng | Trạng thái |
|---|-----------|-----------|
| 6.1 | Đồng bộ đám mây (Firebase Firestore): bạn, chị giúp việc và mọi thiết bị thấy cùng một dữ liệu | ✅ |
| 6.2 | Không cần đăng nhập — ai có link đều xem/sửa được (đã chấp nhận vì dữ liệu ít nhạy cảm) | ✅ |
| 6.3 | Lưu tạm trên máy để mở được cả khi mất mạng | ✅ |
| 6.4 | Dữ liệu tách 3 phần trên đám mây: dữ liệu chung · mỗi món 1 tài liệu riêng · ảnh banner riêng (tránh giới hạn 1MB) | ✅ |
| 6.5 | Chốt an toàn: không đẩy dữ liệu lên đám mây trước khi nhận xong dữ liệu thật | ✅ |
| 6.6 | Ảnh không lưu vào bộ nhớ máy (tránh báo "bộ nhớ đầy"), lấy từ đám mây | ✅ |
| 6.7 | Sửa các lỗi mất dữ liệu "Tuần này"/"Đi chợ" do nhiều thiết bị cùng dọn món trùng | ✅ |
| 6.8 | Báo toast khi lỗi ĐỌC dữ liệu đám mây (không còn im lặng) | ✅ |
| 6.9 | Xuất dữ liệu ra file JSON (sao lưu thủ công) | ✅ |
| 6.10 | Nhập dữ liệu từ file JSON, đồng bộ cả món ăn lên đám mây | ✅ |
| 6.11 | Nén ảnh món (tối đa 800px) trước khi lưu | ✅ |

## 7. Cài đặt & phát hành

| # | Chức năng | Trạng thái |
|---|-----------|-----------|
| 7.1 | Đưa app lên mạng (GitHub Pages) — mở bằng link trên điện thoại/máy tính | ✅ |
| 7.2 | Cài như app trên màn hình chính (PWA: icon, tên, toàn màn hình) | ✅ |
| 7.3 | Tự cập nhật bản mới (đã sửa 2 lỗi cache khiến điện thoại giữ bản cũ) | ✅ |
| 7.4 | Checklist deploy ghi trong `CLAUDE.md` (bump phiên bản cache, migration chạy ở cả 2 đường, kiểm tra bằng tab ẩn danh) | ✅ |

---

## Dự kiến / đang chờ

| # | Chức năng | Trạng thái | Ghi chú |
|---|-----------|-----------|---------|
| P1 | Hình minh hoạ đơn giản về các phần mềm dùng để làm app (Claude Code, GitHub, Firebase…) và vai trò từng cái | 🔲 | Bạn nhờ trước đây, chưa làm xong |
| P2 | Ảnh thật cho các món còn lại (hiện mới thử 1 món "Gà rang gừng nghệ") | 🔲 | Suy ra từ lần thử 26/9 — bạn xác nhận có làm tiếp không |
| P3 | Kiểm tra sau vài ngày dùng: hết báo lỗi "không lưu được vào bộ nhớ máy", cập nhật lên điện thoại ổn | 🔲 | |

## 💡 Đề xuất (chưa bàn kỹ — cứ xoá nếu không cần)

| # | Ý tưởng | Vì sao |
|---|---------|--------|
| S1 | Sao lưu tự động định kỳ (vd xuất JSON hằng tuần) | Đã từng mất dữ liệu; hiện chỉ sao lưu thủ công |
| S2 | Khoá đơn giản bằng mã/PIN cho dữ liệu đám mây | Hiện ai có link đều sửa được |
| S3 | Lưu lịch sử các tuần trước để xem lại/nấu lại | "Bắt đầu tuần mới" đang xoá hết thực đơn |
| S4 | Ghi giá từng món đi chợ, tổng chi tiêu tuần | Hỗ trợ quản lý chi tiêu |
| S5 | Lưu bản sao quy tắc bảo mật Firebase vào repo | Hiện chỉ nằm trên Firebase console, mỗi lần thêm đường dẫn dữ liệu mới có thể bị `permission-denied` |
