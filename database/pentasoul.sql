-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Waktu pembuatan: 06 Des 2025 pada 14.53
-- Versi server: 11.8.2-MariaDB
-- Versi PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `pentasoul`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `diagnosa_history`
--

CREATE TABLE `diagnosa_history` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `hasil` varchar(255) NOT NULL,
  `level` varchar(50) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `diagnosa_history`
--

INSERT INTO `diagnosa_history` (`id`, `user_id`, `hasil`, `level`, `created_at`) VALUES
(33, 2, 'Depresi', 'Berat', '2025-11-01 12:41:25'),
(34, 2, 'Gangguan Kecemasan', 'Berat', '2025-11-01 12:41:25'),
(35, 2, 'Depresi', 'Berat', '2025-11-02 03:52:37'),
(36, 2, 'Gangguan Kecemasan', 'Berat', '2025-11-02 03:52:37'),
(37, 2, 'Depresi', 'Berat', '2025-11-04 13:10:12'),
(38, 2, 'Gangguan Kecemasan', 'Berat', '2025-11-04 13:10:12'),
(39, 2, 'Anxiety', 'Ringan', '2025-11-04 13:10:12'),
(40, 2, 'Bipolar', 'Tidak Terindikasi', '2025-11-04 13:10:12'),
(41, 2, 'Burnout', 'Sedang', '2025-11-04 13:10:12'),
(42, 2, 'Depresi', 'Berat', '2025-11-09 02:03:29'),
(43, 2, 'Gangguan Kecemasan', 'Berat', '2025-11-09 02:03:29'),
(44, 2, 'Anxiety', 'Sedang', '2025-11-09 02:03:29'),
(45, 2, 'Bipolar', 'Ringan', '2025-11-09 02:03:29'),
(46, 2, 'Burnout', 'Sedang', '2025-11-09 02:03:29'),
(47, 2, 'Depresi', 'Berat', '2025-12-01 01:21:06'),
(48, 2, 'Gangguan Kecemasan', 'Berat', '2025-12-01 01:21:06'),
(49, 2, 'Anxiety', 'Berat', '2025-12-01 01:21:06'),
(50, 2, 'Bipolar', 'Sedang', '2025-12-01 01:21:06'),
(51, 2, 'Burnout', 'Berat', '2025-12-01 01:21:06'),
(52, 2, 'Depresi', 'Berat', '2025-12-01 03:01:34'),
(53, 2, 'Gangguan Kecemasan', 'Berat', '2025-12-01 03:01:34'),
(54, 2, 'Anxiety', 'Sedang', '2025-12-01 03:01:34'),
(55, 2, 'Bipolar', 'Sedang', '2025-12-01 03:01:34'),
(56, 2, 'Burnout', 'Tidak Terindikasi', '2025-12-01 03:01:34');

-- --------------------------------------------------------

--
-- Struktur dari tabel `gejala`
--

CREATE TABLE `gejala` (
  `id` int(11) NOT NULL,
  `kode` varchar(10) DEFAULT NULL,
  `nama_gejala` varchar(255) DEFAULT NULL,
  `penyakit` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `gejala`
--

INSERT INTO `gejala` (`id`, `kode`, `nama_gejala`, `penyakit`) VALUES
(21, 'G01', 'Perasaan sedih berkepanjangan', 'Depresi'),
(22, 'G02', 'Gangguan tidur', 'Depresi'),
(23, 'G03', 'Kehilangan minat dan kesenangan', 'Depresi'),
(24, 'G04', 'Kecemasan berlebihan', 'Gangguan Kecemasan'),
(25, 'G05', 'Kelelahan emosional', 'Depresi'),
(26, 'G06', 'Rasa bersalah berlebihan', 'Depresi'),
(27, 'G07', 'Kesulitan konsentrasi', 'Depresi'),
(28, 'G08', 'Perasaan tidak berharga', 'Depresi'),
(29, 'G09', 'Gejala fisik akibat cemas', 'Gangguan Kecemasan'),
(30, 'G10', 'Menghindari interaksi sosial', 'Depresi'),
(31, 'G001', 'Sedih terus-menerus', 'Depresi'),
(32, 'G002', 'Hilang minat', 'Depresi'),
(33, 'G003', 'Kecemasan', 'Anxiety'),
(34, 'G004', 'Masalah tidur', 'Depresi'),
(35, 'G005', 'Iritabilitas', 'Bipolar'),
(36, 'G006', 'Kelelahan', 'Burnout'),
(37, 'G007', 'Rasa bersalah', 'Depresi'),
(38, 'G008', 'Konsentrasi buruk', 'Depresi'),
(39, 'G009', 'Perubahan nafsu makan', 'Depresi'),
(40, 'G010', 'Cemas di keramaian', 'Anxiety');

-- --------------------------------------------------------

--
-- Struktur dari tabel `jawaban_user`
--

CREATE TABLE `jawaban_user` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `pertanyaan_id` int(11) DEFAULT NULL,
  `jawaban` float DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `pertanyaan`
--

CREATE TABLE `pertanyaan` (
  `id` int(11) NOT NULL,
  `teks_pertanyaan` varchar(500) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `pertanyaan`
--

INSERT INTO `pertanyaan` (`id`, `teks_pertanyaan`) VALUES
(41, 'Apakah Anda sering merasa sedih tanpa alasan yang jelas?'),
(42, 'Apakah Anda mengalami kesulitan tidur atau tidur terlalu lama?'),
(43, 'Apakah Anda kehilangan minat pada hal-hal yang biasanya Anda sukai?'),
(44, 'Apakah Anda merasa cemas atau gelisah hampir setiap hari?'),
(45, 'Apakah Anda merasa lelah meskipun tidak melakukan aktivitas berat?'),
(46, 'Apakah Anda sering menyalahkan diri sendiri atas hal-hal kecil?'),
(47, 'Apakah Anda sulit berkonsentrasi saat bekerja atau belajar?'),
(48, 'Apakah Anda merasa tidak berharga atau putus asa?'),
(49, 'Apakah Anda merasa jantung berdebar atau napas menjadi cepat saat stres?'),
(50, 'Apakah Anda menarik diri dari interaksi sosial atau teman?'),
(51, 'Apakah kamu sering merasa sedih tanpa sebab?'),
(52, 'Apakah kamu kehilangan minat pada aktivitas yang biasa kamu sukai?'),
(53, 'Apakah kamu merasa cemas berlebihan terhadap hal kecil?'),
(54, 'Apakah kamu sulit tidur atau tidur berlebihan?'),
(55, 'Apakah kamu mudah marah atau tersinggung?'),
(56, 'Apakah kamu sering merasa lelah tanpa alasan jelas?'),
(57, 'Apakah kamu sering merasa tidak berharga atau bersalah?'),
(58, 'Apakah kamu sulit berkonsentrasi atau mengambil keputusan?'),
(59, 'Apakah kamu mengalami perubahan nafsu makan drastis?'),
(60, 'Apakah kamu merasa cemas saat berada di keramaian?');

-- --------------------------------------------------------

--
-- Struktur dari tabel `pertanyaan_gejala`
--

CREATE TABLE `pertanyaan_gejala` (
  `id` int(11) NOT NULL,
  `pertanyaan_id` int(11) DEFAULT NULL,
  `gejala_id` int(11) DEFAULT NULL,
  `cf_pakar` float DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `pertanyaan_gejala`
--

INSERT INTO `pertanyaan_gejala` (`id`, `pertanyaan_id`, `gejala_id`, `cf_pakar`) VALUES
(101, 41, 21, 0.8),
(102, 42, 22, 0.7),
(103, 43, 23, 0.9),
(104, 44, 24, 0.8),
(105, 45, 25, 0.7),
(106, 46, 26, 0.8),
(107, 47, 27, 0.7),
(108, 48, 28, 0.9),
(109, 49, 29, 0.6),
(110, 50, 30, 0.8),
(111, 41, 21, 0.8),
(112, 42, 22, 0.7),
(113, 43, 23, 0.9),
(114, 44, 24, 0.8),
(115, 45, 25, 0.7),
(116, 46, 26, 0.8),
(117, 47, 27, 0.7),
(118, 48, 28, 0.9),
(119, 49, 29, 0.6),
(120, 50, 30, 0.8),
(121, 41, 21, 0.8),
(122, 42, 22, 0.7),
(123, 43, 23, 0.9),
(124, 44, 24, 0.8),
(125, 45, 25, 0.7),
(126, 46, 26, 0.8),
(127, 47, 27, 0.7),
(128, 48, 28, 0.9),
(129, 49, 29, 0.6),
(130, 50, 30, 0.8),
(131, 41, 21, 0.8),
(132, 42, 22, 0.7),
(133, 43, 23, 0.9),
(134, 44, 24, 0.8),
(135, 45, 25, 0.7),
(136, 46, 26, 0.8),
(137, 47, 27, 0.7),
(138, 48, 28, 0.9),
(139, 49, 29, 0.6),
(140, 50, 30, 0.8),
(141, 41, 21, 0.8),
(142, 42, 22, 0.7),
(143, 43, 23, 0.9),
(144, 44, 24, 0.8),
(145, 45, 25, 0.7),
(146, 46, 26, 0.8),
(147, 47, 27, 0.7),
(148, 48, 28, 0.9),
(149, 49, 29, 0.6),
(150, 50, 30, 0.8),
(151, 41, 21, 0.8),
(152, 42, 22, 0.7),
(153, 43, 23, 0.9),
(154, 44, 24, 0.8),
(155, 45, 25, 0.7),
(156, 46, 26, 0.8),
(157, 47, 27, 0.7),
(158, 48, 28, 0.9),
(159, 49, 29, 0.6),
(160, 50, 30, 0.8),
(161, 41, 21, 0.8),
(162, 42, 22, 0.7),
(163, 43, 23, 0.9),
(164, 44, 24, 0.8),
(165, 45, 25, 0.7),
(166, 46, 26, 0.8),
(167, 47, 27, 0.7),
(168, 48, 28, 0.9),
(169, 49, 29, 0.6),
(170, 50, 30, 0.8),
(171, 41, 21, 0.8),
(172, 42, 22, 0.7),
(173, 43, 23, 0.9),
(174, 44, 24, 0.8),
(175, 45, 25, 0.7),
(176, 46, 26, 0.8),
(177, 47, 27, 0.7),
(178, 48, 28, 0.9),
(179, 49, 29, 0.6),
(180, 50, 30, 0.8),
(181, 41, 21, 0.8),
(182, 42, 22, 0.7),
(183, 43, 23, 0.9),
(184, 44, 24, 0.8),
(185, 45, 25, 0.7),
(186, 46, 26, 0.8),
(187, 47, 27, 0.7),
(188, 48, 28, 0.9),
(189, 49, 29, 0.6),
(190, 50, 30, 0.8),
(191, 51, 31, 0.8),
(192, 52, 32, 0.7),
(193, 53, 33, 0.9),
(194, 54, 34, 0.6),
(195, 55, 35, 0.7),
(196, 56, 36, 0.8),
(197, 57, 37, 0.9),
(198, 58, 38, 0.7),
(199, 59, 39, 0.6),
(200, 60, 40, 0.8);

-- --------------------------------------------------------

--
-- Struktur dari tabel `rujukan`
--

CREATE TABLE `rujukan` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `nama` varchar(255) NOT NULL,
  `alamat` text NOT NULL,
  `tgl_lahir` date NOT NULL,
  `psikolog` varchar(255) NOT NULL,
  `jadwal` datetime NOT NULL,
  `status` enum('pending','approved','rejected') DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `file_url` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `rujukan`
--

INSERT INTO `rujukan` (`id`, `user_id`, `nama`, `alamat`, `tgl_lahir`, `psikolog`, `jadwal`, `status`, `created_at`, `updated_at`, `file_url`) VALUES
(1, 2, 'aldaka', 'lamongan', '2025-12-26', 'Dr. Citra Wulandari, M.Psi', '2025-12-12 19:09:00', 'approved', '2025-12-06 12:10:01', '2025-12-06 13:48:43', NULL),
(2, 2, 'aku', 'aaa', '2025-12-12', 'Dr. Citra Wulandari, M.Psi', '2025-12-18 19:27:00', 'approved', '2025-12-06 12:27:58', '2025-12-06 13:48:42', 'surat-rujukan-2-rejected.pdf'),
(3, 2, 'aku', 'aaa', '2025-12-13', 'Kurniasih Dwi P., M.Psi.', '2025-12-13 20:33:00', 'approved', '2025-12-06 13:33:58', '2025-12-06 13:48:40', NULL);

-- --------------------------------------------------------

--
-- Struktur dari tabel `solusi`
--

CREATE TABLE `solusi` (
  `id` int(11) NOT NULL,
  `min_persen` float DEFAULT NULL,
  `max_persen` float DEFAULT NULL,
  `keterangan` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `role` enum('admin','user') DEFAULT 'user',
  `foto` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `reset_token` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `role`, `foto`, `email`, `reset_token`) VALUES
(2, 'perkak', '$2b$10$revdYrCga1c8RZeWaFTKZeQWEzEH2bef5jOO/ydPIKRw9/Dy.XG9u', 'user', '/uploads/user_2_1764553713214.jpg', NULL, NULL),
(3, 'admin', '$2b$10$PlBZdC4sohmMBo5esq6jf.i058E2PIj57QE.ocgFzSauu/7djKpQC', 'admin', NULL, NULL, NULL),
(4, 'dewi123', '$2b$10$P6e7Z5xI3KbziGwHgRpnYu2kiYvgQUH35IoZ5hsfG0qhlFN0QkMvS', 'admin', NULL, NULL, NULL),
(5, 'dina123', '$2b$10$L.WcArgPRiS2gAgoD1mVmeDsZc4Dys9ywgzklinmbF1m/ECW2rzjS', 'admin', NULL, NULL, NULL),
(6, 'aghis123', '$2b$10$a8ZKZ2aXX5KKmBi2ElJYuOA3MmGRImN5JpY3QIZReZzDarDWS2eTO', 'admin', NULL, NULL, NULL),
(7, 'shallu123', '$2b$10$oZdBzlp9NN4bqHThVk6UoeJYSj6NI..V/59VnlnI8HHJbgarKStA2', 'admin', NULL, NULL, NULL),
(10, 'aa', '$2b$10$yjANVytcHXBOpso0tNhwO.vOYoeVlY.CoJTaE/7QC7u8PNMXYOLIG', 'user', NULL, '2211102071@ittelkom-pwt.ac.id', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAsImlhdCI6MTc2MjA1NTg2MiwiZXhwIjoxNzYyMDU2NzYyfQ.aSyWNGVYpYm3-8DTLyFmk2pmuQKgUOmG8Kscl65eUKM'),
(11, 'a', '$2b$10$ITRT7.fmagpNYeuEiYGFQu4VJk3FiflbygdicW1x2piAZJyMwM6FK', 'user', NULL, 'd@gmail.com', NULL);

-- --------------------------------------------------------

--
-- Struktur dari tabel `user_notifikasi`
--

CREATE TABLE `user_notifikasi` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `aktif` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `user_notifikasi`
--

INSERT INTO `user_notifikasi` (`id`, `user_id`, `aktif`) VALUES
(1, 2, 1);

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `diagnosa_history`
--
ALTER TABLE `diagnosa_history`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `gejala`
--
ALTER TABLE `gejala`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `jawaban_user`
--
ALTER TABLE `jawaban_user`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `pertanyaan_id` (`pertanyaan_id`);

--
-- Indeks untuk tabel `pertanyaan`
--
ALTER TABLE `pertanyaan`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `pertanyaan_gejala`
--
ALTER TABLE `pertanyaan_gejala`
  ADD PRIMARY KEY (`id`),
  ADD KEY `pertanyaan_id` (`pertanyaan_id`),
  ADD KEY `gejala_id` (`gejala_id`);

--
-- Indeks untuk tabel `rujukan`
--
ALTER TABLE `rujukan`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indeks untuk tabel `solusi`
--
ALTER TABLE `solusi`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Indeks untuk tabel `user_notifikasi`
--
ALTER TABLE `user_notifikasi`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `diagnosa_history`
--
ALTER TABLE `diagnosa_history`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=57;

--
-- AUTO_INCREMENT untuk tabel `gejala`
--
ALTER TABLE `gejala`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;

--
-- AUTO_INCREMENT untuk tabel `jawaban_user`
--
ALTER TABLE `jawaban_user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=207;

--
-- AUTO_INCREMENT untuk tabel `pertanyaan`
--
ALTER TABLE `pertanyaan`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=61;

--
-- AUTO_INCREMENT untuk tabel `pertanyaan_gejala`
--
ALTER TABLE `pertanyaan_gejala`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=201;

--
-- AUTO_INCREMENT untuk tabel `rujukan`
--
ALTER TABLE `rujukan`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT untuk tabel `solusi`
--
ALTER TABLE `solusi`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT untuk tabel `user_notifikasi`
--
ALTER TABLE `user_notifikasi`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Ketidakleluasaan untuk tabel pelimpahan (Dumped Tables)
--

--
-- Ketidakleluasaan untuk tabel `jawaban_user`
--
ALTER TABLE `jawaban_user`
  ADD CONSTRAINT `jawaban_user_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `jawaban_user_ibfk_2` FOREIGN KEY (`pertanyaan_id`) REFERENCES `pertanyaan` (`id`);

--
-- Ketidakleluasaan untuk tabel `pertanyaan_gejala`
--
ALTER TABLE `pertanyaan_gejala`
  ADD CONSTRAINT `pertanyaan_gejala_ibfk_1` FOREIGN KEY (`pertanyaan_id`) REFERENCES `pertanyaan` (`id`),
  ADD CONSTRAINT `pertanyaan_gejala_ibfk_2` FOREIGN KEY (`gejala_id`) REFERENCES `gejala` (`id`);

--
-- Ketidakleluasaan untuk tabel `rujukan`
--
ALTER TABLE `rujukan`
  ADD CONSTRAINT `rujukan_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `user_notifikasi`
--
ALTER TABLE `user_notifikasi`
  ADD CONSTRAINT `user_notifikasi_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
