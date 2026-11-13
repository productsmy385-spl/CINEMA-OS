# Notification & Dispatch Engine
## CINEMA OS — Multi-Channel Call Sheet & Schedule Dispatch

### 1. Delivery Channels
1. **In-App Notification Center:** Real-time push within the web and desktop UI with sound and desktop toast alerts.
2. **Native Mobile Push:** Apple APNS and Google FCM via Expo Push Notification service.
3. **Email Notifications:** Transactional emails with styled PDF call sheets attached.
4. **WhatsApp Dispatch (Meta Cloud API Integration):** One-tap call sheet summaries with direct confirmation links.

---

### 2. High-Priority Event Types
- `CALL_SHEET_PUBLISHED`: Dispatched immediately to all cast and crew listed on the daily schedule.
- `CALL_SHEET_REVISED`: Sent exclusively to individuals whose scene numbers, pickup times, or locations changed.
- `SCHEDULE_CONFLICT_DETECTED`: Warning triggered to manager and 1st AD when an actor is double-booked.
- `AGREEMENT_SIGNATURE_REQUESTED`: Sent to actor and manager when a formal agreement is ready for electronic signing.
- `EXPENSE_APPROVED_OR_REJECTED`: Instant notification to crew member regarding payment status.

---

### 3. Escalation & Acknowledgment Tracking
When a call sheet is published:
1. System sends In-App + Push notification.
2. System begins countdown timer (configurable, default: 4 hours before shoot or 10:00 PM previous evening).
3. If actor or department head has not acknowledged receipt:
   - Automated reminder sent at T-2 hours.
   - 2nd AD dashboard flags the unacknowledged recipient in red.
   - 2nd AD can trigger automated WhatsApp / SMS dispatch.

