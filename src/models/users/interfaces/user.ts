import { nanoid } from 'nanoid'

export class User {
	id: string
	createdAt: Date
	name: string
	profile: string

	constructor(name: string) {
		this.id = nanoid()
		this.createdAt = new Date()
		this.name = name
		this.profile = '<profile>'
	}
}
