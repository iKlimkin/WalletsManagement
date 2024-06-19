import {
  Column,
  CreateDateColumn,
  PrimaryColumn,
  UpdateDateColumn
} from 'typeorm';

export class BaseDomainEntity {
  @PrimaryColumn('uuid')
  id: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;

  @Column({ nullable: true })
  createBy: string;
  @Column({nullable: true})
  updateBy: string;
}
