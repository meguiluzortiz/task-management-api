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
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task, TaskStatus } from './task.model';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetAllFilterDto } from './dto/get-all-filter.dto';
import { StatusValidationPipe } from './pipes/status-validation.pipe';

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  getAll(@Query(ValidationPipe) filterDto: GetAllFilterDto): Task[] {
    if (Object.keys(filterDto).length) {
      return this.tasksService.getAllFiltered(filterDto);
    }
    return this.tasksService.getAll();
  }

  @Get('/:id')
  getById(@Param('id') id: string): Task {
    return this.tasksService.getById(id);
  }

  @Post()
  @UsePipes(ValidationPipe)
  create(@Body() dto: CreateTaskDto): Task {
    return this.tasksService.create(dto);
  }

  @Patch(':id')
  updateStatusById(
    @Param('id') id: string,
    @Body('status', StatusValidationPipe) status: TaskStatus,
  ): Task {
    return this.tasksService.updateStatusById(id, status);
  }

  @Delete('/:id')
  deleteById(@Param('id') id: string): void {
    this.tasksService.deleteById(id);
  }
}
