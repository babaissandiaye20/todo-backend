import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, Todo } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { ListTodosQueryDto } from './dto/list-todos.query.dto';

@Injectable()
export class TodosService {
  constructor(private readonly prisma: PrismaService) {}

  async findOne(id: number): Promise<Todo> {
    const todo = await this.prisma.todo.findUnique({ where: { id } });
    if (!todo) {
      throw new NotFoundException(`Todo with id ${id} not found`);
    }
    return todo;
  }

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

  async findAll(query: ListTodosQueryDto): Promise<Todo[]> {
    const where: Prisma.TodoWhereInput = {};
    if (query.completed !== undefined) where.completed = query.completed;
    if (query.priority !== undefined) where.priority = query.priority;

    return this.prisma.todo.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }
}
