import { type RequiredField } from '@rocket.chat/core-typings';

export type PushOptions = {
	sendTimeout?: number;
	production?: boolean;
	apn?: {
		passphrase: string;
		key: string;
		cert: string;

		gateway?: string;
	};
	gcm?: {
		apiKey: string;
		projectNumber: string;
	};
	gateways?: string[];
	uniqueId: string;
	getAuthorization?: () => Promise<string>;
};

export type BasePendingPushNotification = {
	from?: string;
	title?: string;
	text?: string;
	badge?: number;
	sound?: string;
	notId?: number;
	apn?: {
		category?: string;
	};
	gcm?: {
		style?: string;
		image?: string;
	};
	payload?: Record<string, any>;
	createdAt: Date;
	createdBy?: string;

	userId: string;

	sent?: boolean;
	sending?: number;
	priority?: number;

	contentAvailable?: 1 | 0;
	voip?: boolean;
};

export type PendingMessagePushNotification = RequiredField<BasePendingPushNotification, 'from' | 'title' | 'text'> & { voip?: false };

export type PendingVoipPushNotification = BasePendingPushNotification & { voip: true };

export type PendingPushNotification = PendingMessagePushNotification | PendingVoipPushNotification;
