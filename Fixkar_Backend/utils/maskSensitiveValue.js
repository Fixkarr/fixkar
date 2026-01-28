
/**
 * Masks sensitive strings like bank account, IFSC, PAN, etc.
 *
 * @param {string} value - original value (account / IFSC / PAN)
 * @param {number} visibleDigits - how many last digits to show (default 4)
 * @param {string} maskChar - masking character (default *)
 * @returns {string}
 */

export const maskSensitiveValue = (
  value,
  visibleDigits = 4,
  maskChar = "*"
) => {
  if (!value || typeof value !== "string") return "";

  if (value.length <= visibleDigits) {
    return value;
  }

  const maskedPart = maskChar.repeat(value.length - visibleDigits);
  const visiblePart = value.slice(-visibleDigits);

  return `${maskedPart}${visiblePart}`;
};
