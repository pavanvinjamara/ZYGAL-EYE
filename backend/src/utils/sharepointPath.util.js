// backend/src/utils/sharepointPath.util.js
const { env } = require('../config/env');

/**
 * Builds a deterministic SharePoint folder path for a footage request, e.g.:
 * https://iifl.sharepoint.com/sites/eye-footage/ZG/IIFL-MUM-047/Transaction/FR-2025-0041
 */
function buildSharepointPath({ vendorShortCode, branchCode, type, requestRef }) {
  const segments = [vendorShortCode, branchCode, type, requestRef]
    .filter(Boolean)
    .map((s) => encodeURIComponent(String(s).trim()));
  return `${env.SHAREPOINT_BASE_URL.replace(/\/+$/, '')}/${segments.join('/')}`;
}

module.exports = { buildSharepointPath };
