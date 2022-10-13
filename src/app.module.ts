import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ModelsModule } from './models/models.module'

@Module({
	imports: [ModelsModule],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
