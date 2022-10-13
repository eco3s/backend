import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { PrismaService } from './prisma/prisma.service'

export async function bootstrap() {
	const app = await NestFactory.create(AppModule)
	const prismaService = app.get(PrismaService)
	await prismaService.enableShutdownHooks(app)
	await app.listen(3000)

	return app
}

if (!process.env.HMR) bootstrap()
