# API Documentation

Version: 1.0

Base URL

/api

---

# Authentication

---

## Register Admin

POST

/api/auth/register

### Request

{
    "name":"Admin",
    "email":"admin@example.com",
    "password":"password123"
}

### Success Response

201 Created

{
    "success":true,
    "message":"User Registered Successfully",
    "data":{
        ...
    }
}

---

## Login

POST

/api/auth/login

### Request

{
    "email":"admin@example.com",
    "password":"password123"
}

### Response

200 OK

{
    "success":true,
    "message":"Login Successfully",
    "data":{
        "token":"JWT",
        "user":{}
    }
}

---

## Get Current User

GET

/api/auth/me

Authorization

Bearer Token

Response

200 OK

{
    "success":true,
    "data":{
        "id":1,
        "name":"Admin"
    }
}

---

# Products

---

## Get All Products

GET

/api/products

Authentication

No

Response

200 OK

[
   ...
]

---

## Get Product By ID

GET

/api/products/:id

Response

200 OK

{
   ...
}

404

Product Not Found

---

## Create Product

POST

/api/products

Authentication

Admin

Request

{
    "serialNumber":"BOAT001",
    "name":"Boat Airdopes",
    "model":"141",
    "purchaseDate":"2026-01-01",
    "warrantyExpiry":"2027-01-01"
}

Response

201 Created

{
    "success":true
}

---

## Update Product

PUT

/api/products/:id

Authentication

Admin

Response

200 OK

---

## Delete Product

DELETE

/api/products/:id

Authentication

Admin

Response

200 OK

---

# Warranty

---

## Warranty Lookup

GET

/ api/warranty/{serialNumber}

Authentication

No

Example

/api/warranty/BOAT001

---

Response

{
    "product":{
        ...
    },
    "repairHistory":[]
}

---

404

Warranty Not Found

---

410

Warranty Expired

---

# Repairs

---

## Add Repair

POST

/api/repairs

Authentication

Admin

Request

{
    "productId":1,
    "issue":"Speaker Not Working",
    "status":"Pending"
}

---

Response

201 Created

---

## Update Repair

PUT

/api/repairs/:id

Authentication

Admin

---

## Delete Repair

DELETE

/api/repairs/:id

Authentication

Admin

---

# Upload

---

## Upload Warranty PDF

POST

/api/upload

Authentication

Admin

Content Type

multipart/form-data

Body

pdf

---

Response

{
   "url":"https://..."
}

---

# Status Codes

200

Success

201

Created

400

Validation Error

401

Unauthorized

403

Forbidden

404

Not Found

409

Conflict

410

Warranty Expired

500

Internal Server Error

---

# Authentication

JWT

Authorization Header

Authorization

Bearer JWT_TOKEN

---

# Error Response Format

{
    "success":false,
    "message":"Validation Failed",
    "errors":[]
}

---

# Success Response Format

{
    "success":true,
    "message":"Success",
    "data":{}
}

---

# Future APIs (Version 2)

Customer Dashboard

Warranty Registration

Warranty Renewal

Analytics

Search

Pagination

Notifications

Reports

Export CSV

Export PDF