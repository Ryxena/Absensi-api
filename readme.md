
# Absensi api using Javascript


## Installation

Install Absensi-api with npm

```bash
  git clone https://github.com/Ryxena/Absensi-api.git
  cd Absensi-api
  npm install 
  npx prisma migrate dev --name dev
```
    
## Run this project

To run this project

```bash
  npm run start
```


## API Reference

#### Get User

```http
  GET /user/:id
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `id` | `string` | **Required**. Id rf |

#### Absen

```http
  POST /absen
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | **Required**. Id rf |

#### Register new user

```http
  POST /register
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `name, email, password, confPassword, id`      | `string` | **Required**. For register |

```http
  PATCH /user/:id
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `email, password, confPassword, id`      | `string` | **Required**. Update a user |

```http
  POST /login
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `email, password`      | `string` | **Required**. Login |

```http
  DELETE /logout
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `null`      | `null` | **Required**. Login first |

```http
  GET /me
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `null`      | `null` | **Required**. Login first who is user |