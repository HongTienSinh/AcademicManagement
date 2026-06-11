# HỆ THỐNG QUẢN LÝ CƯ DÂN VÀ PHẢN HỒI SỰ CỐ
*(Resident Management and Incident Response System)*

---

## 1. Kiến Trúc Hệ Thống (Clean Architecture)

Hệ thống được thiết kế theo nguyên lý **Clean Architecture** (Kiến trúc sạch) nhằm tách biệt các tầng logic, giúp hệ thống độc lập với các công cụ/framework bên ngoài, từ đó dễ dàng mở rộng, bảo trì và viết unit test.

Hệ thống được cấu trúc thành 4 tầng cốt lõi (từ trong ra ngoài):
                   ┌─────────────────────────────────────────┐
                   │       Frameworks & Drivers (External)   │
                   │   ┌─────────────────────────────────┐   │
                   │   │   Interface Adapters (Web/DB)   │   │
                   │   │   ┌─────────────────────────┐   │   │
                   │   │   │   Use Cases (Business)  │   │   │
                   │   │   │   ┌─────────────────┐   │   │   │
                   │   │   │   │    Entities     │   │   │   │
                   │   │   │   │  (Core Models)  │   │   │   │
                   │   │   │   └─────────────────┘   │   │   │
                   │   │   └─────────────────────────┘   │   │
                   │   └─────────────────────────────────┘   │
                   └─────────────────────────────────────────┘

### 1.1. Tầng Thực Thể (Entities Layer)
* Là trung tâm của hệ thống, chứa các đối tượng nghiệp vụ cốt lõi (Core Business Objects) và các quy tắc bất biến (business rules) không thay đổi theo thời gian.
* **Thành phần chính:** Đối tượng `Resident` (Cư dân), `Incident` (Sự cố), `Feedback` (Phản hồi), `Apartment` (Căn hộ).

### 1.2. Tầng Ca Sử Dụng (Use Cases / Application Layer)
* Chứa các logic nghiệp vụ đặc thù của ứng dụng. Tầng này trực tiếp điều hướng luồng dữ liệu đến và đi từ các Entities để thực hiện các chức năng của hệ thống.
* **Thành phần chính:** `CreateIncident` (Tạo sự cố mới), `AssignStaff` (Giao việc cho kỹ thuật viên), `ApproveResident` (Duyệt tài khoản cư dân), `UpdateIncidentStatus` (Cập nhật trạng thái xử lý).

### 1.3. Tầng Bộ Điều Khiển và Giao Tiếp (Interface Adapters / Presenters Layer)
* Đóng vai trò là bộ chuyển đổi dữ liệu. Nó chuyển dữ liệu từ định dạng thuận tiện cho Use Cases sang định dạng phù hợp cho Web/Mobile hoặc Cơ sở dữ liệu và ngược lại.
* **Thành phần chính:** REST APIs Controllers, gRPC Services, các bộ chuyển đổi dữ liệu (DTOs - Data Transfer Objects) và Mappers.

### 1.4. Tầng Ngoại Vi (Frameworks & Drivers Layer)
* Tầng ngoài cùng, nơi chứa các công cụ, cấu hình bên ngoài mà hệ thống sử dụng.
* **Thành phần chính:** Cơ sở dữ liệu (Microsoft Sql Server), UI (Giao diện ứng dụng), Web Frameworks, và các dịch vụ bên thứ ba (Gửi SMS, Email, Push Notification).

> **Nguyên tắc phụ thuộc (Dependency Rule):** Các tầng bên ngoài chỉ được phép phụ thuộc vào các tầng bên trong. Tầng bên trong tuyệt đối không biết gì về sự tồn tại hoặc cách thức hoạt động của các tầng bên ngoài.



---

## 2. Công Nghệ Sử Dụng (Tech Stack)

Để vận hành một hệ thống quản lý cư dân ổn định, đáp ứng tính năng tương tác thời gian thực (real-time) khi báo sự cố, các công nghệ sau được đề xuất sử dụng:

### 2.1. Tầng Backend (Máy chủ & Xử lý logic)

| Thành phần | Công nghệ đề xuất | Lý do lựa chọn |
| :--- | :--- | :--- |
| **Framework chính** | **Node.js (NestJS)** *hoặc* **Java (Spring Boot)** | **NestJS** hỗ trợ mô hình cấu trúc Clean Architecture cực tốt bằng TypeScript.<br>**Spring Boot** tối ưu cho các hệ thống cần độ bảo mật cao, tải lớn và tính ổn định lâu dài. |
| **Cơ sở dữ liệu (Primary DB)** | **Microsoft SQL server 2019**  | Đảm bảo tính toàn vẹn dữ liệu (ACID) cho các thông tin quan trọng như thông tin cư dân, hợp đồng và lịch sử căn hộ. |
| **Bộ nhớ đệm (Caching)** | **Redis** | Tăng tốc độ tải dữ liệu, giảm tải cho DB chính và quản lý các phiên đăng nhập (Session/Token JWT). |
| **Thời gian thực (Real-time)** | **Socket.io / WebSockets** | Đẩy thông báo ngay lập tức (instant alert) cho Ban quản lý ngay khi có cư dân gửi báo cáo sự cố. |

### 2.2. Tầng Frontend & Mobile (Giao diện người dùng)

* **Ứng dụng Mobile (Dành cho Cư dân):** * **Công nghệ:** `Flutter` hoặc `React Native`.
  * **Mục đích:** Phát triển một lần (Single codebase) chạy được trên cả hai nền tảng iOS và Android, giúp cư dân dễ dàng gửi phản hồi và chụp ảnh/quay video sự cố trực quan.
* **Trang quản trị Web (Dành cho Ban quản lý & Kỹ thuật viên):**
  * **Công nghệ:** `React.js` hoặc `Vue.js` kết hợp với `TailwindCSS`.
  * **Mục đích:** Xây dựng giao diện Dashboard mượt mà, quản lý danh sách cư dân tập trung, tiếp nhận và phân phối xử lý sự cố nhanh chóng.

### 2.3. Hạ Tầng & Dịch Vụ Tích Hợp (Infrastructure & Third-party)

* **Cloud Hosting:** `AWS (Amazon Web Services)` hoặc `Google Cloud Platform` giúp hệ thống vận hành ổn định 24/7, tự động sao lưu dữ liệu.
* **Lưu trữ tệp tin (Storage):** `Amazon S3` để lưu trữ hình ảnh, video bằng chứng sự cố do cư dân tải lên.
* **Dịch vụ thông báo (Push Notification):** `Firebase Cloud Messaging (FCM)` để đẩy thông báo về điện thoại cư dân ngay lập tức khi trạng thái sự cố có cập nhật mới (Ví dụ: "Đang sửa chữa", "Đã hoàn thành").
* **Triển khai hệ thống (DevOps):** `Docker` để container hóa ứng dụng, kết hợp với các script `CI/CD` (GitHub Actions / GitLab CI) giúp tự động hóa quy trình kiểm thử và triển khai hệ thống lên máy chủ một cách an toàn.

### Module 1: Quản trị Hệ thống và Phân quyền (System Administration)

Đây là phân hệ nền tảng, đóng vai trò thiết lập khung dữ liệu ban đầu và đảm bảo tính bảo mật, truy cập đúng người đúng việc cho toàn bộ hệ thống.

* **Quản lý chuỗi chung cư (Multi-tenant):** Khởi tạo và lưu trữ danh sách các khu chung cư/tòa nhà thuộc quyền quản lý. Mỗi chung cư sẽ có các thông số thiết lập độc lập.
* **Quản lý người dùng và Phân quyền (RBAC - Role-Based Access Control):**

  * Tạo tài khoản và cấp quyền theo vai trò: Quản trị viên cấp cao (Super Admin), Trưởng ban quản lý (Manager), Nhân viên kỹ thuật (Technician), Cư dân (Resident).
  * Quản lý cơ chế xác thực và phiên đăng nhập.
* **Quản lý danh mục dùng chung (Master Data):** Thiết lập các danh mục hệ thống như: Nhóm sự cố (Điện, Nước, An ninh), Trạng thái công việc, Đơn vị tính vật tư, v.v.

### Module 2: Quản lý Không gian và Cư dân (Space \& Resident Management)

Module này tập trung vào việc số hóa mặt bằng vật lý của chung cư và mối liên kết với dữ liệu nhân khẩu học.

* **Quản lý hạ tầng không gian:** Thiết lập sơ đồ cây trực quan: `Chung cư` -> `Tòa nhà` -> `Tầng` -> `Căn hộ` / `Khu vực công cộng`.
* **Quản lý thông tin Căn hộ:** Ghi nhận trạng thái căn hộ (Đang trống, Đã bàn giao, Đang cho thuê), thông số diện tích, mã căn hộ.
* **Quản lý Hồ sơ Cư dân:**

  * Lưu trữ thông tin chi tiết: Chủ hộ, các thành viên trong gia đình, người thuê nhà (thông tin liên hệ, CCCD/CMND).
  * Theo dõi lịch sử chuyển đến/chuyển đi để quản lý chặt chẽ sự biến động nhân khẩu trong từng thời kỳ.

### Module 3: Quản lý Tài sản và Thiết bị (Asset \& Maintenance Management)

Đây là module tạo ra sự khác biệt so với các giải pháp thông thường, giúp ban quản lý kiểm soát chặt chẽ vòng đời của mọi thiết bị trong tòa nhà.

* **Quản lý Thiết bị khu vực công cộng:** Hồ sơ chi tiết các tài sản chung (Thang máy, máy phát điện, camera an ninh, hệ thống PCCC). Bao gồm thông tin nhà sản xuất, ngày lắp đặt, thời hạn bảo hành.
* **Quản lý Thiết bị theo hộ gia đình:** Danh sách các tài sản được chủ đầu tư bàn giao kèm theo căn hộ (Máy lạnh, bình nóng lạnh, tủ bếp, hệ thống smarthome nội khu).
* **Thiết lập Lịch trình Bảo trì định kỳ:** Tự động tạo lịch bảo trì dựa trên chu kỳ (hàng tháng, hàng quý, hàng năm) cho từng loại thiết bị.
* **Cảnh báo và Lịch sử thay thế:**

  * Hệ thống cảnh báo (Notification) tự động khi thiết bị sắp đến hạn bảo trì hoặc hết hạn bảo hành.
  * Lưu trữ toàn bộ lịch sử sửa chữa, thay thế linh kiện (Log) gắn liền với mã định danh của từng thiết bị.

### Module 4: Xử lý Sự cố và Điều phối công việc (Ticketing \& Helpdesk)

Module cốt lõi giúp số hóa quy trình tương tác giữa Cư dân, Ban quản lý và Bộ phận Kỹ thuật khi có vấn đề phát sinh.

* **Tiếp nhận yêu cầu (Ticket Creation):** Cho phép ghi nhận sự cố mới kèm theo các thông tin: Vị trí (căn hộ nào/khu vực nào), thiết bị hỏng hóc, mức độ nghiêm trọng, hình ảnh đính kèm và mô tả chi tiết.
* **Điều phối và Giao việc (Dispatching):** Trưởng ban quản lý có thể xem danh sách sự cố và Assign (giao việc) cho nhân viên kỹ thuật phù hợp, hoặc hệ thống tự động điều phối dựa trên chuyên môn (thợ điện, thợ nước).
* **Luồng trạng thái xử lý (Workflow Tracking):** Trạng thái của ticket được cập nhật theo thời gian thực: `Chờ tiếp nhận` -> `Đang xử lý` -> `Chờ linh kiện` -> `Hoàn thành`.
* **Ghi nhận vật tư \& Chi phí:** Kỹ thuật viên báo cáo lượng vật tư đã sử dụng và chi phí sửa chữa (nếu có) trực tiếp trên ticket để làm căn cứ thu phí hoặc hạch toán.
* **Nghiệm thu (Resolution):** Cư dân xác nhận sự cố đã được khắc phục và có thể để lại đánh giá (Rating/Review) về thái độ và chất lượng phục vụ của kỹ thuật viên.

### Module 5: Cổng thông tin Cư dân (Resident Portal)

Giao diện (Frontend/App) được thiết kế tinh gọn, tối ưu trải nghiệm (UX) dành riêng cho người dân sinh sống tại tòa nhà.

* **Báo cáo sự cố nhanh:** Cư dân chụp ảnh và gửi yêu cầu sửa chữa chỉ với vài thao tác cơ bản.
* **Theo dõi tiến độ:** Xem trạng thái sự cố do chính mình báo cáo đang được ai xử lý và dự kiến bao giờ hoàn thành.
* **Bảng tin thông báo:** Nhận các thông báo từ ban quản lý (Lịch cắt điện, cắt nước, bảo trì thang máy, v.v.) qua ứng dụng thay vì phải đọc bảng tin vật lý.

### Module 6: Báo cáo và Bảng điều khiển (Dashboard \& Analytics)

Module cung cấp công cụ phân tích số liệu giúp ban lãnh đạo giám sát chất lượng dịch vụ và ra quyết định.

* **Dashboard Tổng quan (Real-time):** Giao diện biểu đồ hiển thị nhanh số lượng cư dân, tỷ lệ lấp đầy căn hộ, tổng số sự cố phát sinh trong ngày/tuần.
* **Báo cáo Hiệu suất (SLA - Service Level Agreement):**

  * Thống kê thời gian phản hồi trung bình và thời gian xử lý sự cố.
  * Đánh giá KPI của từng nhân viên kỹ thuật dựa trên số lượng ticket hoàn thành và điểm đánh giá từ cư dân.
* **Báo cáo Thiết bị \& Bảo trì:** Xuất danh sách các thiết bị thường xuyên hỏng hóc (cần thay mới), chi phí vật tư đã tiêu hao trong tháng, và danh sách các thiết bị cần bảo trì trong tháng tới.

