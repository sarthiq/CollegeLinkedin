/**
 * Utility functions for data validation
 */

/**
 * Validates an email address using regex pattern and length
 * @param {string} email - The email address to validate
 * @param {number} maxLength - Maximum allowed length (default: 254 as per RFC 5321)
 * @returns {boolean} - True if email is valid, false otherwise
 */
exports.isValidEmail = (email, maxLength = 254) => {
    if (!email) return false;
    email = email.trim();
    if (email.length > maxLength) return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

/**
 * Validates a phone number (numeric only) and length
 * @param {string} phone - The phone number to validate
 * @param {number} maxLength - Maximum allowed length (default: 15 as per E.164)
 * @param {number} minLength - Minimum allowed length (default: 10)
 * @returns {boolean} - True if phone number is valid, false otherwise
 */
exports.isValidPhone = (phone, maxLength = 15, minLength = 10) => {
    if (!phone) return false;
    //phone = phone.trim();
    if (phone.length > maxLength || phone.length < minLength) return false;
    const phoneRegex = /^\d+$/;
    return phoneRegex.test(phone);
};

/**
 * Validates a name (allows letters, spaces, and hyphens) and length
 * @param {string} name - The name to validate
 * @param {number} maxLength - Maximum allowed length (default: 50)
 * @param {number} minLength - Minimum allowed length (default: 2)
 * @returns {boolean} - True if name is valid, false otherwise
 */
exports.isValidName = (name, maxLength = 50, minLength = 2) => {
    if (!name) return false;
    name = name.trim();
    if (name.length > maxLength || name.length < minLength) return false;
    const nameRegex = /^[a-zA-Z\s-]+$/;
    return nameRegex.test(name);
};
