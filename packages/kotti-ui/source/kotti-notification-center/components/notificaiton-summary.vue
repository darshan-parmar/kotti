<template>
	<div v-if="hasNotificationsToday" class="kt-notification-summary">
		<div class="summary-card">
			<div class="summary-card__header">
				<div class="title-group">
					<span class="ai-icon">✨</span>
					<h3 class="title">AI Daily Insight</h3>
				</div>

				<KtButton
					:disabled="isSummarizing"
					:isLoading="isSummarizing"
					type="secondary"
					@click="handleRefresh"
					>{{ isSummarizing ? 'Summarizing..' : 'Summarize' }}</KtButton
				>
			</div>

			<div class="summary-card__body">
				<p v-if="summary && !isSummarizing" class="summary-text">
					{{ summary }}
				</p>

				<div v-else-if="isSummarizing" class="loading-state">
					<div class="skeleton rectangle" />
					<div class="skeleton rectangle" />
					<div class="skeleton rectangle" />
				</div>

				<p v-else class="placeholder-text">
					Summarize your {{ todayNotificationCount }} updates for today.
				</p>
			</div>

			<div v-if="summary && !isSummarizing" class="summary-card__footer">
				<span class="model-tag">Powered by Llama 3</span>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue'

import KtButton from '../../kotti-button/KtButton.vue'
import { makeProps } from '../../make-props.ts'
import { useNotifications } from '../composables/useNotificaitons.ts'
import { KottiNotificationCenter } from '../types.ts'

//

export default defineComponent({
	name: 'NotificationSummary',
	components: { KtButton },
	props: makeProps(KottiNotificationCenter.aiSummarySchema),
	setup(props) {
		const {
			summary,
			fetchSummary,
			todaysNotifications,
			hasNotificationsToday,
		} = useNotifications()

		const isSummarizing = ref(false)

		const todayNotificationCount = computed<number>(
			() => todaysNotifications.value.length,
		)

		const handleRefresh = async (): Promise<void> => {
			if (isSummarizing.value) return

			isSummarizing.value = true

			try {
				await fetchSummary(props)
			} catch (error) {
				// eslint-disable-next-line no-console
				console.error('AI Insight failed:', error)
			} finally {
				isSummarizing.value = false
			}
		}

		return {
			handleRefresh,
			hasNotificationsToday,
			isSummarizing,
			summary,
			todayNotificationCount,
		}
	},
})
</script>

<style lang="scss" scoped>
.kt-notification-summary {
	padding: 10px;
	width: 100%;

	.summary-card {
		background: #151515;
		border: 1px solid #2d2d2d;
		border-radius: 8px;
		padding: 16px;

		&__header {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-bottom: 14px;

			.title-group {
				display: flex;
				align-items: center;
				gap: 10px;
			}

			.ai-icon {
				color: #f6ad55;
				font-size: 14px;
			}
			.title {
				font-size: 12px;
				text-transform: uppercase;
				letter-spacing: 1px;
				color: #a0aec0;
				margin: 0;
				font-weight: 700;
			}
		}

		.summary-text {
			font-size: 14px;
			line-height: 1.6;
			color: #e2e8f0;
		}

		.placeholder-text {
			font-size: 13px;
			color: #4a5568;
		}

		&__footer {
			margin-top: 16px;
			padding-top: 12px;
			border-top: 1px solid #232323;

			.model-tag {
				font-size: 10px;
				color: #4a5568;
				font-weight: 600;
				text-transform: uppercase;
			}
		}
	}
}

.loading-state {
	display: flex;
	flex-direction: column;
	gap: 10px;
}
</style>
