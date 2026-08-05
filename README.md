# Fullstack Dashboard - Technical Test

> **Repository:** [https://github.com/nafiafatimah/fullstack_telkom](https://github.com/nafiafatimah/fullstack_telkom)

Dashboard aplikasi full-stack dengan autentikasi JWT, manajemen data, grafik analitik interaktif, dan containerization menggunakan Docker/Podman.

---

## 📋 Daftar Isi

- [Fitur](#-fitur)
- [Tech Stack](#-tech-stack)
- [Kredensial Login](#-kredensial-login)
- [Cara Menjalankan](#-cara-menjalankan)
  - [Development Mode (Lokal)](#1-development-mode-lokal)
  - [Production Mode (Docker Compose)](#2-production-mode-docker-compose)
  - [Production Mode (Docker Manual)](#3-production-mode-docker-manual)
  - [Production Mode (Podman)](#4-production-mode-podman)
- [Struktur Project](#-struktur-project)
- [API Endpoint](#-api-endpoint)
- [Data Schema](#-data-schema)
- [Docker Commands](#-docker-commands)
- [Troubleshooting](#-troubleshooting)
- [Author](#-author)

---

## 🚀 Fitur

| No | Fitur | Status |
|----|-------|--------|
| 1 | **Autentikasi JWT** - Login dengan username/password | ✅ |
| 2 | **Dashboard Analytics** - Grafik interaktif (Bar Chart & Pie Chart) | ✅ |
| 3 | **Manajemen Records** - Tambah, Lihat, Hapus data (CRUD) | ✅ |
| 4 | **Seed Data** - Generate data dummy otomatis | ✅ |
| 5 | **Search/Filter** - Cari data berdasarkan site atau user | ✅ |
| 6 | **Responsive Design** - Tampilan optimal di desktop, tablet, dan mobile | ✅ |
| 7 | **Sidebar Navigation** - Navigasi yang modern dan mudah digunakan | ✅ |
| 8 | **Docker Containerization** - Siap di-deploy dengan Docker/Podman | ✅ |

---

## 🛠️ Tech Stack

| Teknologi | Versi | Deskripsi |
|-----------|-------|-----------|
| **React** | 19.2.8 | Frontend framework |
| **Vite** | 5.4.0 | Build tool dan development server |
| **Tailwind CSS** | 3.4.19 | Utility-first CSS framework |
| **Recharts** | 3.10.1 | Library grafik interaktif |
| **Lucide React** | 1.28.0 | Icon library modern |
| **Axios** | 1.19.0 | HTTP client untuk API |
| **Docker** | Latest | Containerization |
| **Podman** | Latest | Containerization (alternatif) |
| **Nginx** | Alpine | Web server untuk production |

---

## 🔑 Kredensial Login

| Field | Value |
|-------|-------|
| **Username** | `user` |
| **Password** | `pass` |

> ℹ️ **Catatan:** Kredensial ini sudah terintegrasi dengan backend API dan bersifat default.

---

## 📦 Cara Menjalankan

### 1. Development Mode (Lokal)

#### a. Prasyarat
Pastikan Anda sudah menginstall:
- [Node.js](https://nodejs.org/) (v20 atau lebih baru)
- [Docker](https://www.docker.com/) (untuk backend)

#### b. Clone Repository
```bash
git clone https://github.com/nafiafatimah/fullstack_telkom.git
cd fullstack_telkom