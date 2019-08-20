import Mixin from '@ember/object/mixin';
import prefix from 'travis/utils/ui-kit/prefix';
import concat from 'travis/utils/ui-kit/concat';

export default Mixin.create({
  // Public interface //
  margin: null,
  padding: null,

  // Private //

  // Margin
  marginTop: prefix('margin.top', 'mt', { negatable: true }),
  marginRight: prefix('margin.right', 'mr', { negatable: true }),
  marginBottom: prefix('margin.bottom', 'mb', { negatable: true }),
  marginLeft: prefix('margin.left', 'ml', { negatable: true }),
  marginX: prefix('margin.x', 'mx', { negatable: true }),
  marginY: prefix('margin.y', 'my', { negatable: true }),
  marginAll: prefix('margin.all', 'm', { negatable: true }),
  marginClasses: concat(
    'marginTop',
    'marginRight',
    'marginBottom',
    'marginLeft',
    'marginX',
    'marginY',
    'marginAll',
  ),

  // Padding
  paddingTop: prefix('padding.top', 'pt'),
  paddingRight: prefix('padding.right', 'pr'),
  paddingBottom: prefix('padding.bottom', 'pb'),
  paddingLeft: prefix('padding.left', 'pl'),
  paddingX: prefix('padding.x', 'px'),
  paddingY: prefix('padding.y', 'py'),
  paddingAll: prefix('padding.all', 'p'),
  paddingClasses: concat(
    'paddingTop',
    'paddingRight',
    'paddingBottom',
    'paddingLeft',
    'paddingX',
    'paddingY',
    'paddingAll',
  ),
});
