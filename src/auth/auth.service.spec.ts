import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { UserRole } from '../users/roles.enum';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

describe('AuthService', () => {
  let service: AuthService;
  let prisma: { user: { create: jest.Mock; findUnique: jest.Mock } };
  let jwt: { sign: jest.Mock };

  beforeEach(async () => {
    prisma = {
      user: {
        create: jest.fn(),
        findUnique: jest.fn(),
      },
    };
    jwt = {
      sign: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: prisma },
        { provide: JwtService, useValue: jwt },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jest.clearAllMocks();
  });

  it('registers a user with a hashed password and returns a token', async () => {
    (bcrypt.hash as jest.Mock).mockResolvedValue('hashed');
    prisma.user.create.mockResolvedValue({
      id: 'user-1',
      email: 'user@example.com',
      role: UserRole.STUDENT,
      name: 'User',
      password: 'hashed',
    });
    jwt.sign.mockReturnValue('token-1');

    const result = await service.register({
      name: 'User',
      email: 'user@example.com',
      password: 'password',
    });

    expect(bcrypt.hash).toHaveBeenCalledWith('password', 10);
    expect(prisma.user.create).toHaveBeenCalledWith({
      data: {
        name: 'User',
        email: 'user@example.com',
        password: 'hashed',
        role: UserRole.STUDENT,
      },
    });
    expect(jwt.sign).toHaveBeenCalledWith({
      sub: 'user-1',
      role: UserRole.STUDENT,
      email: 'user@example.com',
    });
    expect(result).toEqual({
      user: expect.objectContaining({ id: 'user-1' }),
      token: 'token-1',
    });
  });

  it('fails login when user is missing', async () => {
    prisma.user.findUnique.mockResolvedValue(null);

    await expect(
      service.login({ email: 'missing@example.com', password: 'pass' }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('fails login when password is invalid', async () => {
    prisma.user.findUnique.mockResolvedValue({
      id: 'user-1',
      email: 'user@example.com',
      role: UserRole.STUDENT,
      password: 'hashed',
    });
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    await expect(
      service.login({ email: 'user@example.com', password: 'bad' }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('returns token on valid login', async () => {
    prisma.user.findUnique.mockResolvedValue({
      id: 'user-1',
      email: 'user@example.com',
      role: UserRole.STUDENT,
      password: 'hashed',
    });
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    jwt.sign.mockReturnValue('token-2');

    const result = await service.login({
      email: 'user@example.com',
      password: 'password',
    });

    expect(bcrypt.compare).toHaveBeenCalledWith('password', 'hashed');
    expect(jwt.sign).toHaveBeenCalledWith({
      sub: 'user-1',
      role: UserRole.STUDENT,
      email: 'user@example.com',
    });
    expect(result).toEqual({
      user: expect.objectContaining({ id: 'user-1' }),
      token: 'token-2',
    });
  });
});
