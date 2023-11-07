import * as core from '@actions/core';

export async function run(): Promise<void> {
  try {
    const pillarCode = core.getInput('pillarCode');
    const env = core.getInput('environmentName');
    if (pillarCode !== '' && env === '') {
      throw new Error(
        `Input environmentName must be set when pillarCode is set`
      );
    }
    if (pillarCode === '' && env !== '') {
      throw new Error(
        `Input pillarCode must be set when environmentName is set`
      );
    }
    const clientIdInput = core.getInput('clientId');
    const subscriptionIdInput = core.getInput('subscriptionId');
    const tenantIdInput = core.getInput('tenantId');

    if (
      pillarCode === '' &&
      (clientIdInput === '' ||
        subscriptionIdInput === '' ||
        tenantIdInput === '')
    ) {
      throw new Error(
        `Either pillarCode or clientId, subscriptionId, and tenantId must be provided`
      );
    }

    const pulumiStateSubscriptionId =
      process.env.PULUMI_STATE_AZURE_SUBSCRIPTION_ID;

    if (!pulumiStateSubscriptionId) {
      throw new Error(`Pulumi State Subscription Id is not set in the runner`);
    }
    console.log(`Pulumi State Subscription Id: ${pulumiStateSubscriptionId}`);
    core.setOutput('pulumiStateSubscriptionId', pulumiStateSubscriptionId);

    if (clientIdInput !== '') {
      console.log(`Client Id: ${clientIdInput}`);
      core.setOutput('clientId', clientIdInput);
    } else {
      const clientIdKey = `${pillarCode}_AZURE_CLIENT_ID_${env}`.toUpperCase();
      const clientId = process.env[clientIdKey];
      console.log(`Client Id: ${clientId}`);
      core.setOutput('clientId', clientId);
    }

    if (subscriptionIdInput !== '') {
      console.log(`Subscription Id: ${subscriptionIdInput}`);
      core.setOutput('subscriptionId', subscriptionIdInput);
    } else {
      const subscriptionIdKey =
        `${pillarCode}_AZURE_SUBSCRIPTION_ID_${env}`.toUpperCase();
      const subscriptionId = process.env[subscriptionIdKey];
      console.log(`Subscription Id: ${subscriptionId}`);
      core.setOutput('subscriptionId', subscriptionId);
    }

    if (tenantIdInput !== '') {
      console.log(`Tenant Id: ${tenantIdInput}`);
      core.setOutput('tenantId', tenantIdInput);
    } else {
      const tenantId = process.env.AZURE_TENANT_ID;
      console.log(`Tenant Id: ${tenantId}`);
      core.setOutput('tenantId', tenantId);
    }
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message);
  }
}
