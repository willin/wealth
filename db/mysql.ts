import { connect } from '@planetscale/database';
// import { format } from 'sqlstring';

const config = {
  // format,
  url: process.env.DATABASE_URL || ''
};

export const conn = connect(config);
