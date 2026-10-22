# Unfound — Báo cáo đầy đủ

**RMIT Hackathon 2026 · Challenge 2 UNLOCKED (Tide) · Team GenData**
Hạn nộp: **18:00 thứ Năm 22/10/2026 (giờ VN)** = 10:00 thứ Sáu 23/10 AEDT.

> Be reached, not found.

---

## 1. Đề bài và cách hiểu

**Câu hỏi của đề:** *"What would you build if trust stopped being the bottleneck?"* Nghĩa là: bạn sẽ build gì nếu niềm tin không còn là điểm nghẽn?

**Yêu cầu bắt buộc**
- Có prototype chạy được, tích hợp **TideCloak**. Dùng dữ liệu giả và mock các hệ thống bên ngoài.
- Demo **một khả năng mới**, và giải thích vì sao bỏ được quyền đơn phương thì khả năng đó mới thành hiện thực.
- Không một admin, tổ chức hay AI nào được tự mình vượt qua các quy tắc bảo vệ.

**Nộp bài** (qua Google Form: https://forms.gle/HRHYjnqB86j1LFS97)
1. Repo GitHub **public**, có code và file video `.mp4` dưới 100 MB.
2. README mở đầu bằng **Project overview** theo template của Tide, tối đa 300 từ. Phần Setup để riêng.
3. Video 2 phút gồm 4 phần: possibility → constraint → prototype (vai trò của TideCloak) → what changes.

**Tiêu chí chấm**

| % | Tiêu chí | Unfound đáp ứng ở đâu |
|---|----------|-----------------------|
| 25 | Vision & originality | Lớp "địa chỉ an toàn" dùng xuyên suốt các dịch vụ công. Nhóm nạn nhân bị ít người để ý: rủi ro đến từ người trong hệ thống, không phải hacker |
| 20 | Trust constraint insight | Chính admin và cán bộ là mối đe dọa, nên phân quyền thông thường bất lực. Có số liệu Operation Impala và 2 vụ thật ở Queensland |
| 20 | Value & impact | 1,5 triệu phụ nữ Úc, 866.700 người đã chuyển nhà. Ở VN, 90,4% không tìm đến dịch vụ chính thức |
| 20 | Why TideCloak matters | E2EE theo tag, role `_tide_*` do mạng Tide kiểm tra, QEA chặn việc admin tự cấp quyền (`412`) |
| 15 | Prototype & storytelling | 7 persona, demo 10 bước, Fabric log hiện mọi thao tác Tide, timeline "Who looked" |

**Câu kiểm tra của đề:** *"Nếu app vẫn chạy y hệt với login và phân quyền backend bình thường thì chưa đạt."* Với Unfound, nếu bỏ TideCloak thì người vận hành database đọc được toàn bộ địa chỉ, và admin có thể tự cấp quyền cho mình. Đó chính là rủi ro mà sản phẩm sinh ra để loại bỏ.

---

## 2. Bối cảnh team

- Folder `Team-GenData-RMIT-Hackathon-2026` là **Challenge 1** trên Kaggle: phân loại prompt BENIGN / JAILBREAK / PROMPT_INJECTION đa ngôn ngữ, chấm theo Macro F1.
- Repo này là **Challenge 2**. Hai challenge có cùng hạn 18:00 hôm nay, nên cần chia người.

---

## 3. Vấn đề: địa chỉ mới là dữ liệu nguy hiểm nhất của một nạn nhân BLGĐ

### 3.1 Bốn số liệu (đã đối chiếu với nguồn gốc)

**① AU · 1,5 triệu phụ nữ** từng bị bạo lực bởi **bạn đời cũ**, gấp khoảng 9 lần con số bị bạn đời hiện tại.

| Nhóm | % | Số người |
|------|---|----------|
| Phụ nữ · bạn đời cũ | 16% | 1.500.000 |
| Nam · bạn đời cũ | 4,5% | 425.400 |
| Phụ nữ · bạn đời hiện tại | 1,7% | 173.300 |

Nguồn: ABS, Personal Safety Survey 2021–22, Partner violence. Số liệu tính bạo lực bởi bạn đời từng sống chung, từ năm 15 tuổi, người 18+.
Ý nghĩa: mối đe dọa đến từ người đã rời đi, tức người muốn biết bạn đang sống ở đâu.

**② AU · 64%**, tức **866.700** phụ nữ, đã dọn đi khi chấm dứt quan hệ bạo lực. Ngoài ra có 583.800 người từng ly thân tạm thời, 63% trong số đó dọn ra ít nhất một lần.
Nguồn: ABS PSS 2021–22.
Ý nghĩa: mỗi lần dọn đi là một địa chỉ mới đi vào hồ sơ của trường học, phòng khám, ngân hàng, danh sách cử tri.

**③ AU · 2.215 cáo buộc** lạm dụng thông tin mật trong 4 năm, chỉ riêng 7 cơ quan công của bang Queensland.

| Năm tài chính | Cảnh sát (QPS) | 6 cơ quan khác | Tổng |
|---------------|----------------|----------------|------|
| 2015/16 | 488 | 65 | 553 |
| 2016/17 | 439 | 73 | 512 |
| 2017/18 | 371 | 174 | 545 |
| 2018/19 | 293 | 312 | 605 |

- Với cảnh sát, 87% cáo buộc (1.391/1.591) là **truy cập trái phép** (672) hoặc **tiết lộ trái phép** (719).
- Ở các cơ quan ngoài cảnh sát (y tế, giáo dục, trại giam, giao thông), số cáo buộc tăng **4,8 lần**.

Nguồn: CCC Queensland, Operation Impala, Exhibit 95 (2019). Số liệu lấy trực tiếp từ bảng trong PDF.

**④ VN · 90,4%** phụ nữ bị chồng bạo lực thể xác hoặc tình dục **không tìm đến dịch vụ chính thức**. Lý do chính là sợ kỳ thị, phân biệt đối xử và bị quấy rối thêm.

| Chỉ số | % | Nhóm được tính |
|--------|---|----------------|
| Từng bị chồng bạo lực (suốt đời) | 62,9% | phụ nữ đã kết hôn |
| Bị bạo lực trong 12 tháng qua | ~32% | phụ nữ đã kết hôn |
| Chưa từng kể với ai | ~50% | người từng bị bạo lực |
| Không tìm dịch vụ chính thức | 90,4% | người bị bạo lực thể xác/tình dục |

Nguồn: Nghiên cứu quốc gia về bạo lực đối với phụ nữ ở Việt Nam 2019 (Bộ LĐTBXH, TCTK, UNFPA, DFAT).
⚠️ Mỗi dòng có mẫu số khác nhau, nên khi đọc trong video phải nói đúng nhóm người.

Biểu đồ của 4 số liệu nằm trên landing page (`/`, mục Problem), dùng màu đen, trắng, xám và xanh nhạt.

### 3.2 Hai vụ thật dùng làm hook cho video

- **Queensland 2014.** Một senior constable tra database QPrime nhiều lần, rồi đưa địa chỉ mới của nạn nhân cho kẻ bạo hành, cũng là bạn mình. Kẻ này từng dọa giết bà và các con. Tòa QCAT kết luận Cảnh sát QLD có trách nhiệm vì đã không kiểm soát được việc truy cập database.
- **Queensland 2024.** QPrime tự động điền địa chỉ nạn nhân vào các mẫu đơn giao cho chính kẻ bạo hành. Ủy viên Thông tin QLD kết luận cảnh sát vi phạm Luật Quyền riêng tư và đã biết rủi ro này "ít nhất từ 2017".

**Bối cảnh VN:** riêng nửa đầu 2024 có 46 vụ lộ lọt, 13 triệu bản ghi dữ liệu cá nhân bị rao bán (Viettel Cyber Security). Luật Bảo vệ dữ liệu cá nhân có hiệu lực từ 1/1/2026.

### 3.3 Vì sao vấn đề này "nhức nhối nhưng ít ai để ý"

- Báo chí đưa tin về hacker (Optus, Medibank). Một cán bộ tra cứu một địa chỉ thì không lên báo, nhưng một lần như vậy là đủ để nạn nhân bị tìm ra.
- Úc chỉ có cơ chế "silent elector" cho danh sách cử tri. Chúng tôi không tìm thấy chương trình bảo mật địa chỉ nào áp dụng xuyên suốt các dịch vụ (Mỹ có ở khoảng 40 bang). Việt Nam chưa có cơ chế tương tự.
- Siết phân quyền backend không giải quyết được, vì người đe dọa chính là người *có* quyền.

---

## 4. Ý tưởng: Unfound

**Một câu:** Unfound là lớp "địa chỉ an toàn" giúp nạn nhân BLGĐ vẫn dùng được trường học, phòng khám, tòa án sau khi chuyển nhà. Địa chỉ mới không bao giờ ở dạng đọc được trong database, và không một người nào tự mình mở được.

| Ai | Hôm nay thấy gì | Với Unfound thấy gì |
|----|-----------------|---------------------|
| Trường học | Địa chỉ đầy đủ | "Trong tuyến Footscray North ✓" |
| Phòng khám GP | Địa chỉ, số điện thoại | Quận/huyện và số liên lạc chuyển tiếp |
| Thư tòa án | Địa chỉ trong file của thư ký | Địa chỉ chỉ được mở lúc in nhãn |
| Cảnh sát | Tra database bất cứ lúc nào | Break-glass: 2/3 người duyệt, xem một lần rồi bị thu hồi |
| Admin, DBA, nhà vận hành | Mọi thứ | Chỉ thấy bản mã. Tự cấp quyền thì bị treo PENDING |

---

## 5. Áp dụng Tide (đã đối chiếu với docs và SDK `@tidecloak/react` 0.14.33)

| Nhu cầu | Khả năng của TideCloak | Cách Unfound dùng |
|---------|------------------------|-------------------|
| Đăng nhập | BYOiD, passwordless, không lưu hash mật khẩu | 7 persona đăng nhập bằng Tide |
| Lưu địa chỉ | Hermetic E2EE: `doEncrypt` / `doDecrypt` theo tag ngay trong trình duyệt | 3 tag: `addrfull`, `addrzone`, `addrcontact`. Server chỉ giữ bản mã |
| Ai đọc phần nào | Role `_tide_<tag>.selfdecrypt` | Trường giữ role cho zone, GP cho contact, không ai giữ full |
| Không ai tự cấp quyền | Quorum-Enforced Governance. Ngưỡng `max(1, floor(0,7×N))`, ký bằng threshold signature | Dan, Mai, Ruth là realm admin → cần 2/3 |
| Thao tác bị chặn | Gán role → `202` change set PENDING. Commit khi thiếu phiếu → `412 QUORUM_NOT_MET` | Màn demo chính với Dan |
| Gọi từ app | `AdminAPI.addUserRoles`, `getPendingChangeSets`, `approveChangeSet`, `commitChangeSet`, `getAccessLogs` | Panel "Run it on the real realm" trong live mode |
| Minh bạch | Log mọi đề xuất và phiếu bầu kèm bằng chứng mật mã | Fabric log và timeline "Who looked" |

**Điểm phải kiểm chứng:** docs chưa nói rõ user B có giải mã được dữ liệu do user A mã hóa hay không, nếu B có đúng role. Docs cho biết dữ liệu được mã hóa lại theo khóa phiên của người yêu cầu, và ý tưởng mẫu "Care Passport" của Tide ngụ ý là được. Cách kiểm tra nằm ở bước 2 trong `docs/LIVE_TIDECLOAK.md`. Nếu không được, quay bước đó bằng mock mode và hỏi Tide trên Discord #support.

---

## 6. Prototype

### 6.1 Tính năng

| Màn hình | Persona | Tính năng | Tide |
|----------|---------|-----------|------|
| Safe Address (mobile) | Linh | Nhập địa chỉ, mã hóa thành 3 phần, tự xem lại | doEncrypt / doDecrypt |
| Shares | Linh | Xem dịch vụ nào đang có quyền. Rút quyền cũng phải qua quorum | change set REVOKE |
| Who looked | Linh | Dòng thời gian mọi lần mở, bị chặn, duyệt hoặc từ chối | audit |
| Enrolments | Westgate Primary / GP | Mở đúng phần của mình. Thử mở địa chỉ đầy đủ thì bị DENIED | role theo tag |
| Database | Dan | So sánh Legacy (plaintext) với Unfound (ciphertext) | E2EE |
| Roles | Dan | Tự gán role → Authorize → Commit → 412 | QEA |
| Approvals inbox | Mai, Ruth | Approve / Deny, có cảnh báo khi ai đó tự cấp quyền cho mình | QEA vote |
| Break-glass | Const. Reyes | Gửi yêu cầu → 2/3 duyệt → xem một lần → tự thu hồi quyền | grant tạm thời |
| Fabric log | mọi persona | Mỗi dòng là một thao tác Tide kèm kết quả | output kỹ thuật |

### 6.2 Kiến trúc

```
Vite + React 18 + TypeScript (SPA, deploy tĩnh)
├─ src/landing/          Landing: Hero · Problem (4 stats + biểu đồ) · How it works · Who sees what · Prototype · What changes
├─ src/demo/engine.ts    Persona, dữ liệu giả, máy trạng thái change request (mô phỏng QEA, ngưỡng 2/3)
├─ src/demo/fabric.ts    Fabric interface + mock fabric (AES-GCM thật trong trình duyệt, cùng luật role)
├─ src/demo/live.tsx     TideCloakContextProvider + doEncrypt/doDecrypt thật + AdminAPI change set
├─ src/demo/store.tsx    State, log, lưu vào localStorage
└─ src/demo/screens/     Survivor · Service · Admin · Approver · Police
```

- **Mock mode** (mặc định, dùng cho bản deploy): không cần server. Luật role và luồng duyệt giống hệt live mode, nhưng khóa nằm trong trình duyệt, nên chỉ chứng minh UX chứ không chứng minh bảo mật. README đã ghi rõ điều này.
- **Live mode:** có `public/tidecloak.json` thì app tự chuyển sang live. Xem `docs/LIVE_TIDECLOAK.md`.

### 6.3 Output kỹ thuật khi chạy

```
npm run dev            → http://localhost:3000  (landing)  ·  /demo (prototype)
npm run build          → dist/ (~413 KB JS, 13 KB CSS)
```

Fabric log sau khi chạy hết 10 bước demo (đã chạy thử bằng headless Chrome, không có lỗi console):

```
Linh       doEncrypt      addrfull, addrzone, addrcontact → 3 ciphertexts stored, 0 plaintext   OK
Westgate   doDecrypt      addrzone → plaintext in Westgate Primary's session only                OK
Westgate   doDecrypt      addrfull → DENIED, missing role _tide_addrfull.selfdecrypt             DENIED
Dan        doDecrypt      addrfull → DENIED, missing role _tide_addrfull.selfdecrypt             DENIED
Dan        assignRole     CR-001 → Dan K. · 202 Accepted, change set PENDING (0/2)                PENDING
Dan        authorize      CR-001: 1/2 approvals                                                   OK
Dan        commit         CR-001: 412 QUORUM_NOT_MET (1/2)                                        DENIED
Reyes      assignRole     CR-002 → Const. Reyes · 202 Accepted, PENDING (0/2)                     PENDING
Mai        deny/authorize CR-001 denied · CR-002 1/2
Ruth       deny/authorize CR-001 closed without quorum · CR-002 quorum met, signed by threshold  OK
Reyes      doDecrypt      addrfull → plaintext once                                               OK
Reyes      revoke         CR-002 role removed after one use                                       OK
```

---

## 7. Thương hiệu (theo `DESIGN.md`, phong cách clutch.security)

| | |
|---|---|
| Tên | **Unfound** (un·found, 2 âm tiết). Wordmark viết thường |
| Slogan | **Be reached, not found.** |
| Câu phụ | Your address, held by no one. |
| Logo | "Cái ghim không có mũi": vòm mở với một chấm bên trong, nét 9/64, đầu nét cắt vuông, màu đen phẳng. Nhìn lần hai thì cũng là một khung cửa |
| Font | Space Grotesk (thay cho PP Radio Grotesk của Clutch vì font đó trả phí) cho tiêu đề, Inter cho UI, monospace hệ thống cho ciphertext |
| Màu | Obsidian `#000`, Canvas `#fff`, các tông xám (Fog `#f9fafb`, Slate Mist `#e5e7eb`, Stone `#c9c9c9`, Graphite `#6e6e6e`), xanh nhạt (Periwinkle Wash `#d9e4ff`, Seal Blue `#8fadff`). Electric Cobalt `#004dff` chỉ dùng cho đúng 1 nút CTA mỗi trang |
| Dấu ấn riêng so với Clutch | Logo 2D thô thay cho render 3D. Xanh nhạt làm màu "đã niêm phong". Hiển thị ciphertext như một chất liệu thiết kế. Không dùng màu đỏ: DENIED là badge đen |

Lưu ý: bản brief HTML trước đây dùng Cover Blue và nét viền 2px. Bản này thay bằng DESIGN.md theo yêu cầu (đen, trắng, xám, xanh nhạt; hairline 1px).

---

## 7b. Motion và âm thanh

Toàn bộ mô tả nằm trong DESIGN.md, mục Motion và Sound. Tóm tắt:

- **Lần đầu vào trang:** logo tự vẽ nét, wordmark hiện từng chữ, sau đó lớp trắng quét lên để lộ hero. Click hoặc bấm phím để bỏ qua.
- **Hero:** chữ trồi lên khỏi mặt nạ, orbit vẽ dần, các token nổi lơ lửng, có parallax khi cuộn.
- **Cuộn trang:** cuộn mượt bằng Lenis; các con số đếm lên; biểu đồ vẽ dần; câu ở mục "What changes" sáng dần theo từng chữ khi cuộn.
- **Chuyển trang:** màn đen kéo lên rồi hạ xuống, logo lóe ở giữa. Phần demo được tải trước khi landing rảnh, nên không phải chờ mạng.
- **Demo:**
  - Pill đen trượt giữa các persona; gạch dưới tab trượt theo.
  - Ciphertext và plaintext giải mã dần từ ký tự ngẫu nhiên.
  - Dòng mới trong Fabric log trượt vào, kèm một chớp màu xanh nhạt.
  - Badge DENIED và thông báo 412 rung nhẹ.
  - Mỗi thao tác Tide có âm thanh riêng (Kenney, CC0).
- **Hiệu năng:** đo khi cuộn: p99 là 16,8ms, không rớt frame. JS của landing tách riêng khỏi demo và TideCloak SDK.

## 8. Video và deploy

- Click path và storyboard 2 phút nằm trong `docs/DEMO_SCRIPT.md`.
- Quay màn hình Linh ở 390×844 để ghép vào mockup điện thoại. Các màn còn lại quay ở 1440×900 cho mockup laptop.
- **Deploy:**
  - Vercel: import repo GitHub, framework Vite, bấm Deploy. `vercel.json` đã cấu hình route cho SPA.
  - Hoặc Netlify Drop: kéo thả thư mục `dist/`. File `_redirects` đã có sẵn.
- Bản deploy chạy mock mode. TideCloak thật chạy local khi quay video.

---

## 9. Kế hoạch còn lại hôm nay

| Giờ (VN) | Việc | Ai |
|----------|------|----|
| ngay | `npm install && npm run dev`, xem `/` và `/demo` | cả team |
| ngay | Chạy TideCloak bằng Docker, chạy initializer, hoàn tất enrolment, kiểm tra bước 1–2 trong LIVE_TIDECLOAK | 1 người |
| song song | Quay video theo DEMO_SCRIPT, ghép mockup, xuất mp4 dưới 100 MB | 1–2 người |
| 16:30 | Đưa link deploy vào README, thêm `public/video/unfound.mp4`, set repo public | lead |
| 17:00 | Nộp Google Form (chừa 1 tiếng dự phòng) | lead |

---

## 10. Rủi ro

- **Kỹ thuật:** chưa chắc việc giải mã chéo giữa các user (xem mục 5). QEA cần ít nhất 2 realm admin thật mới thấy được trạng thái multi-admin.
- **Đạo đức:** chỉ dùng dữ liệu giả và persona hư cấu. Hai vụ Queensland chỉ được dẫn lại như tin tức có nguồn.
- **Số liệu:** Operation Impala đếm cáo buộc, không phải vụ đã được chứng minh. Số liệu VN có mẫu số khác nhau giữa các dòng.
- **Định vị:** kể về điều người sống sót *giờ làm được*. Không gọi Unfound là "công cụ bảo mật" vì FAQ của đề cảnh báo điều này.

---

## 11. Nguồn

1. ABS · Partner violence, Personal Safety Survey 2021–22 — https://www.abs.gov.au/statistics/people/crime-and-justice/partner-violence/2021-22
2. CCC QLD · Operation Impala Exhibit 95 — https://www.ccc.qld.gov.au/sites/default/files/Docs/Public-Hearings/Impala/Exhibits/Operation-Impala-Exhibit-95-Queensland-Police-Service-Complaints-and-Allegations-Data-Analysis.PDF
3. CCC QLD · thông cáo 2/2020 — https://www.ccc.qld.gov.au/news/agencies-must-ensure-queenslanders-confidential-information-protected
4. UN Việt Nam · Nghiên cứu quốc gia 2019 — https://vietnam.un.org/en/53665-journey-change-second-national-study-violence-against-women-viet-nam-2019-released
5. Hanoi Times — https://m.hanoitimes.vn/two-thirds-of-vietnamese-married-women-suffer-domestic-violence-study-313249.html
6. Vụ QLD 2014 — https://www.sydneycriminallawyers.com.au/?p=41673 · https://www.canberratimes.com.au/story/7348775/police-appeal-sentence-for-dv-leak-cop
7. AAP · QPrime 2024 — https://aapnews.aap.com.au/news/police-privacy-breach-puts-dv-survivors-lives-at-risk
8. VnEconomy · mua bán dữ liệu cá nhân — https://vneconomy.vn/phat-hien-hang-nghin-gb-du-lieu-ca-nhan-bi-thu-thap-mua-ban-trai-phep-trong-do-co-nhieu-du-lieu-nhay-cam.htm
9. Tide docs — https://docs.tide.org/Core-Concepts/core-concepts · https://docs.tide.org/Core-Concepts/iga-workflow · https://docs.tide.org/Core-Concepts/hermetic-e2ee · https://docs.tide.org/get-started/Tidecloak%20Quickstart
10. Tide · UNLOCKED — https://tide.org/unlocked/ · Emergent Authority — https://tide.org/blog/emergent-authority-beyond-cybersecurity
