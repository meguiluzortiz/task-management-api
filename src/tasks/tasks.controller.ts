import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  Query,
  UsePipes,
  ValidationPipe,
  ParseIntPipe,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetAllFilterDto } from './dto/get-all-filter.dto';
import { StatusValidationPipe } from './pipes/status-validation.pipe';
import { Task } from './task.entity';
import { TaskStatus } from './task-status.enum';

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  getAll(@Query(ValidationPipe) filterDto: GetAllFilterDto): Promise<Task[]> {
    return this.tasksService.getAll(filterDto);
  }

  @Get('/:id')
  getById(@Param('id', ParseIntPipe) id: number): Promise<Task> {
    return this.tasksService.getById(id);
  }

  @Post()
  @UsePipes(ValidationPipe)
  create(@Body() dto: CreateTaskDto): Promise<Task> {
    return this.tasksService.create(dto);
  }

  @Patch(':id')
  updateStatusById(
    @Param('id', ParseIntPipe) id: number,
    @Body('status', StatusValidationPipe) status: TaskStatus,
  ): Promise<Task> {
    return this.tasksService.updateStatusById(id, status);
  }

  @Delete('/:id')
  async deleteById(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.tasksService.deleteById(id);
  }
}
