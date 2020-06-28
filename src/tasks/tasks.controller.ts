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
  UseGuards,
  Logger,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetAllFilterDto } from './dto/get-all-filter.dto';
import { StatusValidationPipe } from './pipes/status-validation.pipe';
import { Task } from './task.entity';
import { TaskStatus } from './task-status.enum';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../auth/user.entity';

@UseGuards(AuthGuard())
@Controller('tasks')
export class TasksController {
  private logger = new Logger(TasksController.name);

  constructor(private tasksService: TasksService) {}

  @Get()
  getAll(@Query(ValidationPipe) filterDto: GetAllFilterDto, @GetUser() user: User): Promise<Task[]> {
    this.logger.verbose(`User "${user.username}" retreiving all tasks. Filters: ${JSON.stringify(filterDto)}`);
    return this.tasksService.getAll(filterDto, user);
  }

  @Get('/:id')
  getById(@Param('id', ParseIntPipe) id: number, @GetUser() user: User): Promise<Task> {
    return this.tasksService.getById(id, user);
  }

  @Post()
  @UsePipes(ValidationPipe)
  create(@Body() dto: CreateTaskDto, @GetUser() user: User): Promise<Task> {
    this.logger.verbose(`User "${user.username}" creating a new task. Data: ${JSON.stringify(dto)}`);
    return this.tasksService.create(dto, user);
  }

  @Patch('/:id/status')
  updateStatusById(
    @Param('id', ParseIntPipe) id: number,
    @Body('status', StatusValidationPipe) status: TaskStatus,
    @GetUser() user: User,
  ): Promise<Task> {
    return this.tasksService.updateStatusById(id, status, user);
  }

  @Delete('/:id')
  async deleteById(@Param('id', ParseIntPipe) id: number, @GetUser() user: User): Promise<void> {
    await this.tasksService.deleteById(id, user);
  }
}
