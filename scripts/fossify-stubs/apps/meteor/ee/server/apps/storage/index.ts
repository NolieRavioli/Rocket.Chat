import type { IAppStorageItem } from '@rocket.chat/apps-engine/server/storage';

export interface AppRealStorage {
	retrieveAll(): Promise<Map<string, IAppStorageItem>>;
	retrieveAllPrivate(): Promise<Map<string, IAppStorageItem>>;
	updatePartialAndReturnDocument(item: IAppStorageItem): Promise<IAppStorageItem>;
}
