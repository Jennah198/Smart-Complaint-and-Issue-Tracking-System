import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ComplaintService } from './complaint.service';
import { CreateComplaintDto } from './dto/create-complaint.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('complaints')
@UseGuards(JwtAuthGuard)
export class ComplaintController {
  constructor(private readonly complaintService: ComplaintService) {}

  // Create complaint (Student)
  @Post()
  async create(@Req() req, @Body() dto: CreateComplaintDto) {
    return this.complaintService.createComplaint(req.user.id, dto);
  }

  // Get my complaints (Student)
  @Get('my')
  async getMy(@Req() req) {
    return this.complaintService.getMyComplaints(req.user.id);
  }

  // Get all complaints (Staff/Admin)
  @Get()
  @UseGuards(RolesGuard)
  @Roles('STAFF', 'ADMIN')
  async getAll() {
    return this.complaintService.getAllComplaints();
  }

  // Update complaint status (Staff/Admin)
  @Patch(':id/status')
  @UseGuards(RolesGuard)
  @Roles('STAFF', 'ADMIN')
  async updateStatus(
    @Param('id') id: string,
    @Req() req,
    @Body() dto: UpdateStatusDto,
  ) {
    return this.complaintService.updateStatus(id, req.user.id, dto);
  }
}
