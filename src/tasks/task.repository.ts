import { Repository, EntityRepository } from 'typeorm';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './task-status.enum';
import { GetAllFilterDto } from './dto/get-all-filter.dto';
import { User } from 'src/auth/user.entity';
import { Logger, InternalServerErrorException } from '@nestjs/common';

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
  private logger = new Logger(TaskRepository.name);

  async getAll(filterDto: GetAllFilterDto, user: User): Promise<Task[]> {
    const { status, search } = filterDto;
    const query = this.createQueryBuilder('t');

    query.where('t.userId = :userId', { userId: user.id });

    if (status) {
      query.andWhere('t.status = :status', { status: status });
    }

    if (search) {
      query.andWhere('(t.description LIKE :q OR t.description LIKE :q)', { q: `%${search}%` });
    }

    try {
      const tasks = query.getMany();
      return tasks;
    } catch (error) {
      this.logger.error(
        `Failed to get tasks for user "${user.username}". Filters: ${JSON.stringify(filterDto)}`,
        error.stack,
      );
      throw new InternalServerErrorException();
    }
  }

  async createEntity(dto: CreateTaskDto, user: User): Promise<Task> {
    const { title, description } = dto;

    const task = new Task();
    task.title = title;
    task.description = description;
    task.status = TaskStatus.OPEN;
    task.user = user;
    try {
      await task.save();
      delete task.user;
      return task;
    } catch (error) {
      this.logger.error(`Failed to create task for user "${user.username}". Data: ${JSON.stringify(dto)}`, error.stack);
      throw new InternalServerErrorException();
    }
  }
}
