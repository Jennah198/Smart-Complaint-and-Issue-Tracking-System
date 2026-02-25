import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateComplaintDto } from './dto/create-complaint.dto';
import { UpdateStatusDto } from './dto/update-status.dto';

@Injectable()
export class ComplaintService {
  constructor(private prisma: PrismaService) {}

  async createComplaint(studentId: string, dto: CreateComplaintDto) {
    const complaint = await this.prisma.complaint.create({
      data: {
        title: dto.title,
        description: dto.description,
        category: dto.category,
        studentId,
        status: 'OPEN',
      },
    });

    // Create initial status log
    await this.prisma.complaintStatusLog.create({
      data: {
        complaintId: complaint.id,
        oldStatus: '',
        newStatus: 'OPEN',
        changedById: studentId,
      },
    });

    return complaint;
  }

  async updateStatus(
    complaintId: string,
    changedById: string,
    dto: UpdateStatusDto,
  ) {
    const complaint = await this.prisma.complaint.update({
      where: { id: complaintId },
      data: { status: dto.newStatus },
    });

    await this.prisma.complaintStatusLog.create({
      data: {
        complaintId,
        oldStatus: complaint.status,
        newStatus: dto.newStatus,
        changedById,
      },
    });

    return complaint;
  }

  async getStudentComplaints(studentId: string) {
    return this.prisma.complaint.findMany({
      where: { studentId },
      include: { statusLogs: true, assignedTo: true },
    });
  }
}
