import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, Unique, OneToMany } from 'typeorm';
import * as bcryptjs from 'bcryptjs';
import { Task } from '../tasks/task.entity';

@Entity()
@Unique(['username'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  password: string;

  @OneToMany(
    () => Task,
    task => task.user,
    { eager: true },
  )
  tasks: Task[];

  validatePassword(password: string): Promise<boolean> {
    return bcryptjs.compare(password, this.password);
  }
}
