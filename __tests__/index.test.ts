/**
 * Unit tests for the action's entrypoint, src/index.ts
 */

import * as main from '../src/main';

// Mock the action's entrypoint

describe('index', () => {
  const runMock = jest.spyOn(main, 'run').mockImplementation();
  afterEach(() => {
    jest.restoreAllMocks();
  });
  it('calls run when imported', async () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require('../src/index');

    expect(runMock).toHaveBeenCalled();
  });
});
