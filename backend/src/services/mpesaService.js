const axios = require("axios");

/*
 * M-Pesa environment
 *
 * sandbox:
 * https://sandbox.safaricom.co.ke
 *
 * production:
 * https://api.safaricom.co.ke
 */
const BASE_URL =
  process.env.MPESA_ENV === "production"
    ? "https://api.safaricom.co.ke"
    : "https://sandbox.safaricom.co.ke";

// ===========================================================
// ACCESS TOKEN CACHE
// ===========================================================

let cachedToken = null;
let tokenExpiresAt = 0;

// ===========================================================
// CONFIGURATION
// ===========================================================

function getConfig() {
  const config = {
    consumerKey: process.env.MPESA_CONSUMER_KEY,
    consumerSecret: process.env.MPESA_CONSUMER_SECRET,
    shortcode: process.env.MPESA_SHORTCODE,
    passkey: process.env.MPESA_PASSKEY,
    callbackUrl: process.env.MPESA_CALLBACK_URL,
  };

  const missing = Object.entries(config)
    .filter(([, value]) => !value)
    .map(([key]) => key);

  if (missing.length > 0) {
    throw new Error(
      `Missing M-Pesa configuration: ${missing.join(", ")}`
    );
  }

  /*
   * ---------------------------------------------------------
   * Validate callback URL
   * ---------------------------------------------------------
   */

  let callback;

  try {
    callback = new URL(config.callbackUrl);
  } catch {
    throw new Error(
      "MPESA_CALLBACK_URL is not a valid URL"
    );
  }

  if (callback.protocol !== "https:") {
    throw new Error(
      "MPESA_CALLBACK_URL must use HTTPS"
    );
  }

  return {
    ...config,
    callbackUrl: callback.toString(),
  };
}

// ===========================================================
// ACCESS TOKEN
// ===========================================================

async function getAccessToken() {
  if (
    cachedToken &&
    Date.now() < tokenExpiresAt
  ) {
    return cachedToken;
  }

  const {
    consumerKey,
    consumerSecret,
  } = getConfig();

  const auth = Buffer.from(
    `${consumerKey}:${consumerSecret}`
  ).toString("base64");

  try {
    const response = await axios.get(
      `${BASE_URL}/oauth/v1/generate?grant_type=client_credentials`,
      {
        headers: {
          Authorization: `Basic ${auth}`,
        },
        timeout: 30000,
      }
    );

    const {
      access_token,
      expires_in,
    } = response.data;

    if (!access_token) {
      throw new Error(
        "Safaricom did not return an access token"
      );
    }

    cachedToken = access_token;

    const expiresInSeconds =
      Number(expires_in) || 3600;

    tokenExpiresAt =
      Date.now() +
      Math.max(
        expiresInSeconds - 60,
        60
      ) *
        1000;

    return cachedToken;
  } catch (error) {
    cachedToken = null;
    tokenExpiresAt = 0;

    const message =
      error.response?.data?.errorMessage ||
      error.response?.data?.error_description ||
      error.message ||
      "Failed to obtain M-Pesa access token";

    throw new Error(
      `M-Pesa OAuth error: ${message}`
    );
  }
}

// ===========================================================
// TIMESTAMP
// ===========================================================

function generateTimestamp() {
  const d = new Date();

  const pad = (number) =>
    String(number).padStart(2, "0");

  return (
    `${d.getFullYear()}` +
    `${pad(d.getMonth() + 1)}` +
    `${pad(d.getDate())}` +
    `${pad(d.getHours())}` +
    `${pad(d.getMinutes())}` +
    `${pad(d.getSeconds())}`
  );
}

// ===========================================================
// PASSWORD
// ===========================================================

function generatePassword(timestamp) {
  const {
    shortcode,
    passkey,
  } = getConfig();

  const raw =
    `${shortcode}${passkey}${timestamp}`;

  return Buffer.from(raw).toString("base64");
}

// ===========================================================
// PHONE NORMALIZATION
// ===========================================================

function normalizePhone(phone) {
  if (!phone) {
    throw new Error(
      "M-Pesa phone number is required"
    );
  }

  let p = String(phone)
    .trim()
    .replace(/\s+/g, "")
    .replace(/^\+/, "");

  /*
   * 0712345678
   * 0112345678
   */
  if (p.startsWith("0")) {
    p = `254${p.slice(1)}`;
  }

  /*
   * 712345678
   * 112345678
   */
  else if (
    p.startsWith("7") ||
    p.startsWith("1")
  ) {
    p = `254${p}`;
  }

  /*
   * Final accepted format:
   *
   * 2547XXXXXXXX
   * 2541XXXXXXXX
   */
  if (!/^254[17]\d{8}$/.test(p)) {
    throw new Error(
      "Invalid Kenyan M-Pesa phone number. Use 07XXXXXXXX, 01XXXXXXXX, +254XXXXXXXXX, or 254XXXXXXXXX."
    );
  }

  return p;
}

// ===========================================================
// STK PUSH
// ===========================================================

async function initiateSTKPush({
  phone: rawPhone,
  amount,
  accountReference,
  transactionDesc,
}) {
  /*
   * Get configuration.
   *
   * callbackUrl comes ONLY from MPESA_CALLBACK_URL.
   */
  const config = getConfig();

  const token = await getAccessToken();

  const timestamp = generateTimestamp();

  const password =
    generatePassword(timestamp);

  const phone =
    normalizePhone(rawPhone);

  const numericAmount = Number(amount);

  if (
    !Number.isFinite(numericAmount) ||
    numericAmount <= 0
  ) {
    throw new Error(
      "M-Pesa amount must be greater than zero"
    );
  }

  /*
   * IMPORTANT:
   *
   * Do NOT allow the frontend or controller to override
   * the callback URL.
   */
  const finalCallbackUrl =
    config.callbackUrl;

  /*
   * Log the URL being used, but NEVER log M-Pesa secrets.
   */
  console.log(
    "M-Pesa callback URL:",
    finalCallbackUrl
  );

  // =========================================================
  // SAFARICOM STK PAYLOAD
  // =========================================================

  const payload = {
    BusinessShortCode:
      config.shortcode,

    Password:
      password,

    Timestamp:
      timestamp,

    TransactionType:
      "CustomerPayBillOnline",

    Amount:
      Math.round(numericAmount),

    PartyA:
      phone,

    PartyB:
      config.shortcode,

    PhoneNumber:
      phone,

    CallBackURL:
      finalCallbackUrl,

    AccountReference: String(
      accountReference ||
        "Aurelia Suites"
    ).slice(0, 12),

    TransactionDesc: String(
      transactionDesc ||
        "Payment"
    ).slice(0, 13),
  };

  try {
    const response = await axios.post(
      `${BASE_URL}/mpesa/stkpush/v1/processrequest`,
      payload,
      {
        headers: {
          Authorization:
            `Bearer ${token}`,

          "Content-Type":
            "application/json",
        },

        timeout: 30000,
      }
    );

    const data = response.data;

    console.log(
      "M-Pesa STK Push response:",
      {
        responseCode:
          data.ResponseCode,

        responseDescription:
          data.ResponseDescription,

        checkoutRequestId:
          data.CheckoutRequestID,
      }
    );

    return data;
  } catch (error) {
    const safaricomResponse =
      error.response?.data;

    console.error(
      "M-Pesa STK Push failed:",
      {
        status:
          error.response?.status,

        errorCode:
          safaricomResponse?.errorCode,

        errorMessage:
          safaricomResponse?.errorMessage,

        responseCode:
          safaricomResponse?.ResponseCode,

        responseDescription:
          safaricomResponse
            ?.ResponseDescription,
      }
    );

    const message =
      safaricomResponse?.errorMessage ||
      safaricomResponse?.ResponseDescription ||
      error.message ||
      "M-Pesa STK Push failed";

    throw new Error(
      `M-Pesa STK Push failed: ${message}`
    );
  }
}

// ===========================================================
// STK QUERY
// ===========================================================

async function querySTKPushStatus(
  checkoutRequestId
) {
  if (!checkoutRequestId) {
    throw new Error(
      "CheckoutRequestID is required"
    );
  }

  const config = getConfig();

  const token =
    await getAccessToken();

  const timestamp =
    generateTimestamp();

  const password =
    generatePassword(timestamp);

  const payload = {
    BusinessShortCode:
      config.shortcode,

    Password:
      password,

    Timestamp:
      timestamp,

    CheckoutRequestID:
      checkoutRequestId,
  };

  try {
    const response = await axios.post(
      `${BASE_URL}/mpesa/stkpushquery/v1/query`,
      payload,
      {
        headers: {
          Authorization:
            `Bearer ${token}`,

          "Content-Type":
            "application/json",
        },

        timeout: 30000,
      }
    );

    return response.data;
  } catch (error) {
    const safaricomResponse =
      error.response?.data;

    console.error(
      "M-Pesa STK query failed:",
      {
        status:
          error.response?.status,

        errorCode:
          safaricomResponse?.errorCode,

        errorMessage:
          safaricomResponse?.errorMessage,

        responseCode:
          safaricomResponse?.ResponseCode,

        responseDescription:
          safaricomResponse
            ?.ResponseDescription,
      }
    );

    const message =
      safaricomResponse?.errorMessage ||
      safaricomResponse?.ResponseDescription ||
      error.message ||
      "M-Pesa STK query failed";

    throw new Error(
      `M-Pesa STK query failed: ${message}`
    );
  }
}

// ===========================================================
// EXPORTS
// ===========================================================

module.exports = {
  getAccessToken,
  initiateSTKPush,
  querySTKPushStatus,
  normalizePhone,
};