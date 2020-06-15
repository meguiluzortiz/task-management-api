import { Repository, EntityRepository } from 'typeorm';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './task-status.enum';
import { GetAllFilterDto } from './dto/get-all-filter.dto';

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
  async getAll(filterDto: GetAllFilterDto): Promise<Task[]> {
    const { status, search } = filterDto;
    const query = this.createQueryBuilder('t');

    if (status) {
      query.andWhere('t.status = :status', { status: status });
    }

    if (search) {
      query.andWhere('(t.description LIKE :q OR t.description LIKE :q)', { q: `%${search}%` });
    }

    return query.getMany();
  }

  async createEntity(dto: CreateTaskDto): Promise<Task> {
    const { title, description } = dto;

    const task = new Task();
    task.title = title;
    task.description = description;
    task.status = TaskStatus.OPEN;

    return task.save();
  }
}
