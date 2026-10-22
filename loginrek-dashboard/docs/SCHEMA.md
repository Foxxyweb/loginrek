# Skema Database — loginrek

PostgreSQL 17. Sumber kebenaran adalah `database/migrations/`. Dokumen ini wajib
diperbarui di PR yang sama dengan migration.

Konvensi: nama tabel jamak `snake_case`, PK `id` (increments), FK `<entity>_id`,
`created_at`/`updated_at` timestamp (UTC), soft-delete belum dipakai.

## Tabel yang sudah ada

### `users`
| Kolom       | Tipe          | Keterangan            |
| ----------- | ------------- | --------------------- |
| id          | serial PK     |                       |
| full_name   | varchar null  |                       |
| email       | varchar(254) unique | login           |
| password    | varchar       | hash (scrypt)         |
| created_at  | timestamp     |                       |
| updated_at  | timestamp null |                      |

### `auth_access_tokens`
Token API untuk mobile (guard `api`).

| Kolom        | Tipe        | Keterangan                        |
| ------------ | ----------- | --------------------------------- |
| id           | serial PK   |                                   |
| tokenable_id | int FK → users.id (cascade) |                   |
| type         | varchar     | `auth_token`                      |
| name         | varchar null | nama device (`deviceName`)       |
| hash         | varchar     | hash token                        |
| abilities    | text        | JSON array, default `["*"]`       |
| last_used_at | timestamp null |                                |
| expires_at   | timestamp null | 30 hari sejak dibuat           |
| created_at / updated_at | timestamp |                         |

## Rancangan domain absensi (DRAFT — belum ada migration)

> Draft awal untuk didiskusikan tim. Ubah sesuai kebutuhan HR sebelum dibuat migrasinya.

```mermaid
erDiagram
  users ||--o| employees : "akun"
  departments ||--o{ employees : ""
  positions ||--o{ employees : ""
  offices ||--o{ employees : "lokasi kerja"
  shifts ||--o{ employee_shifts : ""
  employees ||--o{ employee_shifts : "jadwal"
  employees ||--o{ attendances : ""
  offices ||--o{ attendances : ""
  employees ||--o{ leave_requests : ""
  users ||--o{ leave_requests : "approver"

  employees {
    int id PK
    int user_id FK
    string employee_number UK
    string full_name
    string phone
    int department_id FK
    int position_id FK
    int office_id FK
    date join_date
    string status "active|inactive"
  }
  offices {
    int id PK
    string name
    decimal latitude
    decimal longitude
    int radius_meters
    string timezone "Asia/Jakarta"
  }
  shifts {
    int id PK
    string name
    time start_time
    time end_time
    int late_tolerance_minutes
  }
  employee_shifts {
    int id PK
    int employee_id FK
    int shift_id FK
    date effective_from
    date effective_to
  }
  attendances {
    int id PK
    int employee_id FK
    int office_id FK
    date work_date
    timestamp check_in_at
    decimal check_in_lat
    decimal check_in_lng
    string check_in_photo_key
    timestamp check_out_at
    decimal check_out_lat
    decimal check_out_lng
    string check_out_photo_key
    string status "present|late|absent|leave|sick"
    string note
  }
  leave_requests {
    int id PK
    int employee_id FK
    string type "annual|sick|permit"
    date start_date
    date end_date
    string reason
    string attachment_key
    string status "pending|approved|rejected"
    int approved_by FK
    timestamp approved_at
  }
```

Catatan desain:
- `attendances` unik per `(employee_id, work_date)`; index pada `(work_date)` untuk rekap harian.
- `*_photo_key` / `attachment_key` menyimpan **key** objek RustFS, bukan URL.
- Koordinat pakai `decimal(10,7)`; validasi jarak (haversine) dilakukan di service.
- Tabel `departments`, `positions`: `id`, `name`, timestamps.
