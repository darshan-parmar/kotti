import { z } from 'zod'

export namespace KottiNotificationCenter {
	export enum Origin {
		MACHINE = 'machine',
		SYSTEM = 'system',
		USER = 'user',
	}

	export enum Type {
		ERROR = 'error',
		INFO = 'info',
		WARNING = 'warning',
	}

	export enum Toggle {
		READ = 'read',
		UNREAD = 'unread',
	}

	// Zod schemas for enums
	export const originSchema = z.nativeEnum(Origin)
	export const typeSchema = z.nativeEnum(Type)
	export const toggleSchema = z.nativeEnum(Toggle)

	export const idSchema = z.string()

	export const referencesSchema = z.object({
		link: z.string().url().optional(),
		quoteId: z.string().optional(),
	})

	export const notificationSchema = z.object({
		content: z.string(),
		id: idSchema,
		origin: originSchema,
		references: referencesSchema.optional(),
		timestamp: z.string(),
		title: z.string(),
		toggle: toggleSchema,
		type: typeSchema,
	})

	export const notificationFiltersSchema = z.object({
		isNewestFirst: z.boolean(),
		origins: originSchema.nullable(),
		search: z.string().nullable(),
		types: typeSchema.nullable(),
		unreadOnly: z.boolean(),
	})

	export const storeStateSchema = z.object({
		displayLimit: z.number(),
		filters: notificationFiltersSchema,
		isOpen: z.boolean(),
		notifications: z.array(notificationSchema),
		summary: z.string(),
	})

	export const aiSummarySchema = z.object({
		apiToken: z.string(),
		apiUrl: z.string().url(),
		llmModel: z.string(),
	})

	export const notificationCenterComponentProps = z.object({
		aiSummary: aiSummarySchema.optional().nullable().default(null),
		title: z.string().default('Notifications'),
	})

	export const notificationItemComponentProps = z.object({
		notification: notificationSchema,
	})

	// TypeScript types inferred from Zod schemas
	export type Id = z.infer<typeof idSchema>
	export type References = z.infer<typeof referencesSchema>
	export type Notification = z.infer<typeof notificationSchema>
	export type NotificationFilters = z.infer<typeof notificationFiltersSchema>
	export type StoreState = z.infer<typeof storeStateSchema>
	export type AiConfig = z.infer<typeof aiSummarySchema>
	export type NotificationCenterProps = z.infer<
		typeof notificationCenterComponentProps
	>
}
