import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { MembersService } from "./members.service";
import { Member } from "@database/entities/member.entity";
import { CreateMemberBodyDto } from "./dto/create-member.dto";
import { BorrowedBook } from "@database/entities/borrowed-book.entity";
import { Repository } from "typeorm";

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

const createMockRepository = <T = any>(): MockRepository<T> => ({
  find: jest.fn(),
  findOne: jest.fn(),
  save: jest.fn(),
});

const mockMembers = {
  id: 1,
  code: "M101",
  name: "ghalib",
};

describe("MembersService", () => {
  let service: MembersService;
  let memberRepository: MockRepository;
  let borrowedBookRepository: MockRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MembersService,
        { provide: getRepositoryToken(Member), useValue: createMockRepository() },
        { provide: getRepositoryToken(BorrowedBook), useValue: createMockRepository() },
      ],
    }).compile();

    service = module.get<MembersService>(MembersService);
    memberRepository = module.get<MockRepository<Member>>(getRepositoryToken(Member));
    borrowedBookRepository = module.get<MockRepository<Member>>(getRepositoryToken(BorrowedBook));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("findAll", () => {
    it("should return an array of members with borrowed books count", async () => {
      const members = await service.findAll({});

      expect(members).toHaveLength(1);
      expect(members[0].borrowedBooksCount).toBe(0);
    });
  });

  describe("create", () => {
    describe("given a valid member data", async () => {
      it("should create a new member", async () => {
        const createMemberBodyDto: CreateMemberBodyDto = {
          name: "New Member",
          code: "MEM002",
        };

        const createdMember = await service.create(createMemberBodyDto);

        expect(createdMember).toHaveProperty("id");
        expect(createdMember.name).toBe(createMemberBodyDto.name);
      });
    });
  });
});
