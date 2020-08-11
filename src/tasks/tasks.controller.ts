import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiTags,
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../auth/user.entity';
import {
  CreateTaskDto,
  CreateTaskResponseDto,
  GetAllFilterDto,
  GetAllFilterResponseDto,
  GetByIdResponseDto,
  PatchTaskResponseDto,
} from './dto';
import { StatusValidationPipe } from './pipes/status-validation.pipe';
import { TasksService } from './tasks.service';
import { PatchTaskDto } from './dto/patch-task.dto';
import { ParamIdDto } from './dto/param-id.dto';

@ApiBearerAuth()
@ApiTags('task')
@ApiBadRequestResponse({ description: 'Bad request.' })
@ApiInternalServerErrorResponse({ description: 'Server error.' })
@UseGuards(AuthGuard())
@Controller('tasks')
export class TasksController {
  private logger = new Logger(TasksController.name);

  constructor(private tasksService: TasksService) {}

  @Get()
  getAll(@Query(ValidationPipe) filterDto: GetAllFilterDto, @GetUser() user: User): Promise<GetAllFilterResponseDto> {
    this.logger.verbose(`User "${user.username}" retreiving all tasks. Filters: ${JSON.stringify(filterDto)}`);
    return this.tasksService.getAll(filterDto, user);
  }

  @Get('/:id')
  getById(@Param() @Param('id', ParseIntPipe) dto: ParamIdDto, @GetUser() user: User): Promise<GetByIdResponseDto> {
    this.logger.verbose(`User "${user.username}" retreiving task with id ${dto.id}.`);
    return this.tasksService.getById(dto, user);
  }

  @Post()
  @UsePipes(ValidationPipe)
  create(@Body() dto: CreateTaskDto, @GetUser() user: User): Promise<CreateTaskResponseDto> {
    this.logger.verbose(`User "${user.username}" creating a new task. Data: ${JSON.stringify(dto)}`);
    return this.tasksService.create(dto, user);
  }

  @Patch('/:id/status')
  updateStatusById(
    @Param() @Param('id', ParseIntPipe) dtoParam: ParamIdDto,
    @Body() @Body('status', StatusValidationPipe) dtoBody: PatchTaskDto,
    @GetUser() user: User,
  ): Promise<PatchTaskResponseDto> {
    this.logger.verbose(`User "${user.username}" patching task[${dtoParam.id}] with status ${dtoBody.status}.`);
    return this.tasksService.updateStatusById(dtoParam.id, dtoBody.status, user);
  }

  @ApiOkResponse({ description: 'Sucess request.' })
  @Delete('/:id')
  async deleteById(@Param() @Param('id', ParseIntPipe) dto: ParamIdDto, @GetUser() user: User): Promise<void> {
    this.logger.verbose(`User "${user.username}" deleting task with id ${dto.id}.`);
    await this.tasksService.deleteById(dto.id, user);
  }
}
