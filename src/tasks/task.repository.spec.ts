import { TaskRepository } from './task.repository';
import { Test } from '@nestjs/testing';
import { User } from '../auth/user.entity';
import { TaskStatus } from './task-status.enum';
import { InternalServerErrorException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { Task } from './task.entity';

describe('TaskRepository', () => {
  const mockUser = new User();
  mockUser.id = 1;
  mockUser.username = 'TestUser';
  let taskRepository: TaskRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [TaskRepository],
    }).compile();
    module.useLogger(null); // disable logging

    taskRepository = module.get<TaskRepository>(TaskRepository);
  });

  describe('getAll', () => {
    it('successfully retrieve all tasks', async () => {
      const filterDto = { status: TaskStatus.OPEN, search: 'Test search' };
      const mockValue = [];
      const getMany = jest.fn().mockResolvedValue(mockValue);

      const builder: any = {
        getMany,
        where: jest.fn().mockResolvedValue(true),
        andWhere: jest.fn().mockResolvedValue(true),
      };
      expect(getMany).not.toHaveBeenCalled();
      jest.spyOn(taskRepository, 'createQueryBuilder').mockReturnValue(builder);
      const result = await taskRepository.getAll(filterDto, mockUser);
      expect(builder.where).toHaveBeenCalledTimes(1);
      expect(builder.andWhere).toHaveBeenCalledTimes(2);
      expect(getMany).toHaveBeenCalled();
      expect(result).toEqual(mockValue);
    });

    it('throws an error as tasks cannot be retrieved', async () => {
      const filterDto = { status: null, search: null };
      const getMany = jest.fn().mockRejectedValue(InternalServerErrorException);
      const builder: any = {
        getMany,
        where: jest.fn().mockResolvedValue(true),
        andWhere: jest.fn().mockResolvedValue(true),
      };
      expect(getMany).not.toHaveBeenCalled();
      jest.spyOn(taskRepository, 'createQueryBuilder').mockReturnValue(builder);
      await expect(taskRepository.getAll(filterDto, mockUser)).rejects.toThrow(InternalServerErrorException);
      expect(builder.where).toHaveBeenCalledTimes(1);
      expect(builder.andWhere).not.toHaveBeenCalled();
      expect(getMany).toHaveBeenCalled();
    });
  });

  describe('createEntity', () => {
    const createTaskDto: CreateTaskDto = { title: 'TitleTest', description: 'DescriptionTest' };
    let task: Task;

    beforeEach(() => {
      task = new Task();
      jest.spyOn(taskRepository, 'create').mockReturnValue(task);
    });

    it('successfully create a task', async () => {
      jest.spyOn(task, 'save').mockResolvedValue(undefined);
      expect(taskRepository.create).not.toHaveBeenCalled();
      const result = await taskRepository.createEntity(createTaskDto, mockUser);
      expect(taskRepository.create).toHaveBeenCalled();
      expect(result.status).toEqual(TaskStatus.OPEN);
    });
    it('throws an error as task cannot be created', async () => {
      jest.spyOn(task, 'save').mockRejectedValue(InternalServerErrorException);
      expect(taskRepository.create).not.toHaveBeenCalled();
      await expect(taskRepository.createEntity(createTaskDto, mockUser)).rejects.toThrow(InternalServerErrorException);
      expect(taskRepository.create).toHaveBeenCalled();
    });
  });
});
