const crypto = require("crypto");

// Timestamp (base36) + 4 random bytes (base36) — safe even when many documents
// are created in the same millisecond via Model.create([...]) in parallel,
// which a plain Date.now()-based id is not.
function generateRef(prefix) {
  const time = Date.now().toString(36).toUpperCase();
  const random = crypto.randomBytes(4).toString("hex").toUpperCase();
  return `${prefix}-${time}${random}`;
}

module.exports = generateRef;
