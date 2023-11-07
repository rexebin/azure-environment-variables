/**
 * Unit tests for the action's entrypoint, src/index.ts
 */

import * as main from '../src/main';
import * as core from '@actions/core';
// @ts-ignore
import { mockInputs } from './mock-inputs';

describe('should validate inputs', () => {
  beforeEach(() => {
    jest.resetModules(); // Most important - it clears the cache
  });
  it('should throw if pillarCode, clientId, subscriptionId and tenant Id are all blank', async () => {
    mockInputs('', '', '', '', '');
    jest.spyOn(core, 'setFailed');

    await main.run();

    expect(core.setFailed).toHaveBeenCalledWith(
      'Either pillarCode or clientId, subscriptionId, and tenantId must be provided'
    );
  });

  it('should throw if pillarCode is given, but env is not given', async () => {
    mockInputs('123', '456', '789', '', 'tms');
    jest.spyOn(core, 'setFailed');

    await main.run();

    expect(core.setFailed).toHaveBeenCalledWith(
      'Input environmentName must be set when pillarCode is set'
    );
  });

  it('should throw if pillar is not given, but env is given', async () => {
    mockInputs('123', '456', '789', 'dev', '');
    jest.spyOn(core, 'setFailed');

    await main.run();

    expect(core.setFailed).toHaveBeenCalledWith(
      'Input pillarCode must be set when environmentName is set'
    );
  });
});

describe('pulumi state subscription id', () => {
  const OLD_ENV = process.env;
  beforeEach(() => {
    jest.resetModules(); // Most important - it clears the cache
    process.env = {
      ...OLD_ENV,
      ...{ PULUMI_STATE_AZURE_SUBSCRIPTION_ID: '888' }
    };
  });

  afterAll(() => {
    process.env = OLD_ENV; // Restore old environment
  });

  it('should throw if pulumi state subscription id is not set', async () => {
    process.env = {
      ...OLD_ENV,
      ...{ PULUMI_STATE_AZURE_SUBSCRIPTION_ID: undefined }
    };
    mockInputs('123', '456', '789', 'dev', 'tms');
    jest.spyOn(core, 'setFailed');
    await main.run();
    expect(core.setFailed).toHaveBeenCalledWith(
      'Pulumi State Subscription Id is not set in the runner'
    );
  });

  it('should set pulumi state subscription in the environment', async () => {
    mockInputs('123', '456', '789', 'dev', 'tms');
    jest.spyOn(core, 'setOutput');
    await main.run();
    expect(core.setOutput).toHaveBeenCalledWith(
      'pulumiStateSubscriptionId',
      '888'
    );
  });
});

describe('azure ids', () => {
  const OLD_ENV = process.env;
  beforeEach(() => {
    jest.resetModules(); // Most important - it clears the cache
    process.env = {
      ...OLD_ENV,
      ...{ PULUMI_STATE_AZURE_SUBSCRIPTION_ID: '888' }
    };
  });

  afterAll(() => {
    process.env = OLD_ENV; // Restore old environment
  });

  it('should set client to given client id', async () => {
    mockInputs('123', '456', '789', 'dev', 'tms');
    jest.spyOn(core, 'setOutput');
    await main.run();
    expect(core.setOutput).toHaveBeenCalledWith('clientId', '123');
  });

  it('should set client to pillar client id when client id is not given', async () => {
    process.env = { ...process.env, ...{ TMS_AZURE_CLIENT_ID_DEV: '999' } };
    mockInputs('', '456', '789', 'dev', 'tms');
    jest.spyOn(core, 'setOutput');
    await main.run();
    expect(core.setOutput).toHaveBeenCalledWith('clientId', '999');
  });

  it('should set subscription id given subscription id', () => {
    mockInputs('123', '456', '789', 'dev', 'tms');
    jest.spyOn(core, 'setOutput');
    main.run();
    expect(core.setOutput).toHaveBeenCalledWith('subscriptionId', '456');
  });

  it('should set subscription id given pillar subscription id', () => {
    process.env = {
      ...process.env,
      ...{ TMS_AZURE_SUBSCRIPTION_ID_DEV: '999' }
    };
    mockInputs('123', '', '789', 'dev', 'tms');
    jest.spyOn(core, 'setOutput');
    main.run();
    expect(core.setOutput).toHaveBeenCalledWith('subscriptionId', '999');
  });

  it('should set tenant id given tenant id', () => {
    mockInputs('123', '456', '789', 'dev', 'tms');
    jest.spyOn(core, 'setOutput');
    main.run();
    expect(core.setOutput).toHaveBeenCalledWith('tenantId', '789');
  });

  it('should set tenant id given pillar tenant id', () => {
    process.env = { ...process.env, ...{ AZURE_TENANT_ID: '999' } };
    mockInputs('123', '456', '', 'dev', 'tms');
    jest.spyOn(core, 'setOutput');
    main.run();
    expect(core.setOutput).toHaveBeenCalledWith('tenantId', '999');
  });
});
