import { Test, TestingModule } from '@nestjs/testing'
import { PrismaService } from '../../prisma/prisma.service'
import { UsersService } from './users.service'
import { Prisma, PrismaClient } from '@prisma/client'
import { DeepMockProxy, mockDeep } from 'jest-mock-extended'
import { nanoid } from 'nanoid'

describe('UsersService', () => {
	let service: UsersService
	let prisma: DeepMockProxy<PrismaClient>

	beforeEach(async () => {
		const module: TestingModule =
			await Test.createTestingModule({
				providers: [UsersService, PrismaService],
			})
				.overrideProvider(PrismaService)
				.useValue(mockDeep<PrismaClient>())
				.compile()

		service = module.get<UsersService>(UsersService)
		prisma = module.get(PrismaService)

		await prisma.user.deleteMany({})
	})

	describe('CRUD tests with user', () => {
		// test data
		const user = {
			name: 'abiria',
			id: nanoid(),
			createdAt: new Date(),
		}

		it('must create user with given data', () => {
			prisma.user.create.mockResolvedValueOnce(user)

			expect(
				service.createUser({
					name: user.name,
				}),
			).resolves.toHaveProperty('name', user.name)
		})

		it('must return user with given id', () => {
			prisma.user.findMany.mockResolvedValueOnce([
				user,
			])

			expect(
				service.getAllUsers(),
			).resolves.toHaveLength(1)
		})

		it('must return user with given id', () => {
			prisma.user.findUnique.mockResolvedValueOnce(
				user,
			)

			expect(
				service.getUserById(user.id),
			).resolves.toHaveProperty('name', user.name)
		})

		it('must find user with given id and update it with given data', () => {
			prisma.user.update.mockResolvedValueOnce({
				...user,
				name: 'newName',
			})

			expect(
				service.updateUser(user.id, {
					name: 'newName',
				}),
			).resolves.toHaveProperty('name', 'newName')
		})

		it('must find user with given id and must not modify anything', () => {
			prisma.user.update.mockResolvedValueOnce(user)

			expect(
				service.updateUser(user.id, {}),
			).resolves.toHaveProperty('name', user.name)
		})

		it('must delete user with given id', () => {
			prisma.user.delete.mockResolvedValueOnce(user)

			expect(
				service.deleteUser(user.id),
			).resolves.toHaveProperty('name', user.name)
		})
	})

	describe('return null if target does not exist', () => {
		it('must return null if there is no such user to find', () => {
			prisma.user.findUnique.mockResolvedValueOnce(
				null,
			)

			expect(
				service.getUserById('ThereIsNoSuchId'),
			).resolves.toBeNull()
		})

		it('must return null if there is no such user to update', () => {
			prisma.user.update.mockRejectedValueOnce(
				// NOTE: in real cases, it will throw `RecordNotFound` error,
				// which is impossible to be caught in native javascript.
				// (https://github.com/prisma/prisma/discussions/4552)
				//
				// so in this case, we will just throw any Error object
				new Error('RecordNotFoundException'),
			)

			expect(
				service.updateUser('ThereIsNoSuchId', {}),
			).resolves.toBeNull()
		})

		it('must return null if there is no such user to delete', () => {
			prisma.user.delete.mockRejectedValueOnce(
				// NOTE: in real cases, it will throw `RecordNotFound` error,
				// which is impossible to be caught in native javascript.
				// (https://github.com/prisma/prisma/discussions/4552)
				//
				// so in this case, we will just throw any Error object
				new Error('RecordNotFoundException'),
			)

			expect(
				service.deleteUser('ThereIsNoSuchId'),
			).resolves.toBeNull()
		})
	})
})
