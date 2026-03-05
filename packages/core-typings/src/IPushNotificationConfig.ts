export interface IBasePushNotificationConfig {
	from?: string;
	badge?: number;
	sound?: string;
	priority?: number;
	title?: string;
	text?: string;
	payload?: Record<string, any>;
	userId: string;
	notId?: number;
	gcm?: {
		style: string;
		image: string;
	};
	apn?: {
		category: string;
	};
	voip?: boolean;
}

export interface IMessagePushNotificationConfig extends IBasePushNotificationConfig {
	from: string;
	title: string;
	text: string;

	voip?: false;
}

export interface IVoipPushNotificationConfig extends IBasePushNotificationConfig {
	voip: true;
}

export type IPushNotificationConfig = IMessagePushNotificationConfig | IVoipPushNotificationConfig;
