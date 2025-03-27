import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { LoggingService } from '../logging/logging.service';
import { Request } from 'express';

@Injectable()
export class TransactionsService {
  constructor(
    private prisma: PrismaService,
    private loggingService: LoggingService,
  ) {}

  async findAll() {
    return this.prisma.transaction.findMany({
      include: {
        bookings_bookings_transaction_idTotransactions: true,
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.transaction.findUnique({
      where: { transactionId: id },
      include: {
        bookings_bookings_transaction_idTotransactions: true,
      },
    });
  }

  async create(data: any, req?: Request) {
    const transaction = await this.prisma.transaction.create({
      data,
      include: {
        bookings_bookings_transaction_idTotransactions: true,
      },
    });

    await this.loggingService.logDatabaseAction(
      'transactions',
      'insert',
      transaction.transactionId,
      transaction,
      undefined,
      (req?.user as any)?.sub,
    );

    return transaction;
  }

  async update(id: string, data: any, req?: Request) {
    const oldTransaction = await this.findOne(id);
    
    const transaction = await this.prisma.transaction.update({
      where: { transactionId: id },
      data,
      include: {
        bookings_bookings_transaction_idTotransactions: true,
      },
    });

    await this.loggingService.logDatabaseAction(
      'transactions',
      'update',
      transaction.transactionId,
      transaction,
      oldTransaction,
      (req?.user as any)?.sub,
    );

    return transaction;
  }

  async remove(id: string, req?: Request) {
    const oldTransaction = await this.findOne(id);
    
    const transaction = await this.prisma.transaction.delete({
      where: { transactionId: id },
    });

    await this.loggingService.logDatabaseAction(
      'transactions',
      'delete',
      id,
      undefined,
      oldTransaction,
      (req?.user as any)?.sub,
    );

    return transaction;
  }
} 