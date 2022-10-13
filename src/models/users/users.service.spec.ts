import { Test, TestingModule } from '@nestjs/testing'
import { User } from './interfaces/user'
import { UsersService } from './users.service'

describe('UsersService', () => {
	let service: UsersService

	beforeEach(async () => {
		const module: TestingModule =
			await Test.createTestingModule({
				providers: [UsersService],
			}).compile()

		service = module.get<UsersService>(UsersService)
	})

	it('CRUD user', () => {
		const name = 'abiria'

		const user = service.createUser({ name })

		expect(user).toHaveProperty('name', name)

		expect(service.getUserById(user.id)).toHaveProperty(
			'name',
			name,
		)

		const newName = 'kokok'

		expect(
			service.updateUser(user.id, { name: newName }),
		).toHaveProperty('name', newName)

		expect(service.deleteUser(user.id)).toHaveProperty(
			'name',
			newName,
		)

		expect(service.getAllUsers()).toHaveLength(0)
	})

	it('must return null if there is no such user to find', () => {
		expect(
			service.getUserById('ThereIsNoSuchId'),
		).toBeNull()
	})

	it('must return null if there is no such user to update', () => {
		expect(
			service.updateUser('ThereIsNoSuchId', {}),
		).toBeNull()
	})

	it('must return null if there is no such user to delete', () => {
		expect(
			service.deleteUser('ThereIsNoSuchId'),
		).toBeNull()
	})
})
