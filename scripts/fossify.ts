import fs from 'fs/promises';
import path from 'path';
import readline from 'readline';

const root = process.cwd();
const repoPath = (...segments: string[]) => path.join(root, ...segments);

const rootWorkspaceToRemove = ['apps/meteor/ee/server/services'];
const meteorDependenciesToRemove = [
	'@rocket.chat/abac',
	'@rocket.chat/federation-matrix',
	'@rocket.chat/network-broker',
	'@rocket.chat/omni-core-ee',
];
const rootPathsToRemove = [
	repoPath('ee', 'apps'),
	repoPath('ee', 'packages', 'abac'),
	repoPath('ee', 'packages', 'federation-matrix'),
	repoPath('ee', 'packages', 'network-broker'),
	repoPath('ee', 'packages', 'omni-core-ee'),
];
const meteorEEPath = repoPath('apps', 'meteor', 'ee');
const stubsPath = repoPath('scripts', 'fossify-stubs', 'apps', 'meteor', 'ee');
const startRocketChatPath = repoPath('apps', 'meteor', 'startRocketChat.ts');
const startRocketChatFOSSPath = repoPath('apps', 'meteor', 'startRocketChatFOSS.ts');

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});

const readJson = async <T>(filePath: string): Promise<T> => JSON.parse(await fs.readFile(filePath, 'utf8')) as T;

const writeJson = async (filePath: string, data: unknown): Promise<void> => {
	await fs.writeFile(filePath, `${JSON.stringify(data, null, '\t')}\n`);
};

const removePath = async (targetPath: string): Promise<void> => {
	await fs.rm(targetPath, { recursive: true, force: true, maxRetries: 3 });
};

const removeWorkspaceEntries = async (): Promise<void> => {
	const packageJsonPath = repoPath('package.json');
	const packageJson = await readJson<{ workspaces?: string[] }>(packageJsonPath);

	if (!packageJson.workspaces) {
		return;
	}

	packageJson.workspaces = packageJson.workspaces.filter((workspace) => !rootWorkspaceToRemove.includes(workspace));
	await writeJson(packageJsonPath, packageJson);
};

const removeMeteorDependencies = async (): Promise<void> => {
	const packageJsonPath = repoPath('apps', 'meteor', 'package.json');
	const packageJson = await readJson<{ dependencies?: Record<string, string> }>(packageJsonPath);

	if (!packageJson.dependencies) {
		return;
	}

	for (const dependency of meteorDependenciesToRemove) {
		delete packageJson.dependencies[dependency];
	}

	await writeJson(packageJsonPath, packageJson);
};

const replaceStartupEntrypoint = async (): Promise<void> => {
	await fs.copyFile(startRocketChatFOSSPath, startRocketChatPath);
	await removePath(startRocketChatFOSSPath);
};

const restoreMeteorEEStubs = async (): Promise<void> => {
	await removePath(meteorEEPath);
	await fs.cp(stubsPath, meteorEEPath, { recursive: true });
};

const fossify = async () => {
	console.log('Removing Premium apps and packages...');
	for (const targetPath of rootPathsToRemove) {
		await removePath(targetPath);
	}

	console.log('Replacing Premium Meteor code with FOSS stubs...');
	await restoreMeteorEEStubs();

	console.log('Updating workspace metadata...');
	await removeWorkspaceEntries();
	await removeMeteorDependencies();

	console.log('Replacing startup entrypoint...');
	await replaceStartupEntrypoint();

	console.log('Done.');
};

rl.question('Running this script will permanently delete files from the local directory. Proceed? (n,y) ', (answer) => {
	rl.close();

	if (answer.toLowerCase() !== 'y') {
		return;
	}

	fossify().catch((e) => {
		if (!e) {
			console.error('Unknown error');
			return;
		}

		console.error(e);
	});
});
