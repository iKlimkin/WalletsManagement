import { Column, Entity, PrimaryColumn } from 'typeorm';
import { BaseDomainEntity } from './baseEntity';

export enum DeliveryStatus {
  Pending = 'pending',
  Failed = 'failed',
  Delivered = 'delivered',
}

@Entity()
export class OutboxEvent<T> extends BaseDomainEntity {
  @Column({ type: 'jsonb' })
  data: T;

  @Column()
  serviceName: string;
  @Column({ nullable: true })
  traceId: string;
  @Column()
  eventName: string;
  //   @Column()
  //   eventType: string;
  @Column({
    type: 'enum',
    enum: DeliveryStatus,
    default: DeliveryStatus.Pending,
  })
  status: DeliveryStatus;
}
