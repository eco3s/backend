import { Test, TestingModule } from '@nestjs/testing'
import { PrismaService } from '../../prisma/prisma.service'
import { PrismaModule } from '../../prisma/prisma.module'
import { UsersService } from './users.service'

describe('UsersService', () => {
	let service: UsersService

	beforeEach(async () => {
		const module: TestingModule =
			await Test.createTestingModule({
				imports: [PrismaModule],
				providers: [UsersService],
			}).compile()

		service = module.get<UsersService>(UsersService)
		await new PrismaService().user.deleteMany()
	})

	it('CRUD user', async () => {
		const name = 'abiria'

		const user = await service.createUser({ name })

		expect(user).toHaveProperty('name', name)

		expect(
			await service.getUserById(user.id),
		).toHaveProperty('name', name)

		const newName = 'kokok'

		expect(
			await service.updateUser(user.id, {
				name: newName,
			}),
		).toHaveProperty('name', newName)

		expect(
			await service.deleteUser(user.id),
		).toHaveProperty('name', newName)

		expect(await service.getAllUsers()).toHaveLength(0)
	})

	it('must return null if there is no such user to find', async () => {
		expect(
			await service.getUserById('ThereIsNoSuchId'),
		).toBeNull()
	})

	it('must return null if there is no such user to update', async () => {
		expect(
			await service.updateUser('ThereIsNoSuchId', {}),
		).toBeNull()
	})

	it('must return null if there is no such user to delete', async () => {
		expect(
			await service.deleteUser('ThereIsNoSuchId'),
		).toBeNull()
	})
})
