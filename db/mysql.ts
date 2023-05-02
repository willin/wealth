import { Cast, cast, connect } from '@planetscale/database';
// import { format } from 'sqlstring';

const inflate: Cast = (field, value) => {
  if (field.type === 'DECIMAL') {
    return Number(value);
  }
  return cast(field, value) as string;
};
const config = {
  // format,
  cast: inflate,
  url: process.env.DATABASE_URL || ''
};

export const conn = connect(config);
