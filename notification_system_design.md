# Campus Notifications Microservice

# Stage 1
This system is for student notifications.
Student can see notifications,see unread count, mark notification as read.
## API 1
GET /notifications
This API gives notifications.
Example response json:
{
  "success": true,
  "data": []
}
---
## API 2
POST /notifications/read
This API marks notification as read.
Example json:
{
  "notificationId": 1
}
Response json:
{
  "success": true,
  "message": "read success"
}
---
## API 3
GET /notifications/unread-count
This API gives unread count.
Example json:
{
  "success": true,
  "count": 5
}
---

# Stage 2
I use PostgreSQL database.
Because it is easy, good for large data, supports indexing. It can store columns like id,student_id,title,message,is_read,created etc.
---
## Index
CREATE INDEX idx_student
ON notifications(student_id);
This makes query faster.
---

# Stage 3
Query becomes slow when data is very large.
The problems associated with this are filtering, sorting, full table scan.

Better index:
CREATE INDEX idx_notifications
ON notifications(studentID, isRead, createdAt DESC);

So that it can be faster with optimized query.
---

# Stage 4
When many students use app database becomes slow.
Solutions for this can be Redis cache, pagination, websocket, lazy loading.
This reduces load.
---

# Stage 5
Sending notifications one by one is slow.
Better solution for this can be queue system, worker service, async processing.
Tools:RabbitMQ, Kafka.

Flow:

Flow is from Request to Queue to Worker to Notification send.
Advantages are faster, scalable, retry support and better performance.

# Stage 6
Added output screenshots to folder "Notifications"