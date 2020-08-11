import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { TaskStatus } from './task-status.enum';
import { User } from '../auth/user.entity';
import {
  ParamIdDto,
  CreateTaskDto,
  CreateTaskResponseDto,
  GetAllFilterDto,
  GetAllFilterResponseDto,
  GetByIdResponseDto,
  PatchTaskResponseDto,
} from './dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository)
    private taskRepository: TaskRepository,
  ) {}

  async getAll(filterDto: GetAllFilterDto, user: User): Promise<GetAllFilterResponseDto> {
    const tasks = await this.taskRepository.getAll(filterDto, user);
    const response = new GetAllFilterResponseDto();
    response.total = tasks.length;
    response.data = tasks.map(GetByIdResponseDto.map);
    return response;
  }

  async getById(dto: ParamIdDto, user: User): Promise<GetByIdResponseDto> {
    const found = await this.getTaskById(dto.id, user);
    return GetByIdResponseDto.map(found);
  }

  private async getTaskById(id: number, user: User): Promise<Task> {
    const found = await this.taskRepository.findOne({ where: { id, userId: user.id } });
    if (!found) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
    return found;
  }

  async create(request: CreateTaskDto, user: User): Promise<CreateTaskResponseDto> {
    const created = await this.taskRepository.createEntity(request, user);
    const response = new CreateTaskResponseDto();
    response.id = created.id;
    response.userId = created.userId;

    return response;
  }

  async updateStatusById(id: number, status: TaskStatus, user: User): Promise<PatchTaskResponseDto> {
    const task = await this.getTaskById(id, user);
    task.status = status;
    await task.save();
    return GetByIdResponseDto.map(task);
  }

  async deleteById(id: number, user: User): Promise<void> {
    const result = await this.taskRepository.delete({ id, userId: user.id });
    if (result.affected === 0) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
  }
}
