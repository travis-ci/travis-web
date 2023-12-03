import { Model, hasMany } from 'miragejs';
export default Model.extend({
    organizations: hasMany('organization')
});
