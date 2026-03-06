const enabledValues = new Set(['1', 'true', 'yes', 'on']);

export const isCloudDisabled = (): boolean => enabledValues.has(process.env.RC_CLOUD_DISABLED?.trim().toLowerCase() || '');
