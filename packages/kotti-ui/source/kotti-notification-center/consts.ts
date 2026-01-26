import startCase from 'lodash/startCase.js'

import type { Shared } from '../kotti-field-select/types.ts'

import { KottiNotificationCenter } from './types.ts'

//

export const INITIAL_PAGE_SIZE = 5

export const getNotificationTypeOptions = (): Shared.Option[] => {
	return Object.values(KottiNotificationCenter.Type).map((value) => ({
		label: startCase(value),
		value,
	}))
}

export const getNotificationOriginOptions = (): Shared.Option[] => {
	return Object.values(KottiNotificationCenter.Origin).map((value) => ({
		label: startCase(value),
		value,
	}))
}
