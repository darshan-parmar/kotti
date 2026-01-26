<template>
	<KtDrawer v-if="isOpen" isWide @close="closeNotificationCenter">
		<template #drawer-header>
			<h4>{{ $props.title }} ({{ unreadCount }})</h4>
			<NotificationFilters />
		</template>

		<template #drawer-body>
			<div class="kt-notification-center">
				<template v-if="$props.aiSummary && hasNotificationsToday">
					<KtLine
						class="kt-notification-center__separator1"
						text="AI Summary"
					/>
					<NotificationSummary v-bind="$props.aiSummary" />
				</template>

				<KtLine
					class="kt-notification-center__separator2"
					text="Notifications"
				/>

				<NotificationList />
			</div>
		</template>
	</KtDrawer>
</template>

<script lang="ts">
import { computed, defineComponent, watch } from 'vue'

import KtDrawer from '../kotti-drawer/KtDrawer.vue'
import KtLine from '../kotti-line/KtLine.vue'
import { makeProps } from '../make-props.ts'

import NotificationSummary from './components/notificaiton-summary.vue'
import NotificationFilters from './components/notification-filters.vue'
import NotificationList from './components/notification-list.vue'
import { useNotifications } from './composables/useNotificaitons.ts'
import { KottiNotificationCenter } from './types.ts'

export default defineComponent({
	name: 'KtNotificationCenter',
	components: {
		KtDrawer,
		KtLine,
		NotificationFilters,
		NotificationList,
		NotificationSummary,
	},
	props: makeProps(KottiNotificationCenter.notificationCenterComponentProps),
	setup(props) {
		const {
			isOpen,
			unreadCount,
			closeCenter,
			hasNotificationsToday,
			resetFilter,
		} = useNotifications()

		const isAiSummaryEnabled = computed<boolean>(() => !!props.aiSummary)

		const lockScroll = () => {
			document.body.style.overflow = 'hidden'
			document.body.style.touchAction = 'none'
		}

		const unlockScroll = () => {
			document.body.style.overflow = ''
			document.body.style.touchAction = ''
		}

		watch(isOpen, (shouldLock) => {
			// eslint-disable-next-line sonarjs/no-selector-parameter
			if (shouldLock) {
				lockScroll()
			} else {
				unlockScroll()
			}
		})

		const closeNotificationCenter = (): void => {
			resetFilter()
			closeCenter()
		}

		return {
			closeNotificationCenter,
			hasNotificationsToday,
			isAiSummaryEnabled,
			isOpen,
			unreadCount,
		}
	},
})
</script>

<style lang="scss" scoped>
.kt-notification-center {
	display: flex;
	flex-direction: column;
	height: 100%;
	max-height: 100vh;
	overflow: hidden;

	&__separator2 {
		margin-bottom: 12px;
	}
}
</style>
