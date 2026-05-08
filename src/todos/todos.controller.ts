import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { Todo } from '@prisma/client';
import { CreateTodoDto } from './dto/create-todo.dto';
import { ListTodosQueryDto } from './dto/list-todos.query.dto';
import { TodosService } from './todos.service';

@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Post()
  create(@Body() dto: CreateTodoDto): Promise<Todo> {
    return this.todosService.create(dto);
  }

  @Get()
  findAll(@Query() query: ListTodosQueryDto): Promise<Todo[]> {
    return this.todosService.findAll(query);
  }
}
