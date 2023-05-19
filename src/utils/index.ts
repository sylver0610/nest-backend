import { pick } from 'lodash';

const getInfoData: any = ({ fields = [], object = {} }) => {
  return pick(object, fields);
};
// return _.pick(object, fields);
export { getInfoData };
