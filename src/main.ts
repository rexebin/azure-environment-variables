import * as core from '@actions/core';

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    const pillarCode = core.getInput('pillarCode');
    if (pillarCode === '') {
      throw new Error(`Input pillarCode is not set`);
    }
    const env = core.getInput('environmentName');

    if (env === '') {
      throw new Error(`Input environmentName is not set`);
    }

    const clientIdInput = core.getInput('clientId');
    if (clientIdInput !== '') {
      console.log(`Client Id: ${clientIdInput}`);
      core.setOutput('clientId', clientIdInput);
      return;
    } else {
      const clientIdKey = `${pillarCode}_AZURE_CLIENT_ID_${env}`.toUpperCase();
      const clientId = process.env[clientIdKey];
      console.log(`Client Id: ${clientId}`);
      core.setOutput('clientId', clientId);
    }

    const subscriptionIdInput = core.getInput('subscriptionId');
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

    const tenantIdInput = core.getInput('tenantId');
    if (tenantIdInput !== '') {
      console.log(`Tenant Id: ${tenantIdInput}`);
      core.setOutput('tenantId', tenantIdInput);
    } else {
      const tenantIdKey = `${pillarCode}_AZURE_TENANT_ID_${env}`.toUpperCase();
      const tenantId = process.env[tenantIdKey];
      console.log(`Tenant Id: ${tenantId}`);
      core.setOutput('tenantId', tenantId);
    }

    const pulumiStateSubscriptionId =
      process.env.PULUMI_STATE_AZURE_SUBSCRIPTION_ID;
    console.log(`Pulumi State Subscription Id: ${pulumiStateSubscriptionId}`);

    core.setOutput('pulumiStateSubscriptionId', pulumiStateSubscriptionId);
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message);
  }
}
