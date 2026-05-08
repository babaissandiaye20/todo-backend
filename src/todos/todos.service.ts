import { Injectable } from '@nestjs/common';
import { Todo } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTodoDto } from './dto/create-todo.dto';

@Injectable()
export class TodosService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateTodoDto): Promise<Todo> {
    return this.prisma.todo.create({
      data: {
        title: dto.title,
        description: dto.description,
        completed: dto.completed,
        priority: dto.priority,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
      },
    });
  }
}
