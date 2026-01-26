<template>
	<div class="notification-filters">
		<KtForm v-model="filters" size="small">
			<KtFieldText
				formKey="search"
				:isDisabled="areFiltersDisabled"
				isOptional
				leftIcon="search"
				placeholder="Search Notification"
			/>

			<div class="notification-filters__select-controles">
				<KtFieldSingleSelect
					formKey="types"
					:isDisabled="areFiltersDisabled"
					isOptional
					label="Types"
					:options="typeOptions"
					style="width: 100%"
				/>
				<KtFieldSingleSelect
					formKey="origins"
					:isDisabled="areFiltersDisabled"
					isOptional
					label="Origins"
					:options="originOptions"
					style="width: 100%"
				/>
			</div>

			<div class="notification-filters__toggle-controles">
				<KtFieldToggle
					formKey="isNewestFirst"
					:isDisabled="areFiltersDisabled"
					isOptional
					label="Newest First"
					type="switch"
				/>

				<KtFieldToggle
					formKey="unreadOnly"
					:isDisabled="areFiltersDisabled"
					isOptional
					label="Unread Only"
					type="switch"
				/>

				<KtButton
					:disabled="areFiltersDisabled"
					helpText="Mark All as Read"
					icon="eye"
					size="small"
					@click="markAllRead"
				/>

				<KtButton
					:disabled="areFiltersDisabled"
					helpText="Mark All as Un-Read"
					icon="eye_slashed"
					size="small"
					@click="markAllUnRead"
				/>

				<KtButton
					:disabled="areFiltersDisabled"
					helpText="Delete All"
					icon="close"
					size="small"
					type="danger"
					@click="clearAll"
				/>
			</div>
		</KtForm>
	</div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'

import KtButton from '../../kotti-button/KtButton.vue'
import { KtFieldSingleSelect } from '../../kotti-field-select'
import KtFieldText from '../../kotti-field-text/KtFieldText.vue'
import KtFieldToggle from '../../kotti-field-toggle/KtFieldToggle.vue'
import KtForm from '../../kotti-form/KtForm.vue'
import { useNotifications } from '../composables/useNotificaitons.ts'
import {
	getNotificationOriginOptions,
	getNotificationTypeOptions,
} from '../consts.ts'

//

export default defineComponent({
	name: 'NotificationFilters',
	components: {
		KtButton,
		KtFieldSingleSelect,
		KtFieldText,
		KtFieldToggle,
		KtForm,
	},
	setup() {
		const { filters, markAllRead, markAllUnRead, clearAll, hasNotifications } =
			useNotifications()

		// Filter Options
		const typeOptions = getNotificationTypeOptions()
		const originOptions = getNotificationOriginOptions()

		const areFiltersDisabled = computed<boolean>(() => !hasNotifications.value)

		return {
			areFiltersDisabled,
			clearAll,
			filters,
			markAllRead,
			markAllUnRead,
			originOptions,
			typeOptions,
		}
	},
})
</script>

<style lang="scss" scoped>
.notification-filters {
	&__toggle-controles {
		display: flex;
		gap: 2rem;
		justify-content: start;
		align-items: center;
	}
	&__select-controles {
		display: flex;
		gap: 1rem;
	}
}
</style>
