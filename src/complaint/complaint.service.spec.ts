import { Test, TestingModule } from '@nestjs/testing';
import { ComplaintService } from './complaint.service';
import { PrismaService } from '../prisma/prisma.service';
import { ComplaintStatus, Priority } from '@prisma/client';

describe('ComplaintService', () => {
  let service: ComplaintService;
  let prisma: {
    complaint: { create: jest.Mock; update: jest.Mock; findMany: jest.Mock };
    complaintStatusLog: { create: jest.Mock };
  };

  beforeEach(async () => {
    prisma = {
      complaint: {
        create: jest.fn(),
        update: jest.fn(),
        findMany: jest.fn(),
      },
      complaintStatusLog: {
        create: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ComplaintService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<ComplaintService>(ComplaintService);
    jest.clearAllMocks();
  });

  it('creates a complaint and logs initial status', async () => {
    prisma.complaint.create.mockResolvedValue({ id: 'c-1' });
    prisma.complaintStatusLog.create.mockResolvedValue({ id: 'log-1' });

    const dto = {
      title: 'Noise',
      description: 'Too loud',
      organizationId: 'org-1',
      categoryId: 'cat-1',
      departmentId: 'dep-1',
    };

    const result = await service.createComplaint('user-1', dto);

    expect(prisma.complaint.create).toHaveBeenCalledWith({
      data: {
        title: dto.title,
        description: dto.description,
        organizationId: dto.organizationId,
        categoryId: dto.categoryId,
        departmentId: dto.departmentId,
        createdById: 'user-1',
        priority: Priority.MEDIUM,
        attachments: [],
        status: ComplaintStatus.OPEN,
      },
    });
    expect(prisma.complaintStatusLog.create).toHaveBeenCalledWith({
      data: {
        complaintId: 'c-1',
        changedById: 'user-1',
      },
    });
    expect(result).toEqual({ id: 'c-1' });
  });

  it('respects priority and attachments when provided', async () => {
    prisma.complaint.create.mockResolvedValue({ id: 'c-2' });
    prisma.complaintStatusLog.create.mockResolvedValue({ id: 'log-2' });

    await service.createComplaint('user-2', {
      title: 'Broken chair',
      description: 'Chair is broken',
      organizationId: 'org-1',
      categoryId: 'cat-1',
      departmentId: 'dep-1',
      priority: Priority.HIGH,
      attachments: ['file-1'],
    });

    expect(prisma.complaint.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          priority: Priority.HIGH,
          attachments: ['file-1'],
        }),
      }),
    );
  });

  it('updates status and logs the change', async () => {
    prisma.complaint.update.mockResolvedValue({ id: 'c-1' });
    prisma.complaintStatusLog.create.mockResolvedValue({ id: 'log-3' });

    const result = await service.updateStatus('c-1', 'staff-1', {
      newStatus: ComplaintStatus.RESOLVED,
    });

    expect(prisma.complaint.update).toHaveBeenCalledWith({
      where: { id: 'c-1' },
      data: { status: ComplaintStatus.RESOLVED },
    });
    expect(prisma.complaintStatusLog.create).toHaveBeenCalledWith({
      data: { complaintId: 'c-1', changedById: 'staff-1' },
    });
    expect(result).toEqual({ id: 'c-1' });
  });

  it('fetches complaints created by a user', async () => {
    prisma.complaint.findMany.mockResolvedValue([{ id: 'c-1' }]);

    const result = await service.getMyComplaints('user-1');

    expect(prisma.complaint.findMany).toHaveBeenCalledWith({
      where: { createdById: 'user-1' },
      include: {
        statusLogs: true,
        category: true,
        department: true,
        assignedTo: true,
      },
    });
    expect(result).toEqual([{ id: 'c-1' }]);
  });

  it('fetches all complaints with relations', async () => {
    prisma.complaint.findMany.mockResolvedValue([{ id: 'c-2' }]);

    const result = await service.getAllComplaints();

    expect(prisma.complaint.findMany).toHaveBeenCalledWith({
      include: {
        category: true,
        department: true,
        createdBy: true,
        assignedTo: true,
        statusLogs: true,
      },
    });
    expect(result).toEqual([{ id: 'c-2' }]);
  });
});
