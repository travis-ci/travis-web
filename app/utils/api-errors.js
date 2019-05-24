/**
 * Check if the status error occurs in the response errors collection
 *
 */
export default function hasErrorWithStatus(errorResponse, status) {
  const { errors = [] } = errorResponse || {};

  return errors.isAny('status', status);
}
