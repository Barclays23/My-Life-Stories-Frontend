export const firebaseErrorMap = new Map([
  // General
  ['auth/app-deleted', 'The Firebase app was deleted. Please reload and try again.'],
  ['auth/app-not-authorized', 'This app is not authorized to use Firebase Authentication.'],
  ['auth/internal-error', 'An internal error occurred. Please try again later.'],
  ['auth/network-request-failed', 'Network error. Please check your internet connection.'],
  ['auth/operation-not-allowed', 'Operation not allowed. Please contact support.'],


  // Sign-in/Sign-up
  ['auth/account-exists-with-different-credential', 'An account already exists with a different sign-in method.'],
  ['auth/email-already-exists', 'The email address is already in use by another account.'],
  ['auth/email-already-in-use', 'This email is already registered.'],
  ['auth/invalid-email', 'Invalid email address.'],
  ['auth/invalid-password', 'Invalid password. Must be at least 6 characters.'],
  ['auth/missing-password', 'Please enter your password.'],
  ['auth/too-many-requests', 'Too many failed attempts. Please try again later.'],
  ['auth/user-not-found', 'No account found with this email.'],
  ['auth/weak-password', 'Weak password. Please choose a stronger one (minimum 6 characters).'],
  ['auth/wrong-password', 'Incorrect password. Please try again.'],
  

  // Credential / Provider
  ['auth/credential-already-in-use', 'This credential is already associated with another account.'],
  ['auth/invalid-credential', 'Invalid credentials. Please try again.'],
  ['auth/invalid-verification-code', 'Invalid verification code.'],
  ['auth/invalid-verification-id', 'Invalid verification ID.'],

  // Popup/Redirect
  ['auth/popup-blocked', 'Popup was blocked. Please allow popups and try again.'],
  ['auth/popup-closed-by-user', 'The popup was closed before completing sign-in.'],
  ['auth/unauthorized-domain', 'Unauthorized domain. Please contact support.'],

  // Token & Session
  ['auth/id-token-expired', 'Your session has expired. Please sign in again.'],
  ['auth/null-user', 'No user is signed in.'],
  ['auth/user-disabled', 'This account has been disabled by an administrator.'],
  ['auth/user-token-expired', 'Your session has expired. Please log in again.'],

  // Multi-factor auth
  ['auth/invalid-multi-factor-session', 'Invalid multi-factor session.'],
  ['auth/missing-multi-factor-info', 'Missing multi-factor information.'],
  ['auth/multi-factor-auth-required', 'Multi-factor authentication is required.'],
  ['auth/multi-factor-info-not-found', 'Multi-factor information not found.'],

  // Phone Auth
  ['auth/code-expired', 'Verification code has expired.'],
  ['auth/invalid-phone-number', 'Invalid phone number.'],
  ['auth/missing-phone-number', 'Phone number is required.'],
  ['auth/quota-exceeded', 'SMS quota exceeded. Try again later.'],

  // Custom Claims / Permissions
  ['auth/claims-too-large', 'Custom claims object is too large.'],
  ['auth/insufficient-permission', 'You do not have permission to perform this action.'],

  // Others / Edge Cases
  ['auth/missing-email', 'Please enter your email address.'],
  ['auth/timeout', 'Request timed out. Please try again.'],
  ['auth/user-mismatch', 'User credentials do not match.'],
]);

