import { getCasinoInfo } from '@apis/casino';

/** @type {import('./$types').PageLoad} */
export const load = async ({ params }) => {
  let { type } = params;

  type = type.replaceAll('-', ' ');
  return {
    type
  };
};
