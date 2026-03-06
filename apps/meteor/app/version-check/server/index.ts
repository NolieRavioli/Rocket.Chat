import { cronJobs } from '@rocket.chat/cron';
import { Meteor } from 'meteor/meteor';

import { checkVersionUpdate } from './functions/checkVersionUpdate';
import { isCloudDisabled } from '../../cloud/server/isCloudDisabled';
import { settings } from '../../settings/server';
import './methods/banner_dismiss';

const jobName = 'version_check';

if (await cronJobs.has(jobName)) {
	await cronJobs.remove(jobName);
}

const addVersionCheckJob = async () => {
	if (isCloudDisabled()) {
		return;
	}

	await cronJobs.add(jobName, '0 2 * * *', async () => checkVersionUpdate());
};

Meteor.startup(() => {
	setImmediate(() => {
		if (isCloudDisabled()) {
			return;
		}

		if (settings.get('Update_EnableChecker')) {
			void checkVersionUpdate();
		}
	});
});

settings.watch('Update_EnableChecker', async () => {
	if (isCloudDisabled()) {
		if (await cronJobs.has(jobName)) {
			await cronJobs.remove(jobName);
		}
		return;
	}

	const checkForUpdates = settings.get('Update_EnableChecker');

	if (checkForUpdates && (await cronJobs.has(jobName))) {
		return;
	}

	if (checkForUpdates) {
		await addVersionCheckJob();
		return;
	}

	await cronJobs.remove(jobName);
});
