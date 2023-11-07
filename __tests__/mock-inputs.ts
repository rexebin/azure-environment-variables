import * as core from '@actions/core';

export function mockInputs(
  clientId: string,
  subscriptionId: string,
  tenantId: string,
  environmentName: string,
  pillarCode: string
) {
  jest.spyOn(core, 'getInput').mockImplementation((name: string) => {
    if (name === 'environmentName') {
      return environmentName;
    }
    if (name === 'pillarCode') {
      return pillarCode;
    }
    if (name === 'subscriptionId') {
      return subscriptionId;
    }
    if (name === 'clientId') {
      return clientId;
    }
    if (name === 'tenantId') {
      return tenantId;
    }
    throw new Error(`Unexpected input ${name}`);
  });
}
