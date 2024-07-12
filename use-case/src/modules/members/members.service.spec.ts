import { DataSource, Repository } from "typeorm";
import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";

import { Member } from "@database/entities/member.entity";

import { MembersService } from "./members.service";

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

const createMockRepository = <T = any>(): MockRepository<T> => ({
  find: jest.fn(),
  findOne: jest.fn(),
  save: jest.fn(),
});

describe("MembersService", () => {
  let service: MembersService;
  let memberRepository: MockRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MembersService,
        DataSource,
        { provide: getRepositoryToken(Member), useValue: createMockRepository() },
      ],
    }).compile();

    service = module.get<MembersService>(MembersService);
    memberRepository = module.get<MockRepository<Member>>(getRepositoryToken(Member));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("create", () => {
    describe("given a valid member data", () => {
      it("should create a new member", async () => {
        const newMember = new Member();

        newMember.code = "M102";
        newMember.name = "ghalib";

        memberRepository.save.mockResolvedValue(newMember);

        const member = await service.create(newMember);

        expect(member.name).toEqual(newMember.name);
        expect(member.code).toEqual(newMember.code);
      });
    });
  });
});
