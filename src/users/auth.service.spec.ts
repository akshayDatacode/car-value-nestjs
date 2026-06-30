import { Test } from '@nestjs/testing'
import { AuthService } from './auth.service'
import { UsersService } from './users.service'
import { User } from './user.entity'
import { BadRequestException, NotFoundException } from '@nestjs/common'

describe('AuthService', () => { // --- Describe and Organise test
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>

  // BeforeEach workes on everytime when we create any test case of this file
  beforeEach(async () => {
    // Create a fake copy of the users service

    const users: User[] = []
    fakeUsersService = {
      find: (email: string) => {
        const filteredusers = users.filter(user => user.email === email)
        return Promise.resolve(filteredusers)
      },
      create: (email: string, password: string) => {
        const user = { id: Math.floor(Math.random() * 99999), email, password } as User
        users.push(user)

        return Promise.resolve(user)
      }
    }


    // ----Old Initial Version----- in practice and learning 
    // fakeUsersService = {
    //   find: () => Promise.resolve([]),
    //   create: (email: string, password: string) => Promise.resolve({ id: 1, email, password } as User)
    // }

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUsersService
        }
      ]
    }).compile()

    service = module.get(AuthService)
  })

  it('can create an instance of auth service', async () => {
    expect(service).toBeDefined()
  })

  it('creates a new user with a salted and hashed password', async () => {
    const user = await service.signup('akshaycse25@test.com', 'asdfg')
    expect(user.password).not.toEqual('asf')
    const [salt, hash] = user.password.split(".")
    expect(salt).toBeDefined()
    expect(hash).toBeDefined()
  })

  it('throws an error if user sign up with email that is in use', async () => {
    fakeUsersService.find = () => Promise.resolve([{ id: 1, email: "akshay@gmail.com", password: "1" } as User])

    await expect(service.signup('askahycse9@gmail.com', 'asd')).rejects.toThrow(BadRequestException)

  })

  it('throws if signin/ login is called with an unused email', async () => {
    await expect(service.signin('askahycse9@gmail.com', 'asd')).rejects.toThrow(NotFoundException)
  })

  it('throws if an invalid password is provided', async () => {
    fakeUsersService.find = () => Promise.resolve([{ email: "akshay@remail.com", password: "asdsd" } as User])

    await expect(service.signin('akshay@remail.com', 'dfdjhdjhddhsad-password')).rejects.toThrow(BadRequestException)
  })

  it('return a user if correct password is provied', async () => {
    // fakeUsersService.find = () => Promise.resolve([
    //   { email: "akshay@gmail.com", password: "769a5db5fb468cef.a88f317948960857aa78fa8560f509d448c855da884c5f79b873cf730f7cda01" } as User
    // ])

    await service.signup('akshay@gmail.com', 'passwordSame')

    const user = await service.signin('akshay@gmail.com', 'passwordSame')
    expect(user).toBeDefined()
  })
})
