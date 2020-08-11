import { Test } from '@nestjs/testing';
import { TaskRepository } from './task.repository';
import { TasksService } from './tasks.service';
import { GetAllFilterDto } from './dto/get-all-filter.dto';
import { TaskStatus } from './task-status.enum';
import { NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { Task } from './task.entity';
import { User } from '../auth/user.entity';
import { ParamIdDto } from './dto';

describe('TaskService', () => {
  const mockUser = new User();
  let tasksService: TasksService;
  let taskRepository: TaskRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TasksService, //
        TaskRepository,
      ],
    }).compile();

    tasksService = module.get<TasksService>(TasksService);
    taskRepository = module.get<TaskRepository>(TaskRepository);
  });

  describe('getAll', () => {
    it('Gets all tasks from the repository', async () => {
      const mockValue: Task[] = [];
      const mockServiceValue = { data: [], total: 0 };
      jest.spyOn(taskRepository, 'getAll').mockResolvedValue(mockValue);
      expect(taskRepository.getAll).not.toHaveBeenCalled();
      const filters: GetAllFilterDto = { status: TaskStatus.OPEN, search: 'Some search query' };
      const result = await tasksService.getAll(filters, mockUser);
      expect(taskRepository.getAll).toHaveBeenCalled();
      expect(result).toEqual(mockServiceValue);
    });
  });

  describe('getById', () => {
    const paramId: ParamIdDto = {
      id: 1,
    };
    const { id } = paramId;

    it('call taskRepository.findOne() and sucessfully retrieve and return the task', async () => {
      const mockValue = new Task();
      jest.spyOn(taskRepository, 'findOne').mockResolvedValue(mockValue);
      const result = await tasksService.getById(paramId, mockUser);
      expect(result).toEqual(mockValue);
      expect(taskRepository.findOne).toHaveBeenCalledWith({
        where: { id, userId: mockUser.id },
      });
    });

    it('throws an error as task is not found', async () => {
      jest.spyOn(taskRepository, 'findOne').mockResolvedValue(null);
      await expect(tasksService.getById(paramId, mockUser)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('calls taskRepository.createEntity() and returns the result', async () => {
      const mockValue = new Task();
      jest.spyOn(taskRepository, 'createEntity').mockResolvedValue(mockValue);
      expect(taskRepository.createEntity).not.toHaveBeenCalled();
      const dto: CreateTaskDto = { title: 'Hello world', description: 'A first program story' };
      const result = await tasksService.create(dto, mockUser);
      expect(taskRepository.createEntity).toHaveBeenCalledWith(dto, mockUser);
      expect(result).toEqual(mockValue);
    });
  });

  describe('deleteById', () => {
    const id = 1;

    it('calls taskRepository.deleteById() to delete a task', async () => {
      const mockValue = { affected: 1, raw: undefined };
      jest.spyOn(taskRepository, 'delete').mockResolvedValue(mockValue);
      expect(taskRepository.delete).not.toHaveBeenCalled();
      await tasksService.deleteById(id, mockUser);
      expect(taskRepository.delete).toHaveBeenCalledWith({ id, userId: mockUser.id });
    });

    it('throws an error as task could not be found', async () => {
      const mockValue = { affected: 0, raw: undefined };
      jest.spyOn(taskRepository, 'delete').mockResolvedValue(mockValue);
      await expect(tasksService.deleteById(id, mockUser)).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateStatusById', () => {
    const id = 1;
    it('updates a task status', async () => {
      const save = jest.fn().mockResolvedValue(true);
      const statusValue = TaskStatus.DONE;
      tasksService['getTaskById'] = jest.fn().mockResolvedValue({
        status: TaskStatus.OPEN,
        save,
      });
      expect(tasksService['getTaskById']).not.toHaveBeenCalled();
      const result = await tasksService.updateStatusById(id, statusValue, mockUser);
      expect(tasksService['getTaskById']).toHaveBeenCalled();
      expect(save).toHaveBeenCalled();
      expect(result.status).toEqual(statusValue);
    });
  });
});
