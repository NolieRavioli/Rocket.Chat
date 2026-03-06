import type { InquiryWithAgentInfo } from '@rocket.chat/core-typings';

export const dispatchInquiryPosition = async (_inquiry: Omit<InquiryWithAgentInfo, 'v'>, _queueInfo?: unknown): Promise<void> => {};
