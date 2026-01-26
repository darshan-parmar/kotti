<template>
	<div
		ref="scrollContainerRef"
		class="kt-notification-list"
		role="list"
		@keydown.down.prevent="moveFocus('next')"
		@keydown.up.prevent="moveFocus('prev')"
	>
		<template v-if="filteredNotifications.length > 0">
			<NotificationItem
				v-for="notification in filteredNotifications"
				:key="notification.id"
				:notification="notification"
			/>

			<div
				v-if="isLocalLoading"
				class="mt-3 loading kt-notification-list__fetch-loader"
			/>

			<div v-else-if="!hasMore" class="kt-notification-list__empty">
				<p>No more notifications to show!</p>
			</div>
		</template>

		<div v-else class="kt-notification-list__empty">
			<p>No notifications to show!</p>
		</div>
	</div>
</template>

<script lang="ts">
// eslint-disable-next-line @typescript-eslint/no-restricted-imports
import { useInfiniteScroll } from '@vueuse/core'
import { defineComponent, ref, useTemplateRef, watch } from 'vue'

import { useNotifications } from '../composables/useNotificaitons.ts'

import NotificationItem from './notification-item.vue'

//

export default defineComponent({
	name: 'NotificationList',
	components: { NotificationItem },
	setup() {
		const { filteredNotifications, hasMore, loadMore, filters } =
			useNotifications()

		const scrollContainerRef = useTemplateRef<HTMLElement>('scrollContainerRef')
		const isLoading = ref(false)

		useInfiniteScroll(
			scrollContainerRef,
			async () => {
				if (isLoading.value || !hasMore.value) return

				isLoading.value = true
				try {
					// eslint-disable-next-line no-magic-numbers
					await new Promise((resolve) => window.setTimeout(resolve, 1000))
					loadMore()
				} finally {
					isLoading.value = false
				}
			},
			{ distance: 10 },
		)

		watch(
			filters,
			() => {
				if (scrollContainerRef.value) {
					scrollContainerRef.value.scrollTop = 0
				}
			},
			{ deep: true },
		)

		const moveFocus = (direction: 'next' | 'prev') => {
			const active = document.activeElement as HTMLElement
			const target =
				direction === 'next'
					? active.nextElementSibling
					: active.previousElementSibling

			if (target instanceof HTMLElement) target.focus()
		}

		return {
			filteredNotifications,
			hasMore,
			isLocalLoading: isLoading,
			moveFocus,
			scrollContainer: scrollContainerRef,
		}
	},
})
</script>

<style lang="scss" scoped>
.kt-notification-list {
	display: flex;
	flex-direction: column;
	height: 100%;
	overflow-y: auto;
	overflow-x: hidden;

	&__fetch-loader {
		padding: 20px 0 20px 0;
	}
	&__empty {
		padding: 40px 20px;
		text-align: center;
		color: var(--gray-60);
	}
}
</style>
