/**
 * Check if the status error occurs in the response errors collection
 *
 */
export default function hasErrorWithStatus(errorResponse, status) {
  if (!errorResponse || !errorResponse.errors || !errorResponse.errors.length) { return false; }

  return errorResponse.errors && errorResponse.errors.isAny('status', status);
}
