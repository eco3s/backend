import { Test, TestingModule } from '@nestjs/testing'
import { PrismaService } from '../../prisma/prisma.service'
import { UsersService } from '../../models/users/users.service'
import { UsersController } from './users.controller'
import { DeepMockProxy, mockDeep } from 'jest-mock-extended'
import { PrismaClient } from '@prisma/client'

describe('UsersController', () => {
	let controller: UsersController
	let prisma: DeepMockProxy<PrismaClient>

	beforeEach(async () => {
		const module: TestingModule =
			await Test.createTestingModule({
				controllers: [UsersController],
				providers: [UsersService, PrismaService],
			})
				.overrideProvider(PrismaService)
				.useValue(mockDeep<PrismaClient>())
				.compile()

		controller =
			module.get<UsersController>(UsersController)
		prisma = module.get(PrismaService)
	})

	it('should be defined', () => {
		expect(controller).toBeDefined()
	})
})
