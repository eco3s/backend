import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ModelsModule } from './models/models.module'
import { PrismaService } from './prisma/prisma.service'
import { PrismaModule } from './prisma/prisma.module'

@Module({
	imports: [ModelsModule, PrismaModule],
	controllers: [AppController],
	providers: [AppService, PrismaService],
})
export class AppModule {}
