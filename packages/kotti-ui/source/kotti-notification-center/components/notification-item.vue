<template>
	<div
		:aria-label="`Notification: ${notification.title}`"
		class="kt-notification-item"
		:class="[
			`kt-notification-item--${notification.type}`,
			{ 'is-unread': isUnread },
		]"
		role="listitem"
		tabindex="0"
		@keydown.enter.self="toggleRead(notification.id)"
	>
		<div class="kt-notification-item__type-bar" />

		<div class="kt-notification-item__indicator-zone">
			<div v-if="isUnread" class="unread-dot" />
		</div>

		<div class="kt-notification-item__main">
			<div class="kt-notification-item__meta">
				<span class="origin">{{ notification.origin }}</span>
				<span class="divider">•</span>
				<span class="time">{{ notificationTime }}</span>
			</div>

			<h4 class="title">{{ notification.title }}</h4>
			<p class="description">{{ notification.content }}</p>

			<div
				v-if="notification.references?.link"
				class="kt-notification-item__footer"
			>
				<a
					class="link"
					:href="notification.references.link"
					target="_blank"
					@click.stop
				>
					View Details <span class="arrow">→</span>
				</a>
			</div>
		</div>

		<div class="kt-notification-item__actions">
			<KtButton
				v-if="isUnread"
				class="action-btn"
				icon="eye"
				size="small"
				@click="toggleRead(notification.id)"
			/>
			<KtButton
				v-else
				class="action-btn is-read"
				icon="eye_slashed"
				size="small"
				tabindex="-1"
				@click="toggleRead(notification.id)"
			/>
			<KtButton
				class="action-btn delete-btn"
				icon="close"
				size="small"
				tabindex="-1"
				@click.stop="remove(notification.id)"
			/>
		</div>
	</div>
</template>

<script lang="ts">
import dayjs from 'dayjs'
import { computed, defineComponent } from 'vue'

import KtButton from '../../kotti-button/KtButton.vue'
import { makeProps } from '../../make-props.ts'
import { useNotifications } from '../composables/useNotificaitons.ts'
import { KottiNotificationCenter } from '../types.ts'

//

export default defineComponent({
	name: 'NotificationItem',
	components: { KtButton },
	props: makeProps(KottiNotificationCenter.notificationItemComponentProps),
	setup(props) {
		const { remove, toggleRead } = useNotifications()

		const isUnread = computed<boolean>(
			() => props.notification.toggle === KottiNotificationCenter.Toggle.UNREAD,
		)

		const notificationTime = computed<string>(() =>
			dayjs(props.notification.timestamp).format('MMM DD hh:m A'),
		)

		return { isUnread, notificationTime, remove, toggleRead }
	},
})
</script>

<style lang="scss" scoped>
.kt-notification-item {
	width: 100%;
	display: flex;
	min-height: fit-content;
	position: relative;
	background: var(--gray-100);
	border-bottom: 1px solid rgba(61, 59, 59, 0.62);
	flex-shrink: 0;
	transition: background 0.2s ease;
	box-sizing: border-box;
	overflow: hidden;
	cursor: pointer;

	&:hover {
		background: var(--gray-100);
		.action-btn {
			opacity: 1;
		}
	}

	&.is-unread {
		background: #1a1d23;
		.title {
			color: #ffffff;
			font-weight: 700;
		}
	}

	&__type-bar {
		width: 4px;
		flex-shrink: 0;
		align-self: stretch;
	}

	// types color
	&--info &__type-bar {
		background: var(--blue-50);
	}
	&--warning &__type-bar {
		background: var(--orange-40);
	}
	&--error &__type-bar {
		background: var(--red-40);
	}

	&__indicator-zone {
		width: 32px;
		display: flex;
		justify-content: center;
		padding-top: 20px;
		flex-shrink: 0;

		.unread-dot {
			width: 8px;
			height: 8px;
			background-color: var(--green-40);
			border-radius: 50%;
			box-shadow: 0 0 8px rgba(8, 244, 59, 0.6);
		}
	}

	&__main {
		flex: 1;
		padding: 16px 0;
		min-width: 0;
		display: flex;
		flex-direction: column;
	}

	&__meta {
		font-size: 10px;
		color: var(--gray-60);
		text-transform: uppercase;
		font-weight: 800;
		margin-bottom: 6px;
		letter-spacing: 0.05em;

		.divider {
			margin: 0 8px;
			color: var(--gray-50);
		}
	}

	.title {
		margin: 0 0 4px 0;
		font-size: 14px;
		color: var(--primary-05);
		line-height: 1.2;
	}

	.description {
		margin: 0;
		font-size: 13px;
		color: var(--gray-40);
		line-height: 1.6;
	}

	&__footer {
		margin-top: 12px;
		.link {
			font-size: 12px;
			color: var(--blue-50);
			text-decoration: none;
			font-weight: 700;
			display: inline-flex;
			align-items: center;
			gap: 6px;

			&:hover {
				color: var(--blue-30);
				.arrow {
					transform: translateX(4px);
				}
			}
			.arrow {
				transition: transform 0.2s;
			}
		}
	}

	&__actions {
		display: flex;
		gap: 8px;
		padding: 16px 16px 16px 12px;
		flex-shrink: 0;
	}
}
</style>
