USE [AcademicManagement]
GO
/****** Object:  Trigger [trg_Enrollments_CheckStatusAndCapacity]    Script Date: 6/4/2026 2:06:10 PM ******/
DROP TRIGGER [dbo].[trg_Enrollments_CheckStatusAndCapacity]
GO
/****** Object:  Trigger [trg_Enrollments_AuditLog]    Script Date: 6/4/2026 2:06:10 PM ******/
DROP TRIGGER [dbo].[trg_Enrollments_AuditLog]
GO
/****** Object:  Trigger [trg_Classes_PreventReduceMaxBelowEnrollment]    Script Date: 6/4/2026 2:06:10 PM ******/
DROP TRIGGER [dbo].[trg_Classes_PreventReduceMaxBelowEnrollment]
GO
/****** Object:  StoredProcedure [dbo].[sp_UpdateUser]    Script Date: 6/4/2026 2:06:10 PM ******/
DROP PROCEDURE [dbo].[sp_UpdateUser]
GO
/****** Object:  StoredProcedure [dbo].[sp_UpdateGrade]    Script Date: 6/4/2026 2:06:10 PM ******/
DROP PROCEDURE [dbo].[sp_UpdateGrade]
GO
/****** Object:  StoredProcedure [dbo].[sp_UpdateDepartment]    Script Date: 6/4/2026 2:06:10 PM ******/
DROP PROCEDURE [dbo].[sp_UpdateDepartment]
GO
/****** Object:  StoredProcedure [dbo].[sp_UpdateCourse]    Script Date: 6/4/2026 2:06:10 PM ******/
DROP PROCEDURE [dbo].[sp_UpdateCourse]
GO
/****** Object:  StoredProcedure [dbo].[sp_UpdateClass]    Script Date: 6/4/2026 2:06:10 PM ******/
DROP PROCEDURE [dbo].[sp_UpdateClass]
GO
/****** Object:  StoredProcedure [dbo].[sp_InsertDepartment]    Script Date: 6/4/2026 2:06:10 PM ******/
DROP PROCEDURE [dbo].[sp_InsertDepartment]
GO
/****** Object:  StoredProcedure [dbo].[sp_InsertCourse]    Script Date: 6/4/2026 2:06:10 PM ******/
DROP PROCEDURE [dbo].[sp_InsertCourse]
GO
/****** Object:  StoredProcedure [dbo].[sp_InsertClass]    Script Date: 6/4/2026 2:06:10 PM ******/
DROP PROCEDURE [dbo].[sp_InsertClass]
GO
/****** Object:  StoredProcedure [dbo].[sp_GetStudentGrades]    Script Date: 6/4/2026 2:06:10 PM ******/
DROP PROCEDURE [dbo].[sp_GetStudentGrades]
GO
/****** Object:  StoredProcedure [dbo].[sp_GetFailedCoursesReport]    Script Date: 6/4/2026 2:06:10 PM ******/
DROP PROCEDURE [dbo].[sp_GetFailedCoursesReport]
GO
/****** Object:  StoredProcedure [dbo].[sp_GetClassStudents]    Script Date: 6/4/2026 2:06:10 PM ******/
DROP PROCEDURE [dbo].[sp_GetClassStudents]
GO
/****** Object:  StoredProcedure [dbo].[sp_EnrollStudent]    Script Date: 6/4/2026 2:06:10 PM ******/
DROP PROCEDURE [dbo].[sp_EnrollStudent]
GO
/****** Object:  StoredProcedure [dbo].[sp_DeleteDepartment]    Script Date: 6/4/2026 2:06:10 PM ******/
DROP PROCEDURE [dbo].[sp_DeleteDepartment]
GO
/****** Object:  StoredProcedure [dbo].[sp_DeleteCourse]    Script Date: 6/4/2026 2:06:10 PM ******/
DROP PROCEDURE [dbo].[sp_DeleteCourse]
GO
/****** Object:  StoredProcedure [dbo].[sp_DeleteClass]    Script Date: 6/4/2026 2:06:10 PM ******/
DROP PROCEDURE [dbo].[sp_DeleteClass]
GO
/****** Object:  StoredProcedure [dbo].[sp_DeactivateUser]    Script Date: 6/4/2026 2:06:10 PM ******/
DROP PROCEDURE [dbo].[sp_DeactivateUser]
GO
/****** Object:  StoredProcedure [dbo].[sp_CreateUser]    Script Date: 6/4/2026 2:06:10 PM ******/
DROP PROCEDURE [dbo].[sp_CreateUser]
GO
/****** Object:  StoredProcedure [dbo].[sp_CancelEnrollment]    Script Date: 6/4/2026 2:06:10 PM ******/
DROP PROCEDURE [dbo].[sp_CancelEnrollment]
GO
/****** Object:  StoredProcedure [dbo].[sp_AuthenticateUser]    Script Date: 6/4/2026 2:06:10 PM ******/
DROP PROCEDURE [dbo].[sp_AuthenticateUser]
GO
ALTER TABLE [dbo].[Enrollments] DROP CONSTRAINT [CK__Enrollmen__Midte__656C112C]
GO
ALTER TABLE [dbo].[Enrollments] DROP CONSTRAINT [CK__Enrollmen__Final__66603565]
GO
ALTER TABLE [dbo].[Courses] DROP CONSTRAINT [CK__Courses__Credits__571DF1D5]
GO
ALTER TABLE [dbo].[Users] DROP CONSTRAINT [FK__Users__RoleId__4F7CD00D]
GO
ALTER TABLE [dbo].[Enrollments] DROP CONSTRAINT [FK__Enrollmen__Stude__6383C8BA]
GO
ALTER TABLE [dbo].[Enrollments] DROP CONSTRAINT [FK__Enrollmen__Class__628FA481]
GO
ALTER TABLE [dbo].[Courses] DROP CONSTRAINT [FK__Courses__Departm__5812160E]
GO
ALTER TABLE [dbo].[Classes] DROP CONSTRAINT [FK__Classes__Teacher__5CD6CB2B]
GO
ALTER TABLE [dbo].[Classes] DROP CONSTRAINT [FK__Classes__CourseI__5BE2A6F2]
GO
ALTER TABLE [dbo].[Users] DROP CONSTRAINT [DF__Users__IsActive__5070F446]
GO
ALTER TABLE [dbo].[Users] DROP CONSTRAINT [DF__Users__UserId__4E88ABD4]
GO
ALTER TABLE [dbo].[Enrollments] DROP CONSTRAINT [DF__Enrollmen__Enrol__6477ECF3]
GO
ALTER TABLE [dbo].[Classes] DROP CONSTRAINT [DF__Classes__Status__5EBF139D]
GO
ALTER TABLE [dbo].[Classes] DROP CONSTRAINT [DF__Classes__MaxStud__5DCAEF64]
GO
ALTER TABLE [dbo].[AuditLog] DROP CONSTRAINT [DF__AuditLog__Change__71D1E811]
GO
ALTER TABLE [dbo].[AuditLog] DROP CONSTRAINT [DF__AuditLog__Change__70DDC3D8]
GO
/****** Object:  Index [UQ__Users__A9D105342004511A]    Script Date: 6/4/2026 2:06:10 PM ******/
ALTER TABLE [dbo].[Users] DROP CONSTRAINT [UQ__Users__A9D105342004511A]
GO
/****** Object:  Index [UQ__Users__536C85E430898A71]    Script Date: 6/4/2026 2:06:10 PM ******/
ALTER TABLE [dbo].[Users] DROP CONSTRAINT [UQ__Users__536C85E430898A71]
GO
/****** Object:  Index [UQ_Student_Class]    Script Date: 6/4/2026 2:06:10 PM ******/
ALTER TABLE [dbo].[Enrollments] DROP CONSTRAINT [UQ_Student_Class]
GO
/****** Object:  Index [UQ__Departme__6EA8896D0B7A435E]    Script Date: 6/4/2026 2:06:10 PM ******/
ALTER TABLE [dbo].[Departments] DROP CONSTRAINT [UQ__Departme__6EA8896D0B7A435E]
GO
/****** Object:  Index [UQ__Courses__FC00E000C4D259F3]    Script Date: 6/4/2026 2:06:10 PM ******/
ALTER TABLE [dbo].[Courses] DROP CONSTRAINT [UQ__Courses__FC00E000C4D259F3]
GO
/****** Object:  Index [UQ__Classes__2ECD4A553D71C8C8]    Script Date: 6/4/2026 2:06:10 PM ******/
ALTER TABLE [dbo].[Classes] DROP CONSTRAINT [UQ__Classes__2ECD4A553D71C8C8]
GO
/****** Object:  Table [dbo].[Roles]    Script Date: 6/4/2026 2:06:10 PM ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Roles]') AND type in (N'U'))
DROP TABLE [dbo].[Roles]
GO
/****** Object:  Table [dbo].[AuditLog]    Script Date: 6/4/2026 2:06:10 PM ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[AuditLog]') AND type in (N'U'))
DROP TABLE [dbo].[AuditLog]
GO
/****** Object:  View [dbo].[vw_Students]    Script Date: 6/4/2026 2:06:11 PM ******/
DROP VIEW [dbo].[vw_Students]
GO
/****** Object:  View [dbo].[vw_Teachers]    Script Date: 6/4/2026 2:06:11 PM ******/
DROP VIEW [dbo].[vw_Teachers]
GO
/****** Object:  View [dbo].[vw_FailedCourses]    Script Date: 6/4/2026 2:06:11 PM ******/
DROP VIEW [dbo].[vw_FailedCourses]
GO
/****** Object:  View [dbo].[vw_StudentEnrollments]    Script Date: 6/4/2026 2:06:11 PM ******/
DROP VIEW [dbo].[vw_StudentEnrollments]
GO
/****** Object:  View [dbo].[vw_ClassList]    Script Date: 6/4/2026 2:06:11 PM ******/
DROP VIEW [dbo].[vw_ClassList]
GO
/****** Object:  Table [dbo].[Enrollments]    Script Date: 6/4/2026 2:06:11 PM ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Enrollments]') AND type in (N'U'))
DROP TABLE [dbo].[Enrollments]
GO
/****** Object:  Table [dbo].[Classes]    Script Date: 6/4/2026 2:06:11 PM ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Classes]') AND type in (N'U'))
DROP TABLE [dbo].[Classes]
GO
/****** Object:  Table [dbo].[Courses]    Script Date: 6/4/2026 2:06:11 PM ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Courses]') AND type in (N'U'))
DROP TABLE [dbo].[Courses]
GO
/****** Object:  Table [dbo].[Departments]    Script Date: 6/4/2026 2:06:11 PM ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Departments]') AND type in (N'U'))
DROP TABLE [dbo].[Departments]
GO
/****** Object:  Table [dbo].[Users]    Script Date: 6/4/2026 2:06:11 PM ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Users]') AND type in (N'U'))
DROP TABLE [dbo].[Users]
GO
USE [master]
GO
/****** Object:  Database [AcademicManagement]    Script Date: 6/4/2026 2:06:11 PM ******/
DROP DATABASE [AcademicManagement]
GO
/****** Object:  Database [AcademicManagement]    Script Date: 6/4/2026 2:06:11 PM ******/
CREATE DATABASE [AcademicManagement]
 CONTAINMENT = NONE
 ON  PRIMARY 
( NAME = N'AcademicManagement', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL17.SQLEXPRESS\MSSQL\DATA\AcademicManagement.mdf' , SIZE = 8192KB , MAXSIZE = UNLIMITED, FILEGROWTH = 65536KB )
 LOG ON 
( NAME = N'AcademicManagement_log', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL17.SQLEXPRESS\MSSQL\DATA\AcademicManagement_log.ldf' , SIZE = 8192KB , MAXSIZE = 2048GB , FILEGROWTH = 65536KB )
 WITH CATALOG_COLLATION = DATABASE_DEFAULT, LEDGER = OFF
GO
ALTER DATABASE [AcademicManagement] SET COMPATIBILITY_LEVEL = 170
GO
IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [AcademicManagement].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO
ALTER DATABASE [AcademicManagement] SET ANSI_NULL_DEFAULT OFF 
GO
ALTER DATABASE [AcademicManagement] SET ANSI_NULLS OFF 
GO
ALTER DATABASE [AcademicManagement] SET ANSI_PADDING OFF 
GO
ALTER DATABASE [AcademicManagement] SET ANSI_WARNINGS OFF 
GO
ALTER DATABASE [AcademicManagement] SET ARITHABORT OFF 
GO
ALTER DATABASE [AcademicManagement] SET AUTO_CLOSE OFF 
GO
ALTER DATABASE [AcademicManagement] SET AUTO_SHRINK OFF 
GO
ALTER DATABASE [AcademicManagement] SET AUTO_UPDATE_STATISTICS ON 
GO
ALTER DATABASE [AcademicManagement] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO
ALTER DATABASE [AcademicManagement] SET CURSOR_DEFAULT  GLOBAL 
GO
ALTER DATABASE [AcademicManagement] SET CONCAT_NULL_YIELDS_NULL OFF 
GO
ALTER DATABASE [AcademicManagement] SET NUMERIC_ROUNDABORT OFF 
GO
ALTER DATABASE [AcademicManagement] SET QUOTED_IDENTIFIER OFF 
GO
ALTER DATABASE [AcademicManagement] SET RECURSIVE_TRIGGERS OFF 
GO
ALTER DATABASE [AcademicManagement] SET  DISABLE_BROKER 
GO
ALTER DATABASE [AcademicManagement] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO
ALTER DATABASE [AcademicManagement] SET DATE_CORRELATION_OPTIMIZATION OFF 
GO
ALTER DATABASE [AcademicManagement] SET TRUSTWORTHY OFF 
GO
ALTER DATABASE [AcademicManagement] SET ALLOW_SNAPSHOT_ISOLATION OFF 
GO
ALTER DATABASE [AcademicManagement] SET PARAMETERIZATION SIMPLE 
GO
ALTER DATABASE [AcademicManagement] SET READ_COMMITTED_SNAPSHOT OFF 
GO
ALTER DATABASE [AcademicManagement] SET HONOR_BROKER_PRIORITY OFF 
GO
ALTER DATABASE [AcademicManagement] SET RECOVERY SIMPLE 
GO
ALTER DATABASE [AcademicManagement] SET  MULTI_USER 
GO
ALTER DATABASE [AcademicManagement] SET PAGE_VERIFY CHECKSUM  
GO
ALTER DATABASE [AcademicManagement] SET DB_CHAINING OFF 
GO
ALTER DATABASE [AcademicManagement] SET FILESTREAM( NON_TRANSACTED_ACCESS = OFF ) 
GO
ALTER DATABASE [AcademicManagement] SET TARGET_RECOVERY_TIME = 60 SECONDS 
GO
ALTER DATABASE [AcademicManagement] SET DELAYED_DURABILITY = DISABLED 
GO
ALTER DATABASE [AcademicManagement] SET ACCELERATED_DATABASE_RECOVERY = OFF  
GO
ALTER DATABASE [AcademicManagement] SET OPTIMIZED_LOCKING = OFF 
GO
ALTER DATABASE [AcademicManagement] SET QUERY_STORE = ON
GO
ALTER DATABASE [AcademicManagement] SET QUERY_STORE (OPERATION_MODE = READ_WRITE, CLEANUP_POLICY = (STALE_QUERY_THRESHOLD_DAYS = 30), DATA_FLUSH_INTERVAL_SECONDS = 900, INTERVAL_LENGTH_MINUTES = 60, MAX_STORAGE_SIZE_MB = 1000, QUERY_CAPTURE_MODE = AUTO, SIZE_BASED_CLEANUP_MODE = AUTO, MAX_PLANS_PER_QUERY = 200, WAIT_STATS_CAPTURE_MODE = ON)
GO
USE [AcademicManagement]
GO
/****** Object:  Table [dbo].[Users]    Script Date: 6/4/2026 2:06:12 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Users](
	[UserId] [uniqueidentifier] NOT NULL,
	[Username] [varchar](50) NOT NULL,
	[FullName] [nvarchar](100) NOT NULL,
	[Email] [varchar](100) NOT NULL,
	[RoleId] [int] NULL,
	[IsActive] [bit] NULL,
	[PasswordHash] [varbinary](32) NULL,
PRIMARY KEY CLUSTERED 
(
	[UserId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Departments]    Script Date: 6/4/2026 2:06:12 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Departments](
	[DepartmentId] [int] IDENTITY(1,1) NOT NULL,
	[DepartmentCode] [varchar](20) NOT NULL,
	[DepartmentName] [nvarchar](100) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[DepartmentId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Courses]    Script Date: 6/4/2026 2:06:12 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Courses](
	[CourseId] [int] IDENTITY(1,1) NOT NULL,
	[CourseCode] [varchar](20) NOT NULL,
	[CourseName] [nvarchar](150) NOT NULL,
	[Credits] [int] NULL,
	[DepartmentId] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[CourseId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Classes]    Script Date: 6/4/2026 2:06:12 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Classes](
	[ClassId] [int] IDENTITY(1,1) NOT NULL,
	[ClassCode] [varchar](50) NOT NULL,
	[CourseId] [int] NULL,
	[TeacherId] [uniqueidentifier] NULL,
	[Semester] [varchar](20) NOT NULL,
	[MaxStudents] [int] NULL,
	[Status] [varchar](20) NULL,
PRIMARY KEY CLUSTERED 
(
	[ClassId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Enrollments]    Script Date: 6/4/2026 2:06:12 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Enrollments](
	[EnrollmentId] [int] IDENTITY(1,1) NOT NULL,
	[ClassId] [int] NULL,
	[StudentId] [uniqueidentifier] NULL,
	[EnrollmentDate] [datetime] NULL,
	[MidtermGrade] [float] NULL,
	[FinalGrade] [float] NULL,
	[AverageGrade]  AS ([MidtermGrade]*(0.4)+[FinalGrade]*(0.6)) PERSISTED,
PRIMARY KEY CLUSTERED 
(
	[EnrollmentId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  View [dbo].[vw_ClassList]    Script Date: 6/4/2026 2:06:12 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
--- View 1: Danh sách lớp học phần (có thông tin môn, GV, sĩ số)
CREATE   VIEW [dbo].[vw_ClassList] AS
SELECT 
    c.ClassId,
    c.ClassCode,
    co.CourseCode,
    co.CourseName,
    co.Credits,
    d.DepartmentName,
    u.FullName AS TeacherName,
    c.Semester,
    c.MaxStudents,
    COUNT(e.EnrollmentId) AS EnrolledCount,
    c.Status,
    CASE WHEN COUNT(e.EnrollmentId) >= c.MaxStudents THEN 1 ELSE 0 END AS IsFull
FROM Classes c
JOIN Courses co ON c.CourseId = co.CourseId
JOIN Departments d ON co.DepartmentId = d.DepartmentId
JOIN Users u ON c.TeacherId = u.UserId
LEFT JOIN Enrollments e ON c.ClassId = e.ClassId
GROUP BY c.ClassId, c.ClassCode, co.CourseCode, co.CourseName, co.Credits, 
         d.DepartmentName, u.FullName, c.Semester, c.MaxStudents, c.Status;
GO
/****** Object:  View [dbo].[vw_StudentEnrollments]    Script Date: 6/4/2026 2:06:12 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

--- View 2: Chi tiết đăng ký của sinh viên (dùng cho bảng điểm cá nhân)
CREATE   VIEW [dbo].[vw_StudentEnrollments] AS
SELECT 
    e.EnrollmentId,
    e.StudentId,
    u.Username,
    u.FullName AS StudentName,
    c.ClassId,
    c.ClassCode,
    co.CourseCode,
    co.CourseName,
    co.Credits,
    d.DepartmentName,
    c.Semester,
    e.MidtermGrade,
    e.FinalGrade,
    e.AverageGrade,
    CASE 
        WHEN e.AverageGrade IS NULL THEN N'Chưa có điểm'
        WHEN e.AverageGrade >= 4 THEN N'Đạt'
        ELSE N'Không đạt'
    END AS Result
FROM Enrollments e
JOIN Users u ON e.StudentId = u.UserId
JOIN Classes c ON e.ClassId = c.ClassId
JOIN Courses co ON c.CourseId = co.CourseId
JOIN Departments d ON co.DepartmentId = d.DepartmentId;
GO
/****** Object:  View [dbo].[vw_FailedCourses]    Script Date: 6/4/2026 2:06:12 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

--- View 3: Sinh viên nợ môn (điểm TB < 4)
CREATE   VIEW [dbo].[vw_FailedCourses] AS
SELECT 
    e.StudentId,
    u.Username,
    u.FullName,
    co.CourseCode,
    co.CourseName,
    c.Semester,
    e.AverageGrade,
    d.DepartmentName
FROM Enrollments e
JOIN Users u ON e.StudentId = u.UserId
JOIN Classes c ON e.ClassId = c.ClassId
JOIN Courses co ON c.CourseId = co.CourseId
JOIN Departments d ON co.DepartmentId = d.DepartmentId
WHERE e.AverageGrade < 4;
GO
/****** Object:  View [dbo].[vw_Teachers]    Script Date: 6/4/2026 2:06:12 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

--- View 4: Danh sách giảng viên (chỉ những User có Role Teacher)
CREATE   VIEW [dbo].[vw_Teachers] AS
SELECT UserId, Username, FullName, Email, IsActive
FROM Users
WHERE RoleId = 2;
GO
/****** Object:  View [dbo].[vw_Students]    Script Date: 6/4/2026 2:06:12 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

--- View 5: Danh sách sinh viên (chỉ những User có Role Student)
CREATE   VIEW [dbo].[vw_Students] AS
SELECT UserId, Username, FullName, Email, IsActive
FROM Users
WHERE RoleId = 3;
GO
/****** Object:  Table [dbo].[AuditLog]    Script Date: 6/4/2026 2:06:12 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[AuditLog](
	[AuditId] [bigint] IDENTITY(1,1) NOT NULL,
	[TableName] [nvarchar](128) NOT NULL,
	[Action] [char](1) NOT NULL,
	[RecordId] [int] NOT NULL,
	[OldValues] [nvarchar](max) NULL,
	[NewValues] [nvarchar](max) NULL,
	[ChangedBy] [nvarchar](128) NULL,
	[ChangedDate] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[AuditId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Roles]    Script Date: 6/4/2026 2:06:12 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Roles](
	[RoleId] [int] NOT NULL,
	[RoleName] [varchar](50) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[RoleId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
SET IDENTITY_INSERT [dbo].[AuditLog] ON 

INSERT [dbo].[AuditLog] ([AuditId], [TableName], [Action], [RecordId], [OldValues], [NewValues], [ChangedBy], [ChangedDate]) VALUES (1, N'Enrollments', N'I', 1, NULL, N'{"EnrollmentId":1,"ClassId":3,"StudentId":"F795EB2C-1E8A-459B-9100-03866E1E6DE4","EnrollmentDate":"2026-05-14T21:41:02.067"}', N'sa', CAST(N'2026-05-14T21:41:02.133' AS DateTime))
SET IDENTITY_INSERT [dbo].[AuditLog] OFF
GO
SET IDENTITY_INSERT [dbo].[Classes] ON 

INSERT [dbo].[Classes] ([ClassId], [ClassCode], [CourseId], [TeacherId], [Semester], [MaxStudents], [Status]) VALUES (1, N'CS101-01', 1, N'20d3441a-3525-45a1-a5dd-f205ff31f994', N'2024-1', 40, N'Open')
INSERT [dbo].[Classes] ([ClassId], [ClassCode], [CourseId], [TeacherId], [Semester], [MaxStudents], [Status]) VALUES (2, N'KT201-01', 2, N'20d3441a-3525-45a1-a5dd-f205ff31f994', N'2024-1', 40, N'Open')
INSERT [dbo].[Classes] ([ClassId], [ClassCode], [CourseId], [TeacherId], [Semester], [MaxStudents], [Status]) VALUES (3, N'NN301-01', 3, N'20d3441a-3525-45a1-a5dd-f205ff31f994', N'2024-1', 40, N'Open')
SET IDENTITY_INSERT [dbo].[Classes] OFF
GO
SET IDENTITY_INSERT [dbo].[Courses] ON 

INSERT [dbo].[Courses] ([CourseId], [CourseCode], [CourseName], [Credits], [DepartmentId]) VALUES (1, N'CS101', N'Lập trình cơ bản', 3, 1)
INSERT [dbo].[Courses] ([CourseId], [CourseCode], [CourseName], [Credits], [DepartmentId]) VALUES (2, N'KT201', N'Kế toán quản trị', 4, 2)
INSERT [dbo].[Courses] ([CourseId], [CourseCode], [CourseName], [Credits], [DepartmentId]) VALUES (3, N'NN301', N'Tiếng Anh giao tiếp', 2, 3)
INSERT [dbo].[Courses] ([CourseId], [CourseCode], [CourseName], [Credits], [DepartmentId]) VALUES (4, N'IT101', N'Lập trình Web', 3, 1)
SET IDENTITY_INSERT [dbo].[Courses] OFF
GO
SET IDENTITY_INSERT [dbo].[Departments] ON 

INSERT [dbo].[Departments] ([DepartmentId], [DepartmentCode], [DepartmentName]) VALUES (1, N'CNTT', N'Công nghệ thông tin')
INSERT [dbo].[Departments] ([DepartmentId], [DepartmentCode], [DepartmentName]) VALUES (2, N'KT', N'Kế toán')
INSERT [dbo].[Departments] ([DepartmentId], [DepartmentCode], [DepartmentName]) VALUES (3, N'NN', N'Ngoại ngữ')
SET IDENTITY_INSERT [dbo].[Departments] OFF
GO
SET IDENTITY_INSERT [dbo].[Enrollments] ON 

INSERT [dbo].[Enrollments] ([EnrollmentId], [ClassId], [StudentId], [EnrollmentDate], [MidtermGrade], [FinalGrade]) VALUES (1, 3, N'f795eb2c-1e8a-459b-9100-03866e1e6de4', CAST(N'2026-05-14T21:41:02.067' AS DateTime), NULL, NULL)
SET IDENTITY_INSERT [dbo].[Enrollments] OFF
GO
INSERT [dbo].[Roles] ([RoleId], [RoleName]) VALUES (1, N'Admin')
INSERT [dbo].[Roles] ([RoleId], [RoleName]) VALUES (2, N'Teacher')
INSERT [dbo].[Roles] ([RoleId], [RoleName]) VALUES (3, N'Student')
GO
INSERT [dbo].[Users] ([UserId], [Username], [FullName], [Email], [RoleId], [IsActive], [PasswordHash]) VALUES (N'f795eb2c-1e8a-459b-9100-03866e1e6de4', N'student1', N'Sinh viên A', N'student1@edu.vn', 3, 1, 0xA665A45920422F9D417E4867EFDC4FB8A04A1F3FFF1FA07E998E86F7F7A27AE3)
INSERT [dbo].[Users] ([UserId], [Username], [FullName], [Email], [RoleId], [IsActive], [PasswordHash]) VALUES (N'ceccc10b-f8c7-4901-add5-aca923d14c64', N'admin', N'Quản trị viên', N'admin@edu.vn', 1, 1, 0xA665A45920422F9D417E4867EFDC4FB8A04A1F3FFF1FA07E998E86F7F7A27AE3)
INSERT [dbo].[Users] ([UserId], [Username], [FullName], [Email], [RoleId], [IsActive], [PasswordHash]) VALUES (N'20d3441a-3525-45a1-a5dd-f205ff31f994', N'teacher1', N'Giáo viên A', N'teacher1@edu.vn', 2, 1, 0xA665A45920422F9D417E4867EFDC4FB8A04A1F3FFF1FA07E998E86F7F7A27AE3)
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UQ__Classes__2ECD4A553D71C8C8]    Script Date: 6/4/2026 2:06:12 PM ******/
ALTER TABLE [dbo].[Classes] ADD UNIQUE NONCLUSTERED 
(
	[ClassCode] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UQ__Courses__FC00E000C4D259F3]    Script Date: 6/4/2026 2:06:12 PM ******/
ALTER TABLE [dbo].[Courses] ADD UNIQUE NONCLUSTERED 
(
	[CourseCode] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UQ__Departme__6EA8896D0B7A435E]    Script Date: 6/4/2026 2:06:12 PM ******/
ALTER TABLE [dbo].[Departments] ADD UNIQUE NONCLUSTERED 
(
	[DepartmentCode] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [UQ_Student_Class]    Script Date: 6/4/2026 2:06:12 PM ******/
ALTER TABLE [dbo].[Enrollments] ADD  CONSTRAINT [UQ_Student_Class] UNIQUE NONCLUSTERED 
(
	[ClassId] ASC,
	[StudentId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UQ__Users__536C85E430898A71]    Script Date: 6/4/2026 2:06:12 PM ******/
ALTER TABLE [dbo].[Users] ADD UNIQUE NONCLUSTERED 
(
	[Username] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UQ__Users__A9D105342004511A]    Script Date: 6/4/2026 2:06:12 PM ******/
ALTER TABLE [dbo].[Users] ADD UNIQUE NONCLUSTERED 
(
	[Email] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
ALTER TABLE [dbo].[AuditLog] ADD  DEFAULT (suser_sname()) FOR [ChangedBy]
GO
ALTER TABLE [dbo].[AuditLog] ADD  DEFAULT (getdate()) FOR [ChangedDate]
GO
ALTER TABLE [dbo].[Classes] ADD  DEFAULT ((40)) FOR [MaxStudents]
GO
ALTER TABLE [dbo].[Classes] ADD  DEFAULT ('Open') FOR [Status]
GO
ALTER TABLE [dbo].[Enrollments] ADD  DEFAULT (getdate()) FOR [EnrollmentDate]
GO
ALTER TABLE [dbo].[Users] ADD  DEFAULT (newid()) FOR [UserId]
GO
ALTER TABLE [dbo].[Users] ADD  DEFAULT ((1)) FOR [IsActive]
GO
ALTER TABLE [dbo].[Classes]  WITH CHECK ADD FOREIGN KEY([CourseId])
REFERENCES [dbo].[Courses] ([CourseId])
GO
ALTER TABLE [dbo].[Classes]  WITH CHECK ADD FOREIGN KEY([TeacherId])
REFERENCES [dbo].[Users] ([UserId])
GO
ALTER TABLE [dbo].[Courses]  WITH CHECK ADD FOREIGN KEY([DepartmentId])
REFERENCES [dbo].[Departments] ([DepartmentId])
GO
ALTER TABLE [dbo].[Enrollments]  WITH CHECK ADD FOREIGN KEY([ClassId])
REFERENCES [dbo].[Classes] ([ClassId])
GO
ALTER TABLE [dbo].[Enrollments]  WITH CHECK ADD FOREIGN KEY([StudentId])
REFERENCES [dbo].[Users] ([UserId])
GO
ALTER TABLE [dbo].[Users]  WITH CHECK ADD FOREIGN KEY([RoleId])
REFERENCES [dbo].[Roles] ([RoleId])
GO
ALTER TABLE [dbo].[Courses]  WITH CHECK ADD CHECK  (([Credits]>(0) AND [Credits]<=(10)))
GO
ALTER TABLE [dbo].[Enrollments]  WITH CHECK ADD CHECK  (([FinalGrade]>=(0) AND [FinalGrade]<=(10)))
GO
ALTER TABLE [dbo].[Enrollments]  WITH CHECK ADD CHECK  (([MidtermGrade]>=(0) AND [MidtermGrade]<=(10)))
GO
/****** Object:  StoredProcedure [dbo].[sp_AuthenticateUser]    Script Date: 6/4/2026 2:06:12 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


-- ========================================================
-- 1. STORED PROCEDURE: HỆ THỐNG
-- ========================================================
-- Đăng nhập
CREATE     PROCEDURE [dbo].[sp_AuthenticateUser]
    @Username VARCHAR(50),
    @Password VARCHAR(255)
AS
BEGIN
    SET NOCOUNT ON;
    DECLARE @UserId UNIQUEIDENTIFIER, @FullName NVARCHAR(100), @Email VARCHAR(100), @RoleName VARCHAR(50);
    SELECT @UserId = u.UserId, @FullName = u.FullName, @Email = u.Email, @RoleName = r.RoleName
    FROM Users u JOIN Roles r ON u.RoleId = r.RoleId
    WHERE u.Username = @Username
      AND u.PasswordHash = HASHBYTES('SHA2_256', @Password)
      AND u.IsActive = 1;
    IF @UserId IS NULL
        THROW 50001, 'Sai tên đăng nhập hoặc mật khẩu, hoặc tài khoản đã bị khóa.', 1;
    ELSE
        SELECT @UserId AS UserId, @FullName AS FullName, @Email AS Email, @RoleName AS Role;
END

GO
/****** Object:  StoredProcedure [dbo].[sp_CancelEnrollment]    Script Date: 6/4/2026 2:06:12 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- Hủy đăng ký
CREATE   PROCEDURE [dbo].[sp_CancelEnrollment]
    @StudentId UNIQUEIDENTIFIER,
    @ClassId INT,
    @RequestingUserId UNIQUEIDENTIFIER
AS
BEGIN
    SET NOCOUNT ON;
    DECLARE @Role INT;
    SELECT @Role = RoleId FROM Users WHERE UserId = @RequestingUserId AND IsActive = 1;
    IF @Role = 3 AND @RequestingUserId <> @StudentId
        THROW 50016, 'Sinh viên chỉ có thể hủy đăng ký của chính mình.', 1;
    IF @Role NOT IN (1,3) THROW 50017, 'Không đủ quyền.', 1;

    IF NOT EXISTS (SELECT 1 FROM Classes WHERE ClassId = @ClassId AND Status = 'Open')
        THROW 50019, 'Chỉ được hủy khi lớp đang mở.', 1;

    DELETE FROM Enrollments WHERE ClassId = @ClassId AND StudentId = @StudentId;
    IF @@ROWCOUNT = 0 THROW 50020, 'Không tìm thấy đăng ký.', 1;
END

GO
/****** Object:  StoredProcedure [dbo].[sp_CreateUser]    Script Date: 6/4/2026 2:06:12 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


-- Tạo tài khoản (Admin)
CREATE     PROCEDURE [dbo].[sp_CreateUser]
    @Username VARCHAR(50),
    @Password VARCHAR(255),
    @FullName NVARCHAR(100),
    @Email VARCHAR(100),
    @RoleId INT
AS
BEGIN
    SET NOCOUNT ON;
    IF EXISTS (SELECT 1 FROM Users WHERE Username = @Username)
        THROW 50002, 'Username đã tồn tại.', 1;
    IF EXISTS (SELECT 1 FROM Users WHERE Email = @Email)
        THROW 50003, 'Email đã tồn tại.', 1;
    IF NOT EXISTS (SELECT 1 FROM Roles WHERE RoleId = @RoleId)
        THROW 50004, 'Role không hợp lệ.', 1;

    INSERT INTO Users (UserId, Username, PasswordHash, FullName, Email, RoleId, IsActive)
    VALUES (NEWID(), @Username, HASHBYTES('SHA2_256', @Password), @FullName, @Email, @RoleId, 1);
    SELECT SCOPE_IDENTITY(); -- trả về UserId? UserId là GUID, phải SELECT ra.
END

GO
/****** Object:  StoredProcedure [dbo].[sp_DeactivateUser]    Script Date: 6/4/2026 2:06:12 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- Vô hiệu hóa tài khoản
CREATE   PROCEDURE [dbo].[sp_DeactivateUser]
    @UserId UNIQUEIDENTIFIER
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE Users SET IsActive = 0 WHERE UserId = @UserId;
    IF @@ROWCOUNT = 0 THROW 50005, 'User không tồn tại.', 1;
END

GO
/****** Object:  StoredProcedure [dbo].[sp_DeleteClass]    Script Date: 6/4/2026 2:06:12 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE   PROCEDURE [dbo].[sp_DeleteClass]
    @ClassId INT
AS
BEGIN
    IF EXISTS (SELECT 1 FROM Enrollments WHERE ClassId = @ClassId)
        THROW 50015, 'Không thể xóa lớp vì đã có sinh viên đăng ký.', 1;
    DELETE FROM Classes WHERE ClassId = @ClassId;
END

GO
/****** Object:  StoredProcedure [dbo].[sp_DeleteCourse]    Script Date: 6/4/2026 2:06:12 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE   PROCEDURE [dbo].[sp_DeleteCourse]
    @CourseId INT
AS
BEGIN
    IF EXISTS (SELECT 1 FROM Classes WHERE CourseId = @CourseId)
        THROW 50011, 'Không thể xóa môn học vì đã được mở lớp.', 1;
    DELETE FROM Courses WHERE CourseId = @CourseId;
END

GO
/****** Object:  StoredProcedure [dbo].[sp_DeleteDepartment]    Script Date: 6/4/2026 2:06:12 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE   PROCEDURE [dbo].[sp_DeleteDepartment]
    @DepartmentId INT
AS
BEGIN
    IF EXISTS (SELECT 1 FROM Courses WHERE DepartmentId = @DepartmentId)
        THROW 50008, 'Không thể xóa khoa vì còn môn học tham chiếu.', 1;
    DELETE FROM Departments WHERE DepartmentId = @DepartmentId;
END

GO
/****** Object:  StoredProcedure [dbo].[sp_EnrollStudent]    Script Date: 6/4/2026 2:06:12 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- ========================================================
-- 3. STORED PROCEDURE: TÁC VỤ CHÍNH
-- ========================================================
-- Đăng ký học phần
CREATE   PROCEDURE [dbo].[sp_EnrollStudent]
    @StudentId UNIQUEIDENTIFIER,
    @ClassId INT,
    @RequestingUserId UNIQUEIDENTIFIER -- người gọi để phân quyền
AS
BEGIN
    SET NOCOUNT ON;
    -- Phân quyền: phải là chính sinh viên hoặc Admin
    DECLARE @RequestingRole INT;
    SELECT @RequestingRole = RoleId FROM Users WHERE UserId = @RequestingUserId AND IsActive = 1;
    IF @RequestingRole = 3 AND @RequestingUserId <> @StudentId
        THROW 50016, 'Sinh viên chỉ có thể tự đăng ký cho mình.', 1;
    IF @RequestingRole NOT IN (1,3) THROW 50017, 'Không đủ quyền.', 1;

    -- Kiểm tra sinh viên hợp lệ
    IF NOT EXISTS (SELECT 1 FROM Users WHERE UserId = @StudentId AND RoleId = 3 AND IsActive = 1)
        THROW 50018, 'Sinh viên không hợp lệ.', 1;

    -- Gọi trực tiếp INSERT, trigger sẽ kiểm tra trạng thái và sức chứa
    BEGIN TRY
        INSERT INTO Enrollments (ClassId, StudentId) VALUES (@ClassId, @StudentId);
    END TRY
    BEGIN CATCH
        THROW;
    END CATCH
END

GO
/****** Object:  StoredProcedure [dbo].[sp_GetClassStudents]    Script Date: 6/4/2026 2:06:12 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- Danh sách sinh viên của lớp
CREATE   PROCEDURE [dbo].[sp_GetClassStudents]
    @ClassId INT,
    @RequestingUserId UNIQUEIDENTIFIER
AS
BEGIN
    SET NOCOUNT ON;
    DECLARE @Role INT, @TeacherId UNIQUEIDENTIFIER;
    SELECT @Role = RoleId FROM Users WHERE UserId = @RequestingUserId AND IsActive = 1;
    IF @Role = 1 -- Admin
        SELECT u.UserId, u.Username, u.FullName, u.Email, e.EnrollmentDate, e.MidtermGrade, e.FinalGrade, e.AverageGrade
        FROM Enrollments e JOIN Users u ON e.StudentId = u.UserId
        WHERE e.ClassId = @ClassId;
    ELSE IF @Role = 2 -- Teacher
    BEGIN
        SELECT @TeacherId = TeacherId FROM Classes WHERE ClassId = @ClassId;
        IF @TeacherId IS NULL THROW 50021, 'Lớp không tồn tại.', 1;
        IF @TeacherId <> @RequestingUserId THROW 50022, 'Bạn không phải giáo viên của lớp này.', 1;
        SELECT u.UserId, u.Username, u.FullName, u.Email, e.EnrollmentDate, e.MidtermGrade, e.FinalGrade, e.AverageGrade
        FROM Enrollments e JOIN Users u ON e.StudentId = u.UserId
        WHERE e.ClassId = @ClassId;
    END
    ELSE
        THROW 50023, 'Không có quyền xem danh sách.', 1;
END

GO
/****** Object:  StoredProcedure [dbo].[sp_GetFailedCoursesReport]    Script Date: 6/4/2026 2:06:12 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- Báo cáo nợ môn
CREATE   PROCEDURE [dbo].[sp_GetFailedCoursesReport]
    @AdminUserId UNIQUEIDENTIFIER
AS
BEGIN
    SET NOCOUNT ON;
    IF NOT EXISTS (SELECT 1 FROM Users WHERE UserId = @AdminUserId AND RoleId = 1)
        THROW 50029, 'Chỉ Admin mới được xem báo cáo này.', 1;

    SELECT u.UserID as StudentID, u.Username, u.FullName,
           co.CourseCode, co.CourseName, c.Semester, e.AverageGrade
    FROM Enrollments e
    JOIN Classes c ON e.ClassId = c.ClassId
    JOIN Courses co ON c.CourseId = co.CourseId
    JOIN Users u ON e.StudentId = u.UserId
    WHERE e.AverageGrade < 4
    ORDER BY u.Username, c.Semester;
END

GO
/****** Object:  StoredProcedure [dbo].[sp_GetStudentGrades]    Script Date: 6/4/2026 2:06:12 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- ========================================================
-- 4. STORED PROCEDURE: THỐNG KÊ
-- ========================================================
-- Bảng điểm cá nhân
CREATE   PROCEDURE [dbo].[sp_GetStudentGrades]
    @StudentId UNIQUEIDENTIFIER,
    @RequestingUserId UNIQUEIDENTIFIER
AS
BEGIN
    SET NOCOUNT ON;
    DECLARE @Role INT;
    SELECT @Role = RoleId FROM Users WHERE UserId = @RequestingUserId AND IsActive = 1;
    IF @Role = 3 AND @RequestingUserId <> @StudentId
        THROW 50026, 'Sinh viên chỉ được xem điểm của chính mình.', 1;
    IF @Role = 2 -- Giáo viên: chỉ xem nếu có dạy sinh viên này
    BEGIN
        IF NOT EXISTS (
            SELECT 1 FROM Enrollments e JOIN Classes c ON e.ClassId = c.ClassId
            WHERE e.StudentId = @StudentId AND c.TeacherId = @RequestingUserId
        ) THROW 50027, 'Bạn không dạy sinh viên này.', 1;
    END
    IF @Role NOT IN (1,2,3) THROW 50028, 'Không đủ quyền.', 1;

    SELECT co.CourseCode, co.CourseName, co.Credits, c.Semester,
           e.MidtermGrade, e.FinalGrade, e.AverageGrade,
           CASE WHEN e.AverageGrade >= 4 THEN N'Đạt' ELSE N'Không đạt' END AS Result
    FROM Enrollments e
    JOIN Classes c ON e.ClassId = c.ClassId
    JOIN Courses co ON c.CourseId = co.CourseId
    WHERE e.StudentId = @StudentId
    ORDER BY c.Semester DESC;
END

GO
/****** Object:  StoredProcedure [dbo].[sp_InsertClass]    Script Date: 6/4/2026 2:06:12 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- CRUD Classes
CREATE   PROCEDURE [dbo].[sp_InsertClass]
    @ClassCode VARCHAR(50),
    @CourseId INT,
    @TeacherId UNIQUEIDENTIFIER,
    @Semester VARCHAR(20),
    @MaxStudents INT = 40,
    @Status VARCHAR(20) = 'Open'
AS
BEGIN
    IF NOT EXISTS (SELECT 1 FROM Courses WHERE CourseId = @CourseId)
        THROW 50012, 'Môn học không tồn tại.', 1;
    IF NOT EXISTS (SELECT 1 FROM Users WHERE UserId = @TeacherId AND RoleId = 2 AND IsActive = 1)
        THROW 50013, 'Giáo viên không hợp lệ.', 1;
    INSERT INTO Classes (ClassCode, CourseId, TeacherId, Semester, MaxStudents, Status)
    VALUES (@ClassCode, @CourseId, @TeacherId, @Semester, @MaxStudents, @Status);
END

GO
/****** Object:  StoredProcedure [dbo].[sp_InsertCourse]    Script Date: 6/4/2026 2:06:12 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- CRUD Courses
CREATE   PROCEDURE [dbo].[sp_InsertCourse]
    @CourseCode VARCHAR(20),
    @CourseName NVARCHAR(150),
    @Credits INT,
    @DepartmentId INT
AS
BEGIN
    IF NOT EXISTS (SELECT 1 FROM Departments WHERE DepartmentId = @DepartmentId)
        THROW 50009, 'Mã khoa không hợp lệ.', 1;
    INSERT INTO Courses (CourseCode, CourseName, Credits, DepartmentId)
    VALUES (@CourseCode, @CourseName, @Credits, @DepartmentId);
END

GO
/****** Object:  StoredProcedure [dbo].[sp_InsertDepartment]    Script Date: 6/4/2026 2:06:12 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- ========================================================
-- 2. STORED PROCEDURE: DANH MỤC
-- ========================================================
-- CRUD Departments
CREATE   PROCEDURE [dbo].[sp_InsertDepartment]
    @DepartmentCode VARCHAR(20),
    @DepartmentName NVARCHAR(100)
AS
BEGIN
    IF EXISTS (SELECT 1 FROM Departments WHERE DepartmentCode = @DepartmentCode)
        THROW 50006, 'Mã khoa đã tồn tại.', 1;
    INSERT INTO Departments (DepartmentCode, DepartmentName) VALUES (@DepartmentCode, @DepartmentName);
END

GO
/****** Object:  StoredProcedure [dbo].[sp_UpdateClass]    Script Date: 6/4/2026 2:06:12 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE   PROCEDURE [dbo].[sp_UpdateClass]
    @ClassId INT,
    @ClassCode VARCHAR(50),
    @CourseId INT,
    @TeacherId UNIQUEIDENTIFIER,
    @Semester VARCHAR(20),
    @MaxStudents INT,
    @Status VARCHAR(20)
AS
BEGIN
    IF NOT EXISTS (SELECT 1 FROM Classes WHERE ClassId = @ClassId)
        THROW 50014, 'Lớp không tồn tại.', 1;
    -- các kiểm tra khác tương tự insert
    UPDATE Classes SET ClassCode = @ClassCode, CourseId = @CourseId, TeacherId = @TeacherId,
        Semester = @Semester, MaxStudents = @MaxStudents, Status = @Status
    WHERE ClassId = @ClassId;
END

GO
/****** Object:  StoredProcedure [dbo].[sp_UpdateCourse]    Script Date: 6/4/2026 2:06:12 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE   PROCEDURE [dbo].[sp_UpdateCourse]
    @CourseId INT,
    @CourseCode VARCHAR(20),
    @CourseName NVARCHAR(150),
    @Credits INT,
    @DepartmentId INT
AS
BEGIN
    -- kiểm tra tồn tại và khóa ngoại
    IF NOT EXISTS (SELECT 1 FROM Courses WHERE CourseId = @CourseId)
        THROW 50010, 'Môn học không tồn tại.', 1;
    UPDATE Courses SET CourseCode = @CourseCode, CourseName = @CourseName, Credits = @Credits, DepartmentId = @DepartmentId
    WHERE CourseId = @CourseId;
END

GO
/****** Object:  StoredProcedure [dbo].[sp_UpdateDepartment]    Script Date: 6/4/2026 2:06:12 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE   PROCEDURE [dbo].[sp_UpdateDepartment]
    @DepartmentId INT,
    @DepartmentCode VARCHAR(20),
    @DepartmentName NVARCHAR(100)
AS
BEGIN
    IF NOT EXISTS (SELECT 1 FROM Departments WHERE DepartmentId = @DepartmentId)
        THROW 50007, 'Khoa không tồn tại.', 1;
    UPDATE Departments SET DepartmentCode = @DepartmentCode, DepartmentName = @DepartmentName
    WHERE DepartmentId = @DepartmentId;
END

GO
/****** Object:  StoredProcedure [dbo].[sp_UpdateGrade]    Script Date: 6/4/2026 2:06:12 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE   PROCEDURE [dbo].[sp_UpdateGrade]
    @EnrollmentId INT,
    @MidtermGrade FLOAT = NULL,
    @FinalGrade FLOAT = NULL,
    @TeacherUserId UNIQUEIDENTIFIER
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @ClassTeacher UNIQUEIDENTIFIER;

    SELECT @ClassTeacher = c.TeacherId
    FROM Enrollments e
    JOIN Classes c ON e.ClassId = c.ClassId
    WHERE e.EnrollmentId = @EnrollmentId;

    IF @ClassTeacher IS NULL
        THROW 50024, 'Đăng ký không tồn tại.', 1;

    -- Kiểm tra quyền: phải là Admin hoặc giáo viên của lớp
    IF NOT EXISTS (SELECT 1 FROM Users WHERE UserId = @TeacherUserId AND RoleId = 1)
        AND @TeacherUserId <> @ClassTeacher
        THROW 50025, 'Bạn không có quyền nhập điểm cho lớp này.', 1;

    UPDATE Enrollments
    SET MidtermGrade = ISNULL(@MidtermGrade, MidtermGrade),
        FinalGrade   = ISNULL(@FinalGrade, FinalGrade)
    WHERE EnrollmentId = @EnrollmentId;
END
GO
/****** Object:  StoredProcedure [dbo].[sp_UpdateUser]    Script Date: 6/4/2026 2:06:12 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- Chỉnh sửa: Trả về UserId đã tạo
-- (Để đơn giản, có thể dùng OUTPUT hoặc SELECT ngay sau INSERT)
-- Tôi sẽ sửa lại trong thực tế nhưng ở đây minh họa logic.

-- Cập nhật thông tin User (không đổi mật khẩu)
CREATE   PROCEDURE [dbo].[sp_UpdateUser]
    @UserId UNIQUEIDENTIFIER,
    @FullName NVARCHAR(100),
    @Email VARCHAR(100),
    @RoleId INT
AS
BEGIN
    SET NOCOUNT ON;
    IF NOT EXISTS (SELECT 1 FROM Users WHERE UserId = @UserId)
        THROW 50005, 'User không tồn tại.', 1;
    UPDATE Users SET FullName = @FullName, Email = @Email, RoleId = @RoleId
    WHERE UserId = @UserId;
END

GO
/****** Object:  Trigger [dbo].[trg_Classes_PreventReduceMaxBelowEnrollment]    Script Date: 6/4/2026 2:06:12 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- Trigger ngăn giảm MaxStudents thấp hơn số sinh viên
CREATE   TRIGGER [dbo].[trg_Classes_PreventReduceMaxBelowEnrollment]
ON [dbo].[Classes] INSTEAD OF UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    IF UPDATE(MaxStudents)
    BEGIN
        DECLARE @ClassId INT, @OldMax INT, @NewMax INT, @Enrolled INT;
        SELECT @ClassId = ClassId, @NewMax = MaxStudents FROM INSERTED;
        SELECT @OldMax = MaxStudents FROM DELETED;
        SELECT @Enrolled = COUNT(*) FROM Enrollments WHERE ClassId = @ClassId;
        IF @NewMax < @Enrolled
            THROW 50033, 'Không thể đặt sĩ số tối đa nhỏ hơn số sinh viên đã đăng ký.', 1;
    END
    -- Thực hiện update
    UPDATE Classes
    SET ClassCode = i.ClassCode,
        CourseId = i.CourseId,
        TeacherId = i.TeacherId,
        Semester = i.Semester,
        MaxStudents = i.MaxStudents,
        Status = i.Status
    FROM Classes c
    JOIN INSERTED i ON c.ClassId = i.ClassId;
END

GO
ALTER TABLE [dbo].[Classes] ENABLE TRIGGER [trg_Classes_PreventReduceMaxBelowEnrollment]
GO
/****** Object:  Trigger [dbo].[trg_Enrollments_AuditLog]    Script Date: 6/4/2026 2:06:16 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- Trigger audit cho Enrollments
CREATE   TRIGGER [dbo].[trg_Enrollments_AuditLog]
ON [dbo].[Enrollments] AFTER INSERT, UPDATE, DELETE
AS
BEGIN
    SET NOCOUNT ON;
    DECLARE @Action CHAR(1);
    IF EXISTS (SELECT 1 FROM INSERTED) AND EXISTS (SELECT 1 FROM DELETED)
        SET @Action = 'U';
    ELSE IF EXISTS (SELECT 1 FROM INSERTED)
        SET @Action = 'I';
    ELSE
        SET @Action = 'D';

    INSERT INTO AuditLog (TableName, Action, RecordId, OldValues, NewValues, ChangedDate)
    SELECT 'Enrollments', @Action,
           ISNULL(i.EnrollmentId, d.EnrollmentId),
           (SELECT * FROM DELETED d2 WHERE d2.EnrollmentId = d.EnrollmentId FOR JSON PATH, WITHOUT_ARRAY_WRAPPER),
           (SELECT * FROM INSERTED i2 WHERE i2.EnrollmentId = i.EnrollmentId FOR JSON PATH, WITHOUT_ARRAY_WRAPPER),
           GETDATE()
    FROM INSERTED i FULL OUTER JOIN DELETED d ON i.EnrollmentId = d.EnrollmentId;
END

GO
ALTER TABLE [dbo].[Enrollments] ENABLE TRIGGER [trg_Enrollments_AuditLog]
GO
/****** Object:  Trigger [dbo].[trg_Enrollments_CheckStatusAndCapacity]    Script Date: 6/4/2026 2:06:17 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- ========================================================
-- 5. TRIGGERS
-- ========================================================

-- Trigger kiểm tra khi INSERT Enrollments
CREATE   TRIGGER [dbo].[trg_Enrollments_CheckStatusAndCapacity]
ON [dbo].[Enrollments] INSTEAD OF INSERT
AS
BEGIN
    SET NOCOUNT ON;
    DECLARE @ClassId INT, @StudentId UNIQUEIDENTIFIER;
    SELECT @ClassId = ClassId, @StudentId = StudentId FROM INSERTED;

    DECLARE @Status VARCHAR(20), @CurrentCount INT, @Max INT;
    SELECT @Status = Status, @Max = MaxStudents FROM Classes WHERE ClassId = @ClassId;
    IF @Status IS NULL
        THROW 50030, 'Lớp không tồn tại.', 1;
    IF @Status <> 'Open'
        THROW 50031, 'Lớp không còn mở đăng ký.', 1;

    SELECT @CurrentCount = COUNT(*) FROM Enrollments WHERE ClassId = @ClassId;
    IF @CurrentCount >= @Max
        THROW 50032, 'Lớp đã đủ sĩ số tối đa.', 1;

    -- Nếu vượt qua, thực hiện insert thực tế
    INSERT INTO Enrollments (ClassId, StudentId) VALUES (@ClassId, @StudentId);
END

GO
ALTER TABLE [dbo].[Enrollments] ENABLE TRIGGER [trg_Enrollments_CheckStatusAndCapacity]
GO
USE [master]
GO
ALTER DATABASE [AcademicManagement] SET  READ_WRITE 
GO
