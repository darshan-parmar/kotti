// eslint-disable-next-line @typescript-eslint/no-restricted-imports
import { storeToRefs } from 'pinia'
import { computed, watch } from 'vue'

import { useNotificationStore } from '../store/notification-center.store.ts'
import { KottiNotificationCenter } from '../types.ts'

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useNotifications = () => {
	const store = useNotificationStore()
	const { displayLimit, filters, isOpen, notifications, summary } =
		storeToRefs(store)

	// Computed Properties
	const fullFilteredList = computed<KottiNotificationCenter.Notification[]>(
		() => {
			const filtered = notifications.value.filter((n) => {
				const searchQuery = filters.value.search?.toLowerCase() ?? ''
				const matchesSearch =
					searchQuery === '' || n.title.toLowerCase().includes(searchQuery)
				const matchesUnread =
					!filters.value.unreadOnly ||
					n.toggle === KottiNotificationCenter.Toggle.UNREAD
				const matchesType =
					!filters.value.types || n.type === filters.value.types
				const matchesOrigin =
					!filters.value.origins || n.origin === filters.value.origins

				return matchesSearch && matchesUnread && matchesType && matchesOrigin
			})

			return [...filtered].sort((a, b) => {
				const timeA = new Date(a.timestamp).getTime()
				const timeB = new Date(b.timestamp).getTime()
				return filters.value.isNewestFirst ? timeB - timeA : timeA - timeB
			})
		},
	)

	const filteredNotifications = computed<
		KottiNotificationCenter.Notification[]
	>(() => {
		return fullFilteredList.value.slice(0, displayLimit.value)
	})

	// 4. Verification Check: Are there more matching items available?
	const hasMore = computed<boolean>(() => {
		return displayLimit.value < fullFilteredList.value.length
	})

	const unreadCount = computed<number>(
		() =>
			notifications.value.filter(
				(n) => n.toggle === KottiNotificationCenter.Toggle.UNREAD,
			).length,
	)

	const todaysNotifications = computed<KottiNotificationCenter.Notification[]>(
		() => {
			const today = new Date().toDateString()
			return notifications.value.filter(
				(n) => new Date(n.timestamp).toDateString() === today,
			)
		},
	)

	const hasNotifications = computed<boolean>(
		() => notifications.value.length > 0,
	)
	const hasNotificationsToday = computed<boolean>(
		() => todaysNotifications.value.length > 0,
	)

	// watch
	watch(
		filters,
		() => {
			store.resetPagination()
		},
		{ deep: true },
	)

	// Notification Actions (Simplified)
	const toggleRead = (id: KottiNotificationCenter.Id): void => {
		const notification = notifications.value.find((n) => n.id === id)
		if (notification) {
			notification.toggle =
				notification.toggle === KottiNotificationCenter.Toggle.READ
					? KottiNotificationCenter.Toggle.UNREAD
					: KottiNotificationCenter.Toggle.READ
		}
	}

	const markRead = (id: KottiNotificationCenter.Id): void => {
		const notification = notifications.value.find((n) => n.id === id)
		if (notification) {
			notification.toggle = KottiNotificationCenter.Toggle.READ
		}
	}

	const markUnRead = (id: KottiNotificationCenter.Id): void => {
		const notification = notifications.value.find((n) => n.id === id)
		if (notification) {
			notification.toggle = KottiNotificationCenter.Toggle.UNREAD
		}
	}

	const markAllRead = (): void => {
		notifications.value.forEach((notification) => {
			notification.toggle = KottiNotificationCenter.Toggle.READ
		})
	}

	const markAllUnRead = (): void => {
		notifications.value.forEach((notification) => {
			notification.toggle = KottiNotificationCenter.Toggle.UNREAD
		})
	}

	const toggleSortOrder = (): void => {
		store.setFilter({ isNewestFirst: !filters.value.isNewestFirst })
	}

	// Notification Creation
	const notify = (
		payload: Omit<
			KottiNotificationCenter.Notification,
			'id' | 'timestamp' | 'toggle'
		>,
		minutesAgo = 0,
	): void => {
		// eslint-disable-next-line no-magic-numbers
		const timestamp = new Date(Date.now() - minutesAgo * 60000).toISOString()

		store.addNotification({
			...payload,
			id: window.crypto.randomUUID(),
			timestamp,
			toggle: KottiNotificationCenter.Toggle.UNREAD,
		})
	}

	// AI Summary Generation
	const generateAISummary = async (
		notifications: KottiNotificationCenter.Notification[],
		aiConfig: KottiNotificationCenter.AiConfig,
	): Promise<void> => {
		if (notifications.length === 0) return

		const formattedNotifications = notifications
			.map((n) => `[${n.type}] ${n.title}: ${n.content}`)
			.join('; ')

		const prompt = `Summarize these notifications into one concise sentence for a dashboard: ${formattedNotifications}`

		try {
			const response = await fetch(aiConfig.apiUrl, {
				body: JSON.stringify({
					messages: [{ content: prompt, role: 'user' }],
					model: aiConfig.llmModel,
				}),
				headers: {
					Authorization: `Bearer ${aiConfig.apiToken}`,
					'Content-Type': 'application/json',
				},
				method: 'POST',
			})

			const data = await response.json()
			store.setSummary(data.choices[0].message.content)
		} catch (error) {
			// eslint-disable-next-line no-console
			console.error('Failed to fetch summary:', error)
			store.setSummary('Could not generate summary at this time.')
		}
	}

	const fetchSummary = async (
		aiConfig: KottiNotificationCenter.AiConfig,
	): Promise<void> => {
		if (todaysNotifications.value.length > 0) {
			await generateAISummary(todaysNotifications.value, aiConfig)
		}
	}

	// Return API
	return {
		// State
		filters,
		hasMore,
		isOpen,
		summary,

		// Computed Properties
		filteredNotifications,
		hasNotifications,
		hasNotificationsToday,
		todaysNotifications,
		unreadCount,

		// Store Actions
		clearAll: () => {
			store.clearAll()
		},
		closeCenter: () => {
			store.closeCenter()
		},
		loadMore: () => {
			store.loadMore()
		},
		openCenter: () => {
			store.openCenter()
		},
		remove: (id: string) => {
			store.remove(id)
		},
		resetFilter: () => {
			store.resetFilter()
		},

		// Composable Actions
		markAllRead,
		markAllUnRead,
		markRead,
		markUnRead,
		notify,
		toggleRead,
		toggleSortOrder,

		// Utility Functions
		fetchSummary,
	}
}
