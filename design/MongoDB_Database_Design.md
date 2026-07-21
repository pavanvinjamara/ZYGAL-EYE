# MongoDB Database Design (Native Driver, No Mongoose)

## 1. How the Pages Map to Collections

  -----------------------------------------------------------------------
  Page in your app                    Collection(s)
  ----------------------------------- -----------------------------------
  Login screen                        `vendors`, `users`

  Dashboard                           Derived from `tickets`,
                                      `penalties`, `sopViolations`,
                                      `vendors` (no separate collection)

  My Tickets / Ticket Detail          `tickets` (embeds `timeline[]`,
                                      `closureReport`)

  MIS Upload                          `misUploads`, `misWindows`
                                      (30-minute compliance tracking)

  SLA Tracker                         `vendors` (rolling scores) +
                                      `slaRules` (master config)

  Penalties                           `penalties`

  SOP Adherence                       `sopViolations`, `otpLogs`

  Service Reports                     `monthlyReports`

  Contact IIFL                        `contactMessages`

  Auth / Session                      `users`, `refreshTokens`
  -----------------------------------------------------------------------

## Design Principles

-   **Vendor is the tenant boundary** --- Every collection except
    `vendors` and `slaRules` carries `vendorId` and uses compound
    indexes beginning with it.
-   **Reference instead of nesting** --- `tickets`, `penalties`,
    `sopViolations`, and `otpLogs` are separate collections.
-   **Embed only bounded data** --- `timeline[]` and `closureReport`
    remain inside `tickets`.
-   **Separate master/reference data** --- `slaRules` stores
    configurable SLA logic.
-   **Store money as integer paise** --- Format currency only in the
    API/UI layer.

------------------------------------------------------------------------

# Collections

## vendors

``` js
{
  _id: ObjectId,
  code: "zygal",
  name: "Zygal",
  shortCode: "ZG",
  themeColor: "#0891B2",
  branchesCount: 720,
  camerasCount: 11520,
  contact: {
    name: "Pradeep Sharma",
    role: "Account Manager",
    email: "p.sharma@iifl.com",
    phone: "+91-22-4007-7000"
  },
  status: "active",
  createdAt,
  updatedAt
}
```

> Note: `uptime`, `slaP1`, `slaP2`, `slaP3`, `overallSLA`, and
> `penaltyMTD` should be computed or stored in `vendorMetricsMonthly`,
> not inside `vendors`.

------------------------------------------------------------------------

## vendorMetricsMonthly

``` js
{
  _id: ObjectId,
  vendorId: ObjectId,
  month: "2025-06",
  uptimePct: 99.1,
  slaP1: 99.4,
  slaP2: 98.8,
  slaP3: 99.1,
  overallSLA: 99.1,
  penaltyPaise: 0,
  ticketsRaised: 124,
  ticketsResolved: 124,
  computedAt: ISODate
}
```

**Index**

``` text
{ vendorId: 1, month: -1 } (unique)
```

------------------------------------------------------------------------

## users

``` js
{
  _id: ObjectId,
  vendorId: ObjectId,
  name: "Rajesh Kumar",
  email: "r.kumar@zygal.io",
  passwordHash: "$2b$...",
  role: "vendor_admin",
  phone: "+91-98765-00001",
  status: "active",
  lastLoginAt: ISODate,
  failedLoginAttempts: 0,
  lockedUntil: null,
  createdAt,
  updatedAt
}
```

**Indexes**

``` text
{ email: 1 } (unique)
{ vendorId: 1 }
```

------------------------------------------------------------------------

## refreshTokens

``` js
{
  _id: ObjectId,
  userId: ObjectId,
  tokenHash: "sha256...",
  userAgent: "...",
  ip: "...",
  expiresAt: ISODate,
  revoked: false,
  createdAt
}
```

**Indexes**

``` text
{ userId: 1 }
{ expiresAt: 1 } TTL (expireAfterSeconds: 0)
```

------------------------------------------------------------------------

## tickets

``` js
{
  _id: ObjectId,
  ticketId: "#ZD-10815",
  vendorId: ObjectId,
  branchCode: "IIFL-HYD-061",
  subject: "...",
  description: "...",
  priority: "P1 | P2 | P3",
  status: "open",
  slaStatus: "ok",
  openedAt: ISODate,
  resolvedAt: null,
  slaTargetHours: 24,
  timeline: [
    { type: "open", text: "...", at: ISODate, actor: "SOC" }
  ],
  closureReport: {
    fileKey: "s3://.../closure_report.pdf",
    fileName: "...",
    notes: "...",
    engineer: "...",
    branchManager: "...",
    uploadedBy: ObjectId,
    uploadedAt: ISODate
  },
  createdAt,
  updatedAt
}
```

**Indexes**

``` text
{ ticketId: 1 } (unique)
{ vendorId: 1, status: 1, priority: 1 }
{ vendorId: 1, slaStatus: 1 }
{ openedAt: -1 }
```

------------------------------------------------------------------------

## penalties

``` js
{
  _id: ObjectId,
  vendorId: ObjectId,
  ticketId: ObjectId,
  ticketRef: "#ZD-10752",
  incidentDate: ISODate,
  description: "...",
  ruleApplied: "P2 overage @ ₹1,500/hr",
  amountPaise: 800000,
  status: "applied",
  dispute: {
    reason: null,
    raisedAt: null,
    resolvedAt: null,
    resolution: null
  },
  invoiceMonth: "2025-07",
  createdAt
}
```

**Indexes**

``` text
{ vendorId: 1, incidentDate: -1 }
{ vendorId: 1, status: 1 }
```

------------------------------------------------------------------------

## slaRules

``` js
{
  _id,
  priority: "P1",
  triggerDesc: "...",
  responseSLAHours: 1,
  resolutionSLAHours: 4,
  penaltyRatePaisePerHour: 300000,
  dailyCapPaise: 2400000
}
```

------------------------------------------------------------------------

## sopViolations

``` js
{
  _id: ObjectId,
  violationId: "SOP-ANG-041",
  vendorId: ObjectId,
  branchCode: "IIFL-LKO-022",
  operatorId: "OP-AN-02",
  otpLogId: ObjectId,
  type: "OTP Issued Without Identity Verification",
  severity: "high",
  penaltyPaise: 200000,
  status: "open",
  detail: "...",
  occurredAt: ISODate,
  acknowledgedBy: null,
  acknowledgedAt: null,
  createdAt
}
```

**Indexes**

``` text
{ vendorId: 1, status: 1 }
{ vendorId: 1, occurredAt: -1 }
```

------------------------------------------------------------------------

## otpLogs

``` js
{
  _id: ObjectId,
  vendorId: ObjectId,
  branchCode: "IIFL-MUM-047",
  operatorId: "OP-ZG-01",
  requestedByUserId: ObjectId,
  type: "Vault Access",
  checklist: {
    branch_open: true,
    identity_verified: true,
    vault_clear: true,
    no_suspicious: true,
    cameras_live: true,
    reason_logged: true,
    dual_custody: true
  },
  reason: "Gold loan disbursement",
  status: "compliant",
  durationSeconds: 134,
  issuedAt: ISODate,
  createdAt
}
```

**Indexes**

``` text
{ vendorId: 1, issuedAt: -1 }
{ vendorId: 1, status: 1 }
```

------------------------------------------------------------------------

## misUploads

``` js
{
  _id: ObjectId,
  vendorId: ObjectId,
  category: "health",
  fileKey: "s3://.../file.xlsx",
  fileName: "...",
  rowCount: 412,
  sizeBytes: 88320,
  validationWarnings: 0,
  status: "accepted",
  uploadedBy: ObjectId,
  uploadedAt: ISODate,
  windowId: ObjectId
}
```

**Indexes**

``` text
{ vendorId: 1, category: 1, uploadedAt: -1 }
```

------------------------------------------------------------------------

## misWindows

``` js
{
  _id: ObjectId,
  vendorId: ObjectId,
  windowStart: ISODate,
  windowEnd: ISODate,
  status: "submitted",
  submittedAt: ISODate
}
```

**Index**

``` text
{ vendorId: 1, windowStart: -1 }
```

------------------------------------------------------------------------

## contactMessages

``` js
{
  _id,
  vendorId,
  userId,
  subject,
  category,
  message,
  status: "open",
  createdAt
}
```
