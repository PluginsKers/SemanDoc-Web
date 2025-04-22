import { ref } from "vue";
import { Notification } from "@/types";

export interface NotificationManager {
	notifications: typeof notifications;
	addNotification: (notification: Notification, duration?: number) => void;
	removeNotification: (id: number) => void;
}

const notifications = ref<Notification[]>([]);
const maxNotifications = 5; // 最大通知数量
const timeoutIds = new Map<number, any>(); // 用于存储每个通知的定时器 ID

function addNotification(notification: Notification, duration = 10000) {
	// 确保通知有一个唯一ID
	notification.id = Date.now() + Math.random();

	// 超出最大通知限制时移除最旧的通知
	if (notifications.value.length >= maxNotifications) {
		removeNotification(notifications.value[0].id);
	}

	notifications.value.push(notification);

	// 设置定时器自动移除通知
	const timeoutId = setTimeout(() => {
		removeNotification(notification.id);
	}, duration);

	// 存储对应通知的定时器 ID
	timeoutIds.set(notification.id, timeoutId);
}

function removeNotification(id: number) {
	// 找到要删除的通知
	const index = notifications.value.findIndex((n) => n.id === id);
	if (index !== -1) {
		clearTimeout(timeoutIds.get(id)); // 取消定时器
		timeoutIds.delete(id); // 删除定时器 ID 记录
		notifications.value.splice(index, 1); // 移除通知
	}
}

export function useNotificationManager(): NotificationManager {
	return {
		notifications,
		addNotification,
		removeNotification,
	};
}
