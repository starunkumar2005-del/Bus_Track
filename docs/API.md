# API Documentation

## Base URL

```
http://localhost:5000/api
```

## Authentication

Currently, no authentication is required. This is a student project without production security requirements.

---

## Routes Endpoint

### Get All Routes

```http
GET /routes
```

**Response:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "routeId": "uuid-string",
    "routeNumber": "101",
    "routeName": "City Center - University",
    "waypoints": [
      {"latitude": 11.0168, "longitude": 76.9558, "order": 0},
      {"latitude": 11.0234, "longitude": 76.9612, "order": 1}
    ],
    "stops": [
      {
        "stopId": "stop-1",
        "stopName": "Main Station",
        "latitude": 11.0168,
        "longitude": 76.9558,
        "stopOrder": 0,
        "dwellTime": 180000
      }
    ],
    "totalDistance": 12.5,
    "estimatedDuration": 25,
    "isActive": true
  }
]
```

### Get Route by ID

```http
GET /routes/:id
```

### Create Route

```http
POST /routes
Content-Type: application/json

{
  "routeName": "City Center - University",
  "routeNumber": "101",
  "waypoints": [
    {"latitude": 11.0168, "longitude": 76.9558, "order": 0},
    {"latitude": 11.0234, "longitude": 76.9612, "order": 1}
  ],
  "stops": [
    {
      "stopId": "stop-1",
      "stopName": "Main Station",
      "latitude": 11.0168,
      "longitude": 76.9558,
      "stopOrder": 0,
      "dwellTime": 180000
    }
  ]
}
```

### Update Route

```http
PUT /routes/:id
Content-Type: application/json

{
  "routeName": "Updated Name",
  "isActive": false
}
```

### Delete Route

```http
DELETE /routes/:id
```

---

## Buses Endpoint

### Get All Buses

```http
GET /buses
```

**Response:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439012",
    "busId": "uuid-string",
    "busNumber": "TN-01-AB-1234",
    "busType": "AC",
    "capacity": 50,
    "currentPosition": {
      "latitude": 11.0168,
      "longitude": 76.9558,
      "lastUpdated": "2026-01-18T10:30:00.000Z"
    },
    "status": "running",
    "currentPassengers": 25,
    "assignedRoute": "route-id",
    "driverName": "Rajesh Kumar",
    "phone": "+91-98765-43210"
  }
]
```

### Get Bus by ID

```http
GET /buses/:id
```

### Get Bus Location (Real-time)

```http
GET /buses/:id/location
```

**Response:**
```json
{
  "busId": "507f1f77bcf86cd799439012",
  "busNumber": "TN-01-AB-1234",
  "position": {
    "latitude": 11.0168,
    "longitude": 76.9558,
    "lastUpdated": "2026-01-18T10:30:00.000Z"
  },
  "status": "running"
}
```

### Create Bus

```http
POST /buses
Content-Type: application/json

{
  "busNumber": "TN-01-AB-1234",
  "busType": "AC",
  "capacity": 50,
  "driverName": "Rajesh Kumar",
  "phone": "+91-98765-43210"
}
```

### Update Bus

```http
PUT /buses/:id
Content-Type: application/json

{
  "currentPassengers": 30,
  "status": "stopped"
}
```

### Assign Bus to Route

```http
POST /buses/:id/assign-route
Content-Type: application/json

{
  "routeId": "507f1f77bcf86cd799439011"
}
```

### Delete Bus

```http
DELETE /buses/:id
```

---

## Stops Endpoint

### Get All Stops

```http
GET /stops
```

**Response:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439013",
    "stopId": "uuid-string",
    "stopName": "Main Station",
    "latitude": 11.0168,
    "longitude": 76.9558,
    "city": "Coimbatore",
    "hasShelter": true,
    "hasBench": true,
    "hasWater": true,
    "hasToilet": false,
    "routes": ["route-id-1", "route-id-2"],
    "isActive": true
  }
]
```

### Get Stop by ID

```http
GET /stops/:id
```

### Create Stop

```http
POST /stops
Content-Type: application/json

{
  "stopName": "Main Station",
  "latitude": 11.0168,
  "longitude": 76.9558,
  "city": "Coimbatore",
  "hasShelter": true
}
```

### Update Stop

```http
PUT /stops/:id
Content-Type: application/json

{
  "hasBench": true,
  "hasWater": true
}
```

### Delete Stop

```http
DELETE /stops/:id
```

---

## Schedules Endpoint

### Get All Schedules

```http
GET /schedules
```

**Response:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439014",
    "scheduleId": "uuid-string",
    "bus": "bus-id",
    "route": "route-id",
    "daysOfWeek": ["MON", "TUE", "WED", "THU", "FRI", "SAT"],
    "trips": [
      {
        "tripId": "uuid-string",
        "startTime": "06:00",
        "endTime": "22:00",
        "startStopIndex": 0,
        "endStopIndex": 5,
        "status": "pending"
      }
    ],
    "frequency": 30,
    "isActive": true
  }
]
```

### Get Schedule by ID

```http
GET /schedules/:id
```

### Get Bus Schedule

```http
GET /schedules/bus/:busId
```

### Create Schedule

```http
POST /schedules
Content-Type: application/json

{
  "bus": "bus-id",
  "route": "route-id",
  "daysOfWeek": ["MON", "TUE", "WED", "THU", "FRI"],
  "trips": [
    {
      "startTime": "06:00",
      "endTime": "22:00",
      "startStopIndex": 0,
      "endStopIndex": 5
    }
  ],
  "frequency": 30
}
```

### Update Schedule

```http
PUT /schedules/:id
Content-Type: application/json

{
  "frequency": 45,
  "isActive": false
}
```

### Delete Schedule

```http
DELETE /schedules/:id
```

---

## Error Responses

### 404 Not Found

```json
{
  "error": "Bus not found"
}
```

### 500 Server Error

```json
{
  "error": "Internal server error message"
}
```

---

## Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK |
| 201 | Created |
| 400 | Bad Request |
| 404 | Not Found |
| 500 | Server Error |

---

## Examples

### Create a complete system setup

```bash
# 1. Create a route
curl -X POST http://localhost:5000/api/routes \
  -H "Content-Type: application/json" \
  -d '{
    "routeName": "Main Route",
    "routeNumber": "101",
    "waypoints": [...],
    "stops": [...]
  }'

# 2. Create a bus
curl -X POST http://localhost:5000/api/buses \
  -H "Content-Type: application/json" \
  -d '{
    "busNumber": "TN-01-AB-1234",
    "busType": "AC",
    "capacity": 50
  }'

# 3. Assign bus to route
curl -X POST http://localhost:5000/api/buses/{busId}/assign-route \
  -H "Content-Type: application/json" \
  -d '{"routeId": "route-id"}'

# 4. Track bus in real-time
curl http://localhost:5000/api/buses/{busId}/location
```

---

**API Version:** 1.0  
**Last Updated:** January 2026
