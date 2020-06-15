import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetAllFilterDto } from './dto/get-all-filter.dto';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { TaskStatus } from './task-status.enum';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository)
    private taskRepository: TaskRepository,
  ) {}

  async getAll(filterDto: GetAllFilterDto): Promise<Task[]> {
    return this.taskRepository.getAll(filterDto);
  }

  async getById(id: number): Promise<Task> {
    const found = await this.taskRepository.findOne(id);
    if (!found) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
    return found;
  }

  async create(dto: CreateTaskDto): Promise<Task> {
    return this.taskRepository.createEntity(dto);
  }

  async updateStatusById(id: number, status: TaskStatus): Promise<Task> {
    const task = await this.getById(id);
    task.status = status;
    await task.save();
    return task;
  }

  async deleteById(id: number): Promise<void> {
    const result = await this.taskRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
  }
}
