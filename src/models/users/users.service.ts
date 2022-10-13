import { Injectable } from '@nestjs/common'
import { User } from './interfaces/user'
import _ from 'lodash'
import { UserInit } from './interfaces/user-init'
import { UserInitPartial } from './interfaces/user-init-partial'
import { PrismaService } from '../../prisma/prisma.service'
import { Prisma, User as PrismaUser } from '@prisma/client'

@Injectable()
export class UsersService {
	constructor(private prisma: PrismaService) {}

	async getAllUsers(): Promise<Array<PrismaUser>> {
		return await this.prisma.user.findMany()
	}

	async getUserById(
		id: string,
	): Promise<PrismaUser | null> {
		return await this.prisma.user.findUnique({
			where: {
				id,
			},
		})
	}

	async createUser(init: UserInit): Promise<PrismaUser> {
		return this.prisma.user.create({
			data: {
				name: init.name,
			},
		})
	}

	async updateUser(
		id: string,
		update: UserInitPartial,
	): Promise<PrismaUser | null> {
		try {
			return await this.prisma.user.update({
				where: {
					id,
				},
				data: {
					name: update.name,
				},
			})
		} catch {
			return null
		}
	}

	async deleteUser(
		id: string,
	): Promise<PrismaUser | null> {
		try {
			return await this.prisma.user.delete({
				where: {
					id,
				},
			})
		} catch {
			return null
		}
	}
}
