import { User } from './user'

export type UserInit = Omit<
	User,
	'id' | 'createdAt' | 'profile'
>
