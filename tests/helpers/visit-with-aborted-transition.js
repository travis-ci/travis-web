import { visit } from '@ember/test-helpers';

export async function visitWithAbortedTransition(url) {
  try {
    await visit(url);
  } catch(error) {
    const { message } = error;
    if (message !== 'TransitionAborted') {
      throw error;
    }
  }
};
