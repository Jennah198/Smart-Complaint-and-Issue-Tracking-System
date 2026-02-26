import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Get,
  Param,
  Patch,
} from '@nestjs/common';
import { ComplaintService } from './complaint.service';
import { CreateComplaintDto } from './dto/create-complaint.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('complaints')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ComplaintController {
  constructor(private readonly complaintService: ComplaintService) {}

  @Post()
  @Roles('STUDENT')
  createComplaint(@Req() req, @Body() dto: CreateComplaintDto) {
    return this.complaintService.createComplaint(req.user.id, dto);
  }

  @Patch(':id/status')
  @Roles('STAFF', 'ADMIN')
  updateStatus(
    @Req() req,
    @Param('id') id: string,
    @Body() dto: UpdateStatusDto,
  ) {
    return this.complaintService.updateStatus(id, req.user.id, dto);
  }

  @Get('my')
  @Roles('STUDENT')
  getMyComplaints(@Req() req) {
    return this.complaintService.getMyComplaints(req.user.id);
  }
}
