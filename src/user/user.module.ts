import { Module, forwardRef } from '@nestjs/common';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './model/user.entity';
import { UserService } from './user.service';
import { AuthModule } from 'src/auth/auth.module';
import { Role } from 'src/role/model/role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User,Role]), forwardRef(() => AuthModule)],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
