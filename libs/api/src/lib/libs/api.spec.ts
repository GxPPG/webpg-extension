import { libsApi } from './libs/api';

describe('libsApi', () => {
  it('should work', () => {
    expect(libsApi()).toEqual('libs/api');
  });
});
