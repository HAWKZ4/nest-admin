import { Exclude } from 'class-transformer';
import { User } from 'src/user/model/user.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Exclude()
  @Column()
  code: number;

  @OneToMany(() => User, (user) => user.role)
  users: User[];
}
