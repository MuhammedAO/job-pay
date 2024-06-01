import { Contract, Job, Profile, sequelize } from "../src/model";


/* WARNING THIS WILL DROP THE CURRENT DATABASE */
seed();



/**
 * Seeds the database with initial data for Profiles, Contracts, and Jobs.
 * This function performs the following steps:
 * 1. Synchronizes the database schema for Profiles, Contracts, and Jobs by recreating the tables.
 * 2. Inserts predefined data into the Profiles table.
 * 3. Inserts predefined data into the Contracts table, ensuring that each contract references an existing profile for both client and contractor.
 * 4. Inserts predefined data into the Jobs table, linking each job to an existing contract.
 * 
 * This function ensures that all insertions respect the foreign key constraints by sequentially awaiting the resolution of
 * promise batches—first Profiles, then Contracts, and finally Jobs. Each batch must complete successfully before the next begins.
 * 
 * @async
 * @function seed
 * @returns {Promise<void>} A promise that resolves when all tables are successfully seeded or rejects with an error if any step fails.
 * @throws {Error} Throws an error if any of the database operations fail, with details about the operation that failed.
 */
async function seed(): Promise<void> {
  try {
    await Profile.sync({ force: true });
    await Contract.sync({ force: true });
    await Job.sync({ force: true });

    // Insert Profiles first..
    const profiles = await Promise.all([
      Profile.create({
        id: 1,
        firstName: 'Harry',
        lastName: 'Potter',
        profession: 'Wizard',
        balance: 1150,
        type:'client'
      }),
      Profile.create({
        id: 2,
        firstName: 'Mr',
        lastName: 'Robot',
        profession: 'Hacker',
        balance: 231.11,
        type:'client'
      }),
      Profile.create({
        id: 3,
        firstName: 'John',
        lastName: 'Snow',
        profession: 'Knows nothing',
        balance: 451.3,
        type:'client'
      }),
      Profile.create({
        id: 4,
        firstName: 'Ash',
        lastName: 'Kethcum',
        profession: 'Pokemon master',
        balance: 1.3,
        type:'client'
      }),
      Profile.create({
        id: 5,
        firstName: 'John',
        lastName: 'Lenon',
        profession: 'Musician',
        balance: 64,
        type:'contractor'
      }),
      Profile.create({
        id: 6,
        firstName: 'Linus',
        lastName: 'Torvalds',
        profession: 'Programmer',
        balance: 1214,
        type:'contractor'
      }),
      Profile.create({
        id: 7,
        firstName: 'Alan',
        lastName: 'Turing',
        profession: 'Programmer',
        balance: 22,
        type:'contractor'
      }),
      Profile.create({
        id: 8,
        firstName: 'Aragorn',
        lastName: 'II Elessar Telcontarvalds',
        profession: 'Fighter',
        balance: 314,
        type:'contractor'
      })
      // Additional profiles...
    ]);

    // Insert Contracts after Profiles
    const contracts = await Promise.all([
      Contract.create({
        id:1,
        terms: 'bla bla bla',
       status: 'in_progress',
        ClientId: 1,
        ContractorId:5,
        paid: false
      }),
      Contract.create({
        id:2,
        terms: 'bla bla bla',
        status: 'in_progress',
        ClientId: 1,
        ContractorId: 6
      }),
      Contract.create({
        id:3,
        terms: 'bla bla bla',
        status: 'in_progress',
        ClientId: 2,
        ContractorId: 6
      }),
      Contract.create({
        id: 4,
        terms: 'bla bla bla',
        status: 'in_progress',
        ClientId: 2,
        ContractorId: 7
      }),
      Contract.create({
        id:5,
        terms: 'bla bla bla',
        status: 'new',
        ClientId: 3,
        ContractorId: 8
      }),
      Contract.create({
        id:6,
        terms: 'bla bla bla',
        status: 'in_progress',
        ClientId: 3,
        ContractorId: 7
      }),
      Contract.create({
        id:7,
        terms: 'bla bla bla',
        status: 'in_progress',
        ClientId: 4,
        ContractorId: 7
      }),
      Contract.create({
        id:8,
        terms: 'bla bla bla',
        status: 'in_progress',
        ClientId: 4,
        ContractorId: 6
      }),
      Contract.create({
        id:9,
        terms: 'bla bla bla',
        status: 'in_progress',
        ClientId: 4,
        ContractorId: 8
      })
    ]);

    // Insert Jobs after Contracts
    const jobs = await Promise.all([
      Job.create({
        id: 1,
        description: 'work',
        price: 200,
        ContractId: 1,
        paid:false,
      }),
      Job.create({
        id: 2,
        description: 'work',
        price: 201,
        ContractId: 2,
      }),
      Job.create({
        id: 3,
        description: 'work',
        price: 202,
        ContractId: 3,
      }),
      Job.create({
        id: 4,
        description: 'work',
        price: 200,
        ContractId: 4,
      }),
      Job.create({
        id: 5,
        description: 'work',
        price: 200,
        ContractId: 7,
      }),
      Job.create({
        id: 6,
        description: 'work',
        price: 2020,
        paid:true,
        paymentDate:'2020-08-15T19:11:26.737Z',
        ContractId: 7,
      }),
      Job.create({
        id: 7,
        description: 'work',
        price: 200,
        paid:true,
        paymentDate:'2020-08-15T19:11:26.737Z',
        ContractId: 2,
      }),
      Job.create({
        id: 8,
        description: 'work',
        price: 200,
        paid:true,
        paymentDate:'2020-08-16T19:11:26.737Z',
        ContractId: 3,
      }),
      Job.create({
        id: 9,
        description: 'work',
        price: 200,
        paid:true,
        paymentDate:'2020-08-17T19:11:26.737Z',
        ContractId: 1,
      }),
      Job.create({
        id: 10,
        description: 'work',
        price: 200,
        paid:true,
        paymentDate:'2020-08-17T19:11:26.737Z',
        ContractId: 5,
      }),
      Job.create({
        id: 11,
        description: 'work',
        price: 21,
        paid:true,
        paymentDate:'2020-08-10T19:11:26.737Z',
        ContractId: 1,
      }),
      Job.create({
        id: 12,
        description: 'work',
        price: 21,
        paid:true,
        paymentDate:'2020-08-15T19:11:26.737Z',
        ContractId: 2,
      }),
      Job.create({
        id: 13,
        description: 'work',
        price: 121,
        paid:true,
        paymentDate:'2020-08-15T19:11:26.737Z',
        ContractId: 3,
      }),
      Job.create({
        id: 14,
        description: 'work',
        price: 121,
        paid:true,
        paymentDate:'2020-08-14T23:11:26.737Z',
        ContractId: 3,
      }),
    ]);

    console.log("Database seeded successfully");
  } catch (error) {
    console.error("Failed to seed database:", error);
  }
}


