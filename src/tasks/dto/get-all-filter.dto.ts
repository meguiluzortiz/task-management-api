import { TaskStatus } from '../task.model';

export class GetAllFilterDto {
  status: TaskStatus;
  search: string;
}
