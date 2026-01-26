<template>
	<ComponentInfo v-bind="{ component }" />

	<h2>Demo</h2>

	<div class="demo-block">
		<KtButton
			icon="plus"
			label="Feed Mock Notifications"
			@click="feedNotifications"
		/>
		<KtButton
			helpText="Trigger new notification"
			icon="send"
			lable="Notify"
			@click="triggerNotification"
		/>

		<KtButton
			helpText="Open notification center"
			icon="bell"
			type="danger"
			@click="openCenter"
			>{{ unreadCount }}</KtButton
		>

		<KtNotificationCenter
			:aiSummary="{
				apiUrl: 'ai-endpoint-url',
				apiToken: 'token',
				llmModel: 'llm-model',
			}"
			title="Notifications"
		/>
	</div>

	<KtLine />
	<h2>Getting Started</h2>
	<h3>1. Prerequisites (Pinia)</h3>
	<p>
		This component currently utilizes <span>Pinia</span> for centralized state
		management. Ensure you have Pinia installed and initialized in your main
		application:
	</p>
	<CodePreview code="npm install pinia" language="bash" />

	<p>
		<span>Note on Architecture:</span> While currently dependent on `Pinia`, the
		component is designed using a "Logic-Heavy Composable" pattern. This makes
		the system future-proof; the underlying state management can be swapped for
		other `stores or native reactive objects` with minimal changes.
	</p>

	<h3>2. Basic Installation</h3>
	<p>
		Import the main component and place it in your top-level layout (e.g.,
		`App.vue`).
	</p>

	<CodePreview
		code="
			<KtNotificationCenter
				title='Notifications'
			/>
		"
		language="vue-html"
	/>

	<h2>Interacting via Composables</h2>
	<p>
		All interactions should be handled via the
		<span>useNotifications</span> composable. This provides a clean API for both
		UI control and data actions.
	</p>

	<h3>Action Utilities</h3>
	<p>
		Use these to trigger notifications from anywhere in your app (API handlers,
		form submissions, etc.).
	</p>

	<CodePreview
		code="
			import { useNotifications } from '@3yourmind/kotti-ui'
			const { notify } = useNotifications()

			// Trigger a new notification
			notify({
				title: 'Database Error',
				content: 'Connection lost with server-01',
				origin: 'SYSTEM',
				type: 'error'
			})
		"
		language="vue"
	/>

	<h3>UI Utilities</h3>
	<p>
		Use these to control the drawer state or access reactive data for your
		custom headers/navbars.
	</p>
	<CodePreview
		code="
				import { useNotifications } from '@3yourmind/kotti-ui'
				const { openCenter, closeCenter, unreadCount, isOpen } = useNotifications()
			"
		language="vue"
	/>

	<KtLine />

	<h2>AI Summarization (Optional)</h2>
	<p>
		The Notification Center includes a "Bonus" intelligence feature that uses
		LLMs to summarize today's alerts into a single concise insight.
	</p>
	<p>
		To enable this feature: Pass the <span>aiSummary</span> prop with your
		configuration. If this prop is omitted, the AI Insight card will not render.
	</p>

	<CodePreview
		code="
					<KtNotificationCenter
						title='Notifications'
						:aiSummary='{
								apiUrl: 'ai-endpoint-url',
								apiToken: 'token',
								llmModel: 'llm-model',
						}'
					/>
				"
		language="vue-html"
	/>

	<h2>`useNotifications` - The Main Composable</h2>
	<KtLine />
	<p>
		`useNotifications` provides all the utilities you need. Here is the
		comprehensive list of apis
	</p>

	<div class="api-documentation">
		<h2>State & Flags</h2>
		<ul>
			<li>
				<span>`summary`</span>: Reactive string containing the AI-generated
				insight of today's alerts.
			</li>
			<li>
				<span>`isOpen`</span>: Boolean tracking whether the notification center
				drawer is currently visible.
			</li>
			<li>
				<span>`filters`</span>: Reactive object used for direct `v-model`
				binding of search, types, and origins.
			</li>
			<li>
				<span>`hasMore`</span>: Boolean indicating if more matching
				notifications exist beyond the current paginated view.
			</li>
		</ul>

		<h2>Computed Properties</h2>
		<ul>
			<li>
				<span>`hasNotifications`</span>: Returns `true` if there is at least one
				notification in the entire store.
			</li>
			<li>
				<span>`hasNotificationsToday`</span>: Returns `true` if there are alerts
				time-stamped with the current date.
			</li>
			<li>
				<span>`filteredNotifications`</span>: The processed, sorted, and
				paginated list of notifications to be rendered.
			</li>
			<li>
				<span>`todaysNotifications`</span>: A subset of the store containing
				only alerts generated within the last 24 hours.
			</li>
			<li>
				<span>`unreadCount`</span>: Reactive integer representing the total
				number of notifications currently marked as unread.
			</li>
		</ul>

		<h2>Store Actions</h2>
		<ul>
			<li>
				<span>`remove`</span>: Deletes a specific notification from the store
				using its unique ID.
			</li>
			<li>
				<span>`clearAll`</span>: Purges all notifications from the store,
				resetting it to an empty state.
			</li>
			<li>
				<span>`openCenter`</span>: Displays the drawer and activates the
				background scroll lock logic.
			</li>
			<li>
				<span>`closeCenter`</span>: Hides the drawer and restores normal page
				scrolling.
			</li>
			<li>
				<span>`resetFilter`</span>: Restores all filter fields to their default
				values and resets pagination.
			</li>
			<li>
				<span>`loadMore`</span>: Increases the display limit to append the next
				chunk of notifications to the list.
			</li>
		</ul>

		<h2>Composable Actions</h2>
		<ul>
			<li>
				<span>`notify`</span>: The primary method to push new alerts into the
				system with optional time-offset support.
			</li>
			<li>
				<span>`markRead`</span>: Explicitly sets a specific notification's
				status to 'read'.
			</li>
			<li>
				<span>`markUnRead`</span>: Explicitly sets a specific notification's
				status to 'unread'.
			</li>
			<li>
				<span>`toggleRead`</span>: Swaps the status of a notification between
				'read' and 'unread'.
			</li>
			<li>
				<span>`markAllRead`</span>: Iterates through all notifications in the
				store and marks them as read.
			</li>
			<li>
				<span>`markAllUnRead`</span>: Iterates through all notifications in the
				store and marks them as unread.
			</li>
			<li>
				<span>`toggleSortOrder`</span>: Flips the `isNewestFirst` filter to
				reverse the list's chronological order.
			</li>
		</ul>

		<h2>Utility Functions</h2>
		<ul>
			<li>
				<span>`fetchSummary`</span>: Triggers the Llama 3 AI integration to
				analyze today's logs and update the summary.
			</li>
		</ul>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import {
	Kotti,
	KtButton,
	KtLine,
	KtNotificationCenter,
	useNotifications,
} from '@3yourmind/kotti-ui'

import CodePreview from '~/components/CodePreview.vue'
import ComponentInfo from '~/components/component-info/ComponentInfo.vue'
import { success } from '~/utilities/toaster'

export default defineComponent({
	name: 'DocumentationPageUsageComponentNotificationCenter',
	components: {
		CodePreview,
		ComponentInfo,
		KtButton,
		KtLine,
		KtNotificationCenter,
	},
	setup() {
		const { openCenter, notify, unreadCount } = useNotifications()

		const mockNotifications: Omit<
			Kotti.NotificationCenter.Notification,
			'id' | 'timestamp' | 'toggle'
		>[] = [
			{
				content:
					'Recurring connection timeout on postgres-primary-db. Automatic failover initiated.',
				origin: Kotti.NotificationCenter.Origin.SYSTEM,
				title: 'Database operation failed!',
				type: Kotti.NotificationCenter.Type.ERROR,
			},
			{
				content:
					'Your document "invoice_2024.pdf" has been processed successfully.',
				origin: Kotti.NotificationCenter.Origin.USER,
				references: {
					link: 'https://www.lipsum.com/',
					quoteId: 'INV-2024',
				},
				title: 'File Uploaded',
				type: Kotti.NotificationCenter.Type.INFO,
			},
			{
				content:
					'Coolant temperature on unit-B is rising above 80°C. Please check the ventilation.',
				origin: Kotti.NotificationCenter.Origin.MACHINE,
				title: 'Machine Warning',
				type: Kotti.NotificationCenter.Type.WARNING,
			},
			{
				content:
					'Kernel patch v2.4.1 has been applied to all edge nodes successfully.',
				origin: Kotti.NotificationCenter.Origin.SYSTEM,
				title: 'System Update',
				type: Kotti.NotificationCenter.Type.INFO,
			},
			{
				content:
					'Multiple failed login attempts detected from IP 192.168.1.45.',
				origin: Kotti.NotificationCenter.Origin.SYSTEM,
				title: 'Unauthorized Access Attempt',
				type: Kotti.NotificationCenter.Type.ERROR,
			},
		]

		const feedNotifications = () => {
			mockNotifications.forEach((notification, index) => {
				notify(notification, index * 10)
			})
			success({
				text: 'Mock Notifications added!',
			})
		}

		const triggerNotification = () => {
			notify({
				content: 'Your document "xyz.png" has been processed successfully.',
				origin: Kotti.NotificationCenter.Origin.MACHINE,
				references: {
					link: 'https://www.lipsum.com/',
					quoteId: 'INV-2024',
				},
				title: 'Image Uploaded',
				type: Kotti.NotificationCenter.Type.INFO,
			})
			success({
				text: 'Notifications added!',
			})
		}

		return {
			component: KtNotificationCenter,
			feedNotifications,
			openCenter,
			triggerNotification,
			unreadCount,
		}
	},
})
</script>

<style scoped lang="scss">
.demo-block {
	display: flex;
	gap: 10px;
	margin: 20px 0 20px 0;
}

.api-documentation ul {
	list-style: none;
	padding: 0;
	margin-bottom: 10px;
}

span {
	color: var(--blue-30); /* Soft blue for property names */
	background: rgba(99, 179, 237, 0.1);
	padding: 2px 6px;
	border-radius: 4px;
	margin-right: 2px;
}
</style>
