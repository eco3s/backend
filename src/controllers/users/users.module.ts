import { Module } from '@nestjs/common'
import { UsersController } from './users.controller'
import { UsersModule as UserModelModule } from '../../models/users/users.module'

@Module({
	imports: [UserModelModule],
	controllers: [UsersController],
})
export class UsersModule {}
