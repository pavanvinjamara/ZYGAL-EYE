src/
│
├── config/
│   ├── db.js
│   ├── env.js
│   ├── jwt.js
│
├── controllers/
│   ├── auth.controller.js
│   ├── user.controller.js
│   ├── ticket.controller.js
│
├── services/
│   ├── auth.service.js
│   ├── user.service.js
│   ├── ticket.service.js
│   ├── token.service.js
│
├── repositories/
│   ├── user.repository.js
│   ├── ticket.repository.js
│   ├── role.repository.js
│   ├── refreshToken.repository.js
│
├── models/
│   ├── user.model.js
│   ├── role.model.js
│   ├── refreshToken.model.js
│   ├── ticket.model.js
│
├── validators/
│   ├── auth.validator.js
│   ├── user.validator.js
│   ├── ticket.validator.js
│
├── middleware/
│   ├── authenticate.js
│   ├── authorize.js
│   ├── validate.js
│   ├── errorHandler.js
│
├── routes/
│   ├── auth.routes.js
│   ├── user.routes.js
│   ├── ticket.routes.js
│
├── utils/
│   ├── bcrypt.js
│   ├── jwt.js
│   ├── response.js
│   ├── logger.js
│   ├── constants.js
│
├── database/
│   ├── collections.js
│   ├── indexes.js
│
├── app.js
└── server.js


Final folder struture 

ZYGAL-EYE/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js
│   │   │   └── env.js
│   │   ├── models/
│   │   │   ├── user.model.js
│   │   │   ├── vendor.model.js
│   │   │   ├── refreshToken.model.js
│   │   │   ├── branch.model.js
│   │   │   ├── camera.model.js
│   │   │   ├── ticket.model.js
│   │   │   ├── penalty.model.js
│   │   │   ├── sopViolation.model.js
│   │   │   ├── otpLog.model.js
│   │   │   ├── misUpload.model.js
│   │   │   ├── bleAsset.model.js          # locker/cassette/device/firearm/key tracking
│   │   │   ├── footageRequest.model.js    # transaction/auction CCTV requests
│   │   │   ├── auditLog.model.js
│   │   │   └── notification.model.js
│   │   ├── repositories/
│   │   │   ├── user.repository.js
│   │   │   ├── vendor.repository.js
│   │   │   ├── refreshToken.repository.js
│   │   │   ├── branch.repository.js
│   │   │   ├── ticket.repository.js
│   │   │   ├── penalty.repository.js
│   │   │   ├── sop.repository.js          # violations + OTP checklist log
│   │   │   ├── mis.repository.js
│   │   │   ├── ble.repository.js          # asset ping/location/status
│   │   │   ├── footage.repository.js
│   │   │   ├── audit.repository.js
│   │   │   └── notification.repository.js
│   │   ├── services/
│   │   │   ├── auth.service.js
│   │   │   ├── vendor.service.js
│   │   │   ├── onboarding.service.js      # 4-step vendor onboarding orchestration
│   │   │   ├── ticket.service.js
│   │   │   ├── sla.service.js             # P1/P2/P3 target + penalty calc
│   │   │   ├── penalty.service.js
│   │   │   ├── sop.service.js             # OTP checklist validation, violation detection
│   │   │   ├── mis.service.js             # 30-min window tracking
│   │   │   ├── ble.service.js
│   │   │   ├── footage.service.js         # SharePoint path generation
│   │   │   ├── notification.service.js
│   │   │   └── admin.service.js           # leaderboard, global stats
│   │   ├── controllers/
│   │   │   ├── auth.controller.js
│   │   │   ├── vendor.controller.js
│   │   │   ├── onboarding.controller.js
│   │   │   ├── ticket.controller.js
│   │   │   ├── sla.controller.js
│   │   │   ├── penalty.controller.js
│   │   │   ├── sop.controller.js
│   │   │   ├── mis.controller.js
│   │   │   ├── ble.controller.js
│   │   │   ├── footage.controller.js
│   │   │   └── admin.controller.js
│   │   ├── routes/
│   │   │   ├── index.js
│   │   │   ├── auth.routes.js
│   │   │   ├── vendor/                    # vendor-portal-facing (scoped to own vendorId)
│   │   │   │   ├── vendor.routes.js
│   │   │   │   ├── ticket.routes.js
│   │   │   │   ├── sla.routes.js
│   │   │   │   ├── penalty.routes.js
│   │   │   │   ├── sop.routes.js
│   │   │   │   ├── mis.routes.js
│   │   │   │   ├── ble.routes.js
│   │   │   │   └── footage.routes.js
│   │   │   └── admin/                     # iifl_soc only
│   │   │       ├── admin.routes.js        # global overview, leaderboard
│   │   │       ├── onboarding.routes.js   # vendor onboarding wizard steps
│   │   │       ├── adminVendor.routes.js  # suspend/activate vendors
│   │   │       ├── adminUser.routes.js    # cross-vendor user management
│   │   │       ├── adminBle.routes.js     # cross-vendor asset map
│   │   │       ├── adminFootage.routes.js # footage request tracking
│   │   │       └── auditLog.routes.js
│   │   ├── middleware/
│   │   │   ├── auth.middleware.js
│   │   │   ├── role.middleware.js         # requireRole + scopeToOwnVendor
│   │   │   ├── rateLimit.middleware.js
│   │   │   ├── upload.middleware.js       # closure reports, MIS files
│   │   │   ├── error.middleware.js
│   │   │   └── validate.middleware.js
│   │   ├── validators/
│   │   │   ├── auth.validator.js
│   │   │   ├── vendor.validator.js
│   │   │   ├── onboarding.validator.js
│   │   │   ├── ticket.validator.js
│   │   │   ├── sop.validator.js           # OTP checklist completeness
│   │   │   └── admin.validator.js
│   │   ├── utils/
│   │   │   ├── jwt.util.js
│   │   │   ├── password.util.js
│   │   │   ├── objectId.util.js
│   │   │   ├── logger.util.js
│   │   │   ├── apiResponse.util.js
│   │   │   ├── slaCalculator.util.js
│   │   │   └── sharepointPath.util.js     # auto-generates footage upload paths
│   │   └── jobs/
│   │       ├── misTimerCheck.job.js       # 30-min window enforcement
│   │       └── slaBreachCheck.job.js
│   ├── scripts/
│   │   ├── seed.js
│   │   └── createIndexes.js
│   ├── uploads/
│   ├── .env / .env.example / .gitignore
│   └── package.json / server.js
│
├── frontend/
│   ├── src/
│   │   ├── assets/styles/
│   │   │   ├── tokens.css
│   │   │   ├── theme-admin.css
│   │   │   ├── theme-vendor.css
│   │   │   └── theme-vars.css
│   │   ├── services/
│   │   │   ├── api.service.js
│   │   │   ├── auth.service.js
│   │   │   ├── vendor/
│   │   │   │   ├── ticket.service.js
│   │   │   │   ├── sla.service.js
│   │   │   │   ├── penalty.service.js
│   │   │   │   ├── sop.service.js         # OTP issuance flow
│   │   │   │   ├── mis.service.js
│   │   │   │   └── ble.service.js
│   │   │   └── admin/
│   │   │       ├── onboarding.service.js
│   │   │       ├── vendorManagement.service.js
│   │   │       ├── userManagement.service.js
│   │   │       ├── leaderboard.service.js
│   │   │       ├── bleTracking.service.js
│   │   │       ├── footage.service.js
│   │   │       └── auditLog.service.js
│   │   ├── stores/
│   │   │   ├── store.js
│   │   │   ├── auth.store.js
│   │   │   ├── vendor.store.js
│   │   │   ├── tickets.store.js
│   │   │   ├── misTimer.store.js          # 30-min countdown state
│   │   │   └── admin.store.js
│   │   ├── composables/
│   │   │   ├── toast.composable.js
│   │   │   ├── permissions.composable.js
│   │   │   └── misCountdown.composable.js # shared countdown logic
│   │   ├── components/
│   │   │   ├── shared/                    # ← the unified library from §1
│   │   │   │   ├── KpiCard.vue
│   │   │   │   ├── StatusPill.vue
│   │   │   │   ├── PriorityBadge.vue
│   │   │   │   ├── DataTable.vue
│   │   │   │   ├── Panel.vue
│   │   │   │   ├── Notice.vue
│   │   │   │   ├── Timeline.vue
│   │   │   │   ├── ComplianceArc.vue
│   │   │   │   └── SlaBar.vue
│   │   │   ├── layout/
│   │   │   │   ├── AppHeader.vue
│   │   │   │   └── AppSidebar.vue
│   │   │   ├── vendor/
│   │   │   │   ├── tickets/
│   │   │   │   │   ├── TicketTable.vue
│   │   │   │   │   ├── TicketDetailPanel.vue
│   │   │   │   │   └── ClosureReportModal.vue
│   │   │   │   ├── sop/
│   │   │   │   │   ├── OtpIssueModal.vue  # 7-step mandatory checklist
│   │   │   │   │   ├── ViolationList.vue
│   │   │   │   │   └── OtpLogTable.vue
│   │   │   │   ├── mis/
│   │   │   │   │   ├── UploadDropzone.vue
│   │   │   │   │   └── CountdownWidget.vue
│   │   │   │   └── penalties/
│   │   │   │       ├── PenaltyStatement.vue
│   │   │   │       └── DisputeForm.vue
│   │   │   └── admin/
│   │   │       ├── onboarding/
│   │   │       │   ├── Stepper.vue
│   │   │       │   ├── VendorDetailsStep.vue
│   │   │       │   ├── ContactStep.vue
│   │   │       │   ├── SiteAllocationStep.vue
│   │   │       │   └── ReviewActivateStep.vue
│   │   │       ├── ble/
│   │   │       │   ├── AssetMap.vue       # India map with status pins
│   │   │       │   ├── AssetList.vue
│   │   │       │   └── AssetDetailPanel.vue
│   │   │       ├── footage/
│   │   │       │   ├── FootageRequestForm.vue
│   │   │       │   └── FootageRequestTable.vue
│   │   │       ├── VendorTable.vue
│   │   │       ├── UserTable.vue
│   │   │       ├── LeaderboardTable.vue
│   │   │       ├── AuditLogTable.vue
│   │   │       └── AdHocSRModal.vue       # raise D365 service request
│   │   ├── layouts/
│   │   │   ├── AuthLayout.vue
│   │   │   ├── MainLayout.vue
│   │   │   ├── VendorLayout.vue
│   │   │   └── AdminLayout.vue
│   │   ├── views/
│   │   │   ├── NotFoundView.vue
│   │   │   ├── auth/LoginView.vue
│   │   │   ├── vendor/
│   │   │   │   ├── DashboardView.vue
│   │   │   │   ├── TicketsView.vue
│   │   │   │   ├── MisUploadView.vue
│   │   │   │   ├── SlaTrackerView.vue
│   │   │   │   ├── PenaltiesView.vue
│   │   │   │   ├── SopAdherenceView.vue
│   │   │   │   ├── ReportsView.vue
│   │   │   │   ├── ProfileView.vue
│   │   │   │   └── ContactView.vue
│   │   │   └── admin/
│   │   │       ├── AdminOverviewView.vue
│   │   │       ├── HealthDashboardView.vue
│   │   │       ├── LiveCamerasView.vue
│   │   │       ├── TicketsView.vue        # D365 SR queue
│   │   │       ├── SlaPenaltyView.vue
│   │   │       ├── VendorManagementView.vue
│   │   │       ├── OnboardingView.vue
│   │   │       ├── UserManagementView.vue
│   │   │       ├── FootageRequestsView.vue
│   │   │       ├── BleTrackingView.vue
│   │   │       ├── ExecutiveDashboardView.vue
│   │   │       └── LeaderboardView.vue
│   │   ├── router/
│   │   │   ├── index.js
│   │   │   ├── guards.js
│   │   │   └── routes/
│   │   │       ├── auth.routes.js
│   │   │       ├── vendor.routes.js
│   │   │       └── admin.routes.js
│   │   ├── utils/
│   │   │   ├── theme.util.js
│   │   │   └── waveTransition.util.js
│   │   ├── App.vue
│   │   └── main.js
│   └── (index.html, vite.config.js, package.json, etc. — unchanged)
│
├── design/
│   ├── MongoDB_Database_Design.md
│   ├── iifl-eye-admin.html
│   ├── iifl-eye-vendor-portal.html
│   └── login-account
├── documentation/
│   ├── project-overview.md
│   └── project-structure.md
└── README.md




│   │   ├── components/
│   │   │   ├── shared/
            │   ├── KpiCard.vue
            │   ├── StatusPill.vue
            │   ├── PriorityBadge.vue
            │   ├── DataTable.vue
            │   ├── Panel.vue
            │   ├── Notice.vue
            │   ├── Timeline.vue
            │   ├── ComplianceArc.vue
            │   ├── SlaBar.vue
            │   ├── LiveClock.vue           # ← shared: both headers show an IST clock
            │   └── LogoutButton.vue        # ← shared: identical behavior, just styled differently via CSS var
    |
            ├── layout/
            │   ├── admin/
            │   │   ├── AdminHeader.vue     # status bar: brand, heartbeat, system-ok pulse, KPI stats, clock, user chip
            │   │   └── AdminSidebar.vue    # Operations/Ticketing/Vendors/Reports nav + badges
            │   └── vendor/
            │       ├── VendorHeader.vue    # topbar: logo, vendor chip, notif bell, clock, sign-out
            │       └── VendorSidebar.vue   # Main/Performance/Account nav + SLA mini-gauge footer