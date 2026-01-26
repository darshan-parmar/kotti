// eslint-disable-next-line @typescript-eslint/no-restricted-imports
import { defineStore } from 'pinia'

import { INITIAL_PAGE_SIZE } from '../consts.ts'
import type { KottiNotificationCenter } from '../types'

//

const filterInitialState: KottiNotificationCenter.NotificationFilters = {
	isNewestFirst: true,
	origins: null,
	search: null,
	types: null,
	unreadOnly: false,
}

export const useNotificationStore = defineStore('notificationCenter', {
	actions: {
		addNotification(notification: KottiNotificationCenter.Notification) {
			this.notifications.unshift(notification)
		},
		clearAll() {
			this.notifications = []
		},
		closeCenter() {
			this.isOpen = false
		},
		loadMore() {
			this.displayLimit += INITIAL_PAGE_SIZE
		},
		openCenter() {
			this.isOpen = true
		},
		remove(id: KottiNotificationCenter.Id) {
			this.notifications = this.notifications.filter((n) => n.id !== id)
		},
		resetFilter() {
			this.filters = filterInitialState
		},
		resetPagination() {
			this.displayLimit = INITIAL_PAGE_SIZE
		},
		setFilter(updates: Partial<KottiNotificationCenter.NotificationFilters>) {
			this.filters = { ...this.filters, ...updates }
		},
		setSummary(summary: string) {
			this.summary = summary
		},
	},
	state: (): KottiNotificationCenter.StoreState => ({
		displayLimit: INITIAL_PAGE_SIZE,
		filters: filterInitialState,
		isOpen: false,
		notifications: [],
		summary: '',
	}),
})
