import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateComplaintDto } from './dto/create-complaint.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { ComplaintStatus, Priority } from '@prisma/client';

@Injectable()
export class ComplaintService {
  constructor(private prisma: PrismaService) {}

  async createComplaint(userId: string, dto: CreateComplaintDto) {
    const complaint = await this.prisma.complaint.create({
      data: {
        title: dto.title,
        description: dto.description,
        organizationId: dto.organizationId,
        categoryId: dto.categoryId,
        departmentId: dto.departmentId,
        createdById: userId,
        priority: dto.priority ?? Priority.MEDIUM,
        attachments: dto.attachments ?? [],
        status: ComplaintStatus.OPEN,
      },
    });

    await this.prisma.complaintStatusLog.create({
      data: {
        complaintId: complaint.id,
        changedById: userId,
      },
    });

    return complaint;
  }

  async updateStatus(
    complaintId: string,
    changedById: string,
    dto: UpdateStatusDto,
  ) {
    const updated = await this.prisma.complaint.update({
      where: { id: complaintId },
      data: {
        status: dto.newStatus as ComplaintStatus,
      },
    });

    await this.prisma.complaintStatusLog.create({
      data: {
        complaintId,
        changedById,
      },
    });

    return updated;
  }

  async getMyComplaints(userId: string) {
    return this.prisma.complaint.findMany({
      where: {
        createdById: userId,
      },
      include: {
        statusLogs: true,
        category: true,
        department: true,
        assignedTo: true,
      },
    });
  }
}
