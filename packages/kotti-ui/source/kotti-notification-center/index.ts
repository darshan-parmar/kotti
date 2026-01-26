import { MetaDesignType } from '../types/kotti.ts'
import { attachMeta, makeInstallable } from '../utilities'

import KtNotificationCenterVue from './KtNotificationCenter.vue'
import { KottiNotificationCenter } from './types.ts'

//

export { useNotifications } from './composables/useNotificaitons'

export const KtNotificationCenter = attachMeta(
	makeInstallable(KtNotificationCenterVue),
	{
		addedVersion: '0.0.1',
		deprecated: null,
		designs: [
			{
				title: 'Simple',
				type: MetaDesignType.FIGMA,
				url: 'https://www.figma.com/file/0yFVivSWXgFf2ddEF92zkf/Kotti-Design-System?node-id=118%3A35',
			},
		],
		slots: {},
		typeScript: {
			namespace: 'Kotti.NotificationCenter',
			schema: KottiNotificationCenter.notificationItemComponentProps,
		},
	},
)
