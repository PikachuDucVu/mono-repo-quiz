# Quiz-App

## Thông tin sinh viên

- **Họ và tên**: Trần Đức Vũ
- **MSSV**: 2121051243
- **Lớp**: DCCTCT66_05C

## Giới thiệu dự án Quiz-App

Quiz-App là một ứng dụng câu hỏi trắc nghiệm và trò chơi giải đố kết hợp mô hình Gamification (Multiplayer). Ứng dụng nhằm mục đích đánh giá, kiểm tra kiến thức, đồng thời tạo ra sự hứng thú và vui vẻ cho người tham gia. Dự án bao gồm các thành phần quan trọng: Admin quản lý ứng dụng, ứng dụng Quiz trắc nghiệm, Gamification, và Máy chủ (Server).

## Các công nghệ sử dụng

- **Monorepo**: Quản lý, đơn giản hóa, cho phép chạy nhiều repo trên 1 thư mục dự án.
- **Admin quản lý**: React + Tailwindcss.
- **Frontend**: React + Tailwindcss.
- **Server**: Hono + NodeJS.
- **Database**: MongoDB + Redis.
- **Realtime Multiplayer**: Websocket.

## Demo

- **Frontend**: [https://quiz.ducvu.name.vn/](https://quiz.ducvu.name.vn/)
- **Server**: [https://api.ducvu.name.vn/](https://api.ducvu.name.vn/)
- **Admin quản lý**: [https://admin-quiz.ducvu.name.vn/](https://admin-quiz.ducvu.name.vn/)

## Hướng dẫn cài đặt

1. Clone repository:
   ```shell
   git clone https://github.com/PikachuDucVu/mono-repo-quiz
   ```
2. Chuyển vào thư mục dự án:
   ```shell
   cd mono-repo-quiz
   ```
3. Cài đặt dependencies:
   ```shell
   npm install
   ```
4. Khởi chạy ứng dụng:
   ```shell
   npm run dev
   ```

## Các chức năng

### Admin quản lý

1. **Xác thực**: Quản lý token và xác thực cho Admin.
2. **Quản lý người dùng**:
   - Đăng nhập Admin
   - Lấy danh sách và thông tin người dùng
   - Thêm, cập nhật, và xóa người dùng
3. **Quản lý câu hỏi và trò chơi**:
   - Lấy, thêm, cập nhật, và xóa bảng câu hỏi
   - Quản lý lịch sử người tham gia và thống kê câu hỏi

### Ứng dụng Quiz

1. **Người dùng & Xác thực**:
   - Đăng ký và đăng nhập người dùng
   - Xác thực token người dùng
   - Cập nhật hồ sơ người dùng
2. **Quản lý Câu hỏi**:
   - Thêm, cập nhật, và xóa bảng câu hỏi
   - Lấy danh sách bảng câu hỏi hiện có
   - Thực hiện và chấm điểm bài thi

### API Hệ thống đăng nhập chung

1. **Đăng ký**
   - Tạo tài khoản mới với email và mật khẩu
   - Mã hóa mật khẩu và cấp token
2. **Đăng nhập**
   - Xác thực email và mật khẩu
   - Cấp và xác minh token
3. **Cập nhật hồ sơ**
   - Cập nhật thông tin người dùng và mật khẩu
   - Xác thực thông tin trước khi cập nhật

Hệ thống quản lý người dùng cùng các chức năng Quiz và Admin đã có tính năng xác thực người dùng nhờ các API quản lý chung, kiểm tra phân quyền đầy đủ nhằm đảm bảo tính toàn vẹn và bảo mật dữ liệu.

```

```
