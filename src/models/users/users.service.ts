import { Injectable } from '@nestjs/common'
import { User } from './interfaces/user'
import _ from 'lodash'
import { UserInit } from './interfaces/user-init'
import { UserInitPartial } from './interfaces/user-init-partial'

@Injectable()
export class UsersService {
	private users: Array<User> = []

	getAllUsers(): Array<User> {
		return this.users
	}

	getUserById(id: string): User | null {
		return (
			_.find(this.users, {
				id,
			}) ?? null
		)
	}

	createUser(init: UserInit): User {
		const newUser = new User(init.name)
		this.users.push(newUser)

		return newUser
	}

	updateUser(
		id: string,
		update: UserInitPartial,
	): User | null {
		const index = _.findIndex(this.users, {
			id,
		})

		if (index === -1) return null

		return _.update(
			this.users,
			`[${index}]`,
			(u: User) => Object.assign(u, update),
		)[index]
	}

	deleteUser(id: string): User | null {
		return (
			_.remove(this.users, {
				id,
			})[0] ?? null
		)
	}
}
