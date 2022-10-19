import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
} from '@nestjs/common'
import { UserInit } from '../../models/users/interfaces/user-init'
import { UserInitPartial } from '../../models/users/interfaces/user-init-partial'
import { UsersService } from '../../models/users/users.service'

@Controller('users')
export class UsersController {
	constructor(private userService: UsersService) {}

	@Get()
	async getUsers() {
		return await this.userService.getAllUsers()
	}

	@Get()
	async getUser(@Param('id') id: string) {
		return await this.userService.getUserById(id)
	}

	@Post()
	async createUser(@Body() body: UserInit) {
		return await this.userService.createUser(body)
	}

	@Patch()
	async editUser(
		@Param('id') id: string,
		@Body() body: UserInitPartial,
	) {
		return await this.userService.updateUser(id, body)
	}

	@Delete()
	async deleteUser(@Param('id') id: string) {
		return await this.userService.deleteUser(id)
	}
}
