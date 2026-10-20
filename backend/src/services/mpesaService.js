const axios = require("axios");

// ===========================================================
// M-PESA ENVIRONMENT
// ===========================================================

const BASE_URL =
  process.env.MPESA_ENV === "production"
    ? "https://api.safaricom.co.ke"
    : "https://sandbox.safaricom.co.ke";

// ===========================================================
// ACCESS TOKEN CACHE
// ===========================================================

var cachedToken = null;
var tokenExpiresAt = 0;

// ===========================================================
// CONFIGURATION
// ===========================================================

function getConfig() {
  var config = {
    consumerKey: process.env.MPESA_CONSUMER_KEY,
    consumerSecret: process.env.MPESA_CONSUMER_SECRET,
    shortcode: process.env.MPESA_SHORTCODE,
    passkey: process.env.MPESA_PASSKEY,
    callbackUrl: process.env.MPESA_CALLBACK_URL,
  };

  var missing = Object.keys(config).filter(function (key) {
    return !config[key];
  });

  if (missing.length > 0) {
    throw new Error(
      "Missing M-Pesa configuration: " + missing.join(", ")
    );
  }

  var callback;

  try {
    callback = new URL(config.callbackUrl);
  } catch (error) {
    throw new Error("MPESA_CALLBACK_URL is not a valid URL");
  }

  if (callback.protocol !== "https:") {
    throw new Error("MPESA_CALLBACK_URL must use HTTPS");
  }

  return {
    consumerKey: config.consumerKey,
    consumerSecret: config.consumerSecret,
    shortcode: config.shortcode,
    passkey: config.passkey,
    callbackUrl: callback.toString(),
  };
}

// ===========================================================
// ACCESS TOKEN
// ===========================================================

async function getAccessToken() {
  if (cachedToken && Date.now() < tokenExpiresAt) {
    return cachedToken;
  }

  var config = getConfig();

  var auth = Buffer.from(
    config.consumerKey + ":" + config.consumerSecret
  ).toString("base64");

  try {
    var response = await axios.get(
      BASE_URL + "/oauth/v1/generate?grant_type=client_credentials",
      {
        headers: {
          Authorization: "Basic " + auth,
        },
        timeout: 30000,
      }
    );

    var accessToken = response.data.access_token;
    var expiresIn = Number(response.data.expires_in) || 3600;

    if (!accessToken) {
      throw new Error(
        "Safaricom did not return an access token"
      );
    }

    cachedToken = accessToken;

    tokenExpiresAt =
      Date.now() + Math.max(expiresIn - 60, 60) * 1000;

    return cachedToken;
  } catch (error) {
    cachedToken = null;
    tokenExpiresAt = 0;

    var message =
      (error.response &&
        error.response.data &&
        (error.response.data.errorMessage ||
          error.response.data.error_description)) ||
      error.message ||
      "Failed to obtain M-Pesa access token";

    throw new Error("M-Pesa OAuth error: " + message);
  }
}

// ===========================================================
// TIMESTAMP
// ===========================================================

function generateTimestamp() {
  var date = new Date();

  function pad(number) {
    return String(number).padStart(2, "0");
  }

  return (
    String(date.getFullYear()) +
    pad(date.getMonth() + 1) +
    pad(date.getDate()) +
    pad(date.getHours()) +
    pad(date.getMinutes()) +
    pad(date.getSeconds())
  );
}

// ===========================================================
// PASSWORD
// ===========================================================

function generatePassword(timestamp) {
  var config = getConfig();

  var raw =
    config.shortcode + config.passkey + timestamp;

  return Buffer.from(raw).toString("base64");
}

// ===========================================================
// KENYAN PHONE NUMBER NORMALIZATION
// ===========================================================

function normalizePhone(phone) {
  if (!phone) {
    throw new Error("M-Pesa phone number is required");
  }

  var normalized = String(phone)
    .trim()
    .replace(/\s+/g, "")
    .replace(/^\+/, "");

  // Convert 07XXXXXXXX or 01XXXXXXXX to 254 format.
  if (normalized.startsWith("0")) {
    normalized = "254" + normalized.slice(1);
  } else if (
    normalized.startsWith("7") ||
    normalized.startsWith("1")
  ) {
    normalized = "254" + normalized;
  }

  // Accept Kenyan mobile numbers beginning with 2547 or 2541.
  if (!/^254[17]\d{8}$/.test(normalized)) {
    throw new Error(
      "Invalid Kenyan M-Pesa phone number. Use 07XXXXXXXX, 01XXXXXXXX, +254XXXXXXXXX, or 254XXXXXXXXX."
    );
  }

  return normalized;
}

// ===========================================================
// INITIATE STK PUSH
// ===========================================================

async function initiateSTKPush(options) {
  options = options || {};

  var rawPhone = options.phone;
  var amount = options.amount;
  var accountReference = options.accountReference;
  var transactionDesc = options.transactionDesc;

  var config = getConfig();
  var phone = normalizePhone(rawPhone);
  var numericAmount = Number(amount);

  if (
    !Number.isFinite(numericAmount) ||
    numericAmount <= 0
  ) {
    throw new Error(
      "M-Pesa amount must be greater than zero"
    );
  }

  var token = await getAccessToken();
  var timestamp = generateTimestamp();
  var password = generatePassword(timestamp);

  // AccountReference is limited to 12 characters.
  var finalAccountReference = String(
    accountReference || "Aurelia Suites"
  )
    .trim()
    .slice(0, 12);

  // TransactionDesc is limited to 13 characters.
  var finalTransactionDesc = String(
    transactionDesc || "Hotel Payment"
  )
    .trim()
    .slice(0, 13);

  var payload = {
    BusinessShortCode: config.shortcode,
    Password: password,
    Timestamp: timestamp,
    TransactionType: "CustomerPayBillOnline",
    Amount: Math.round(numericAmount),
    PartyA: phone,
    PartyB: config.shortcode,
    PhoneNumber: phone,
    CallBackURL: config.callbackUrl,
    AccountReference: finalAccountReference,
    TransactionDesc: finalTransactionDesc,
  };

  console.log("M-Pesa callback URL:", config.callbackUrl);

  try {
    var response = await axios.post(
      BASE_URL + "/mpesa/stkpush/v1/processrequest",
      payload,
      {
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
        timeout: 30000,
      }
    );

    var data = response.data;

    console.log("M-Pesa STK Push response:", {
      responseCode: data.ResponseCode,
      responseDescription: data.ResponseDescription,
      checkoutRequestId: data.CheckoutRequestID,
    });

    return data;
  } catch (error) {
    var safaricomResponse =
      error.response && error.response.data;

    console.error("M-Pesa STK Push failed:", {
      status: error.response && error.response.status,
      errorCode:
        safaricomResponse && safaricomResponse.errorCode,
      errorMessage:
        safaricomResponse && safaricomResponse.errorMessage,
      responseCode:
        safaricomResponse && safaricomResponse.ResponseCode,
      responseDescription:
        safaricomResponse &&
        safaricomResponse.ResponseDescription,
    });

    var message =
      (safaricomResponse &&
        (safaricomResponse.errorMessage ||
          safaricomResponse.ResponseDescription)) ||
      error.message ||
      "M-Pesa STK Push failed";

    throw new Error("M-Pesa STK Push failed: " + message);
  }
}

// ===========================================================
// QUERY STK PUSH STATUS
// ===========================================================

async function querySTKPushStatus(checkoutRequestId) {
  if (!checkoutRequestId) {
    throw new Error("CheckoutRequestID is required");
  }

  var config = getConfig();
  var token = await getAccessToken();
  var timestamp = generateTimestamp();
  var password = generatePassword(timestamp);

  var payload = {
    BusinessShortCode: config.shortcode,
    Password: password,
    Timestamp: timestamp,
    CheckoutRequestID: checkoutRequestId,
  };

  try {
    var response = await axios.post(
      BASE_URL + "/mpesa/stkpushquery/v1/query",
      payload,
      {
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
        timeout: 30000,
      }
    );

    return response.data;
  } catch (error) {
    var safaricomResponse =
      error.response && error.response.data;

    console.error("M-Pesa STK query failed:", {
      status: error.response && error.response.status,
      errorCode:
        safaricomResponse && safaricomResponse.errorCode,
      errorMessage:
        safaricomResponse && safaricomResponse.errorMessage,
      responseCode:
        safaricomResponse && safaricomResponse.ResponseCode,
      responseDescription:
        safaricomResponse &&
        safaricomResponse.ResponseDescription,
    });

    var message =
      (safaricomResponse &&
        (safaricomResponse.errorMessage ||
          safaricomResponse.ResponseDescription)) ||
      error.message ||
      "M-Pesa STK query failed";

    throw new Error("M-Pesa STK query failed: " + message);
  }
}

// ===========================================================
// EXPORTS
// ===========================================================

module.exports = {
  getAccessToken: getAccessToken,
  initiateSTKPush: initiateSTKPush,
  querySTKPushStatus: querySTKPushStatus,
  normalizePhone: normalizePhone,
};
