import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import request from 'supertest'
import { AppModule } from '../src/app.module'
import { PrismaService } from '../src/prisma/prisma.service'

describe('CRUD users', () => {
	let app: INestApplication
	let server: any

	jest.setTimeout(10000)

	beforeAll(async () => {
		const moduleFixture: TestingModule =
			await Test.createTestingModule({
				imports: [AppModule],
			}).compile()

		app = moduleFixture.createNestApplication()
		await app.init()
		server = app.getHttpServer()

		const pr = app.get(PrismaService)
		await pr.user.deleteMany()
	})

	const user = {
		name: 'Abiria',
		id: null,
	}

	it('must return empty array', async () => {
		const res = await request(server).get('/users')

		expect(res.body).toHaveLength(0)
	})

	it('must create new user', async () => {
		const res = await request(server)
			.post('/users')
			.send(user)

		expect(res.status).toBe(201)
		expect(res.body.name).toBe(user.name)
		expect(typeof res.body.id).toBe('string')

		user.id = res.body.id
	})

	it('must return one user', async () => {
		const res = await request(server).get('/users')

		expect(res.body).toHaveLength(1)
	})

	// it('must return newly created user', async () => {
	// 	const res = await request(server).get(
	// 		`/users/${user.id}`,
	// 	)
	//
	// 	expect(res.body.name).toBe(user.name)
	// })
	//
	// it("must change user's name", async () => {
	// 	const newName = 'newName'
	//
	// 	const res = await request(server)
	// 		.patch(`/users/${user.id}`)
	// 		.send({
	// 			name: newName,
	// 		})
	//
	// 	expect(res.body.name).toBe(newName)
	//
	// 	user.name = newName
	// })
	//
	// it('must delete user', async () => {
	// 	const res = await request(server).delete(
	// 		`/users/${user.id}`,
	// 	)
	//
	// 	expect(res.body.name).toBe(user.name)
	// })
	//
	// it('must return empty array again', async () => {
	// 	const res = await request(server).get('/users')
	//
	// 	expect(res.body).toHaveLength(0)
	// })

	afterAll(async () => {
		await app.close()
	})
})
