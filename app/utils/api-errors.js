/**
 * Check if the status error occurs in the response errors collection
 *
 */

import { A } from '@ember/array'

export default function hasErrorWithStatus(errorResponse, status) {
  const { errors = [] } = errorResponse || {};

  return errors.isAny('status', status);
}
