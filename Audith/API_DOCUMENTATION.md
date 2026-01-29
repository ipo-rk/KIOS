# 📋 API Documentation - CRUD Barang

## Base URL

```
http://localhost/kios/api
```

## Endpoints

### 1. Get All Barang (READ)

```
GET /api/barang
```

**Response:**

```json
{
    "success": true,
    "message": "Data barang berhasil diambil",
    "data": [
        {
            "id": 1,
            "nama": "Mie Instan",
            "harga": "3000.00",
            "stok": 50,
            "deskripsi": "Mie instan rasa ayam",
            "created_at": "2025-01-15T10:00:00Z",
            "updated_at": "2025-01-15T10:00:00Z"
        }
    ]
}
```

---

### 2. Get Single Barang (READ)

```
GET /api/barang/{id}
```

**Example:** `GET /api/barang/1`

**Response:**

```json
{
    "success": true,
    "message": "Detail barang berhasil diambil",
    "data": {
        "id": 1,
        "nama": "Mie Instan",
        "harga": "3000.00",
        "stok": 50,
        "deskripsi": "Mie instan rasa ayam",
        "created_at": "2025-01-15T10:00:00Z",
        "updated_at": "2025-01-15T10:00:00Z"
    }
}
```

---

### 3. Create New Barang (CREATE)

```
POST /api/barang
```

**Request Body:**

```json
{
    "nama": "Minyak Goreng",
    "harga": 25000,
    "stok": 15,
    "deskripsi": "Minyak goreng 2L"
}
```

**Response (201 Created):**

```json
{
    "success": true,
    "message": "Barang berhasil ditambahkan",
    "data": {
        "id": 6,
        "nama": "Minyak Goreng",
        "harga": "25000.00",
        "stok": 15,
        "deskripsi": "Minyak goreng 2L",
        "created_at": "2025-01-15T10:00:00Z",
        "updated_at": "2025-01-15T10:00:00Z"
    }
}
```

---

### 4. Update Barang (UPDATE)

```
PUT /api/barang/{id}
```

**Example:** `PUT /api/barang/1`

**Request Body (any field is optional):**

```json
{
    "harga": 3500,
    "stok": 45
}
```

**Response:**

```json
{
    "success": true,
    "message": "Barang berhasil diperbarui",
    "data": {
        "id": 1,
        "nama": "Mie Instan",
        "harga": "3500.00",
        "stok": 45,
        "deskripsi": "Mie instan rasa ayam",
        "created_at": "2025-01-15T10:00:00Z",
        "updated_at": "2025-01-15T10:30:00Z"
    }
}
```

---

### 5. Delete Barang (DELETE)

```
DELETE /api/barang/{id}
```

**Example:** `DELETE /api/barang/1`

**Response:**

```json
{
    "success": true,
    "message": "Barang berhasil dihapus"
}
```

---

### 6. Reduce Stock

```
POST /api/barang/{id}/kurangi-stok
```

**Example:** `POST /api/barang/1/kurangi-stok`

**Request Body:**

```json
{
    "jumlah": 10
}
```

**Response:**

```json
{
    "success": true,
    "message": "Stok berhasil dikurangi",
    "data": {
        "id": 1,
        "nama": "Mie Instan",
        "harga": "3000.00",
        "stok": 40,
        "deskripsi": "Mie instan rasa ayam",
        "created_at": "2025-01-15T10:00:00Z",
        "updated_at": "2025-01-15T10:45:00Z"
    }
}
```

---

### 7. Increase Stock

```
POST /api/barang/{id}/tambah-stok
```

**Example:** `POST /api/barang/1/tambah-stok`

**Request Body:**

```json
{
    "jumlah": 20
}
```

**Response:**

```json
{
    "success": true,
    "message": "Stok berhasil ditambahkan",
    "data": {
        "id": 1,
        "nama": "Mie Instan",
        "harga": "3000.00",
        "stok": 60,
        "deskripsi": "Mie instan rasa ayam",
        "created_at": "2025-01-15T10:00:00Z",
        "updated_at": "2025-01-15T10:50:00Z"
    }
}
```

---

## Testing with cURL

### Get all barang:

```bash
curl http://localhost/kios/api/barang
```

### Create new barang:

```bash
curl -X POST http://localhost/kios/api/barang \
  -H "Content-Type: application/json" \
  -d '{
    "nama": "Gula",
    "harga": 15000,
    "stok": 30,
    "deskripsi": "Gula pasir 1kg"
  }'
```

### Update barang:

```bash
curl -X PUT http://localhost/kios/api/barang/1 \
  -H "Content-Type: application/json" \
  -d '{
    "harga": 3500
  }'
```

### Delete barang:

```bash
curl -X DELETE http://localhost/kios/api/barang/1
```

### Reduce stock:

```bash
curl -X POST http://localhost/kios/api/barang/1/kurangi-stok \
  -H "Content-Type: application/json" \
  -d '{
    "jumlah": 5
  }'
```

---

## Database Schema

**Table: barang**
| Column | Type | Notes |
|--------|------|-------|
| id | INTEGER | Primary Key, Auto Increment |
| nama | VARCHAR | Unique, Required |
| harga | DECIMAL(12,2) | Required, Min 0 |
| stok | INTEGER | Default 0, Min 0 |
| deskripsi | TEXT | Optional |
| created_at | TIMESTAMP | Auto |
| updated_at | TIMESTAMP | Auto |

---

## Validation Rules

### CREATE/UPDATE Barang:

-   **nama**: Required, string, unique (except on update)
-   **harga**: Required, numeric, minimum 0
-   **stok**: Required (on create), integer, minimum 0
-   **deskripsi**: Optional, string

### Stock Operations:

-   **jumlah**: Required, integer, minimum 1
-   Cannot reduce stock below available amount

---

## Error Responses

**Validation Error (422):**

```json
{
    "success": false,
    "message": "Validasi gagal",
    "errors": {
        "nama": ["The nama field is required."]
    }
}
```

**Not Found (404):**

```json
{
    "success": false,
    "message": "No query results for model [App\\Models\\Barang]"
}
```

**Server Error (500):**

```json
{
    "success": false,
    "message": "Gagal menambahkan barang: [error details]"
}
```
