/**
 * Check if the status error occurs in the response errors collection
 *
 */
export default function hasErrorWithStatus(errorResponse, status) {
  if (!errorResponse) { return false; }

  return !!errorResponse.errors.find(error => (error.status == status));
}
