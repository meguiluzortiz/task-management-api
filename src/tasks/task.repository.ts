import { Repository, EntityRepository } from 'typeorm';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './task-status.enum';
import { GetAllFilterDto } from './dto/get-all-filter.dto';
import { User } from 'src/auth/user.entity';

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
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

    return query.getMany();
  }

  async createEntity(dto: CreateTaskDto, user: User): Promise<Task> {
    const { title, description } = dto;

    const task = new Task();
    task.title = title;
    task.description = description;
    task.status = TaskStatus.OPEN;
    task.user = user;

    await task.save();
    delete task.user;
    return task;
  }
}
