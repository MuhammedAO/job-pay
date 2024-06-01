import { Sequelize, Model, DataTypes, Association } from 'sequelize';


const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite3'
});

class Profile extends Model {
  public id!: number;
  public firstName!: string;
  public lastName!: string;
  public profession!: string;
  public balance!: number;
  public type!: 'client' | 'contractor';
}

Profile.init({
  firstName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  profession: {
    type: DataTypes.STRING,
    allowNull: false
  },
  balance: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
    validate: {
      isDecimal: true,
      min: 0
    }
  },
  type: {
    type: DataTypes.ENUM('client', 'contractor'),
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'Profile',
  indexes: [
    {
      name: 'idx_profile_type',
      fields: ['type']
    }
  ]
});


class Contract extends Model {
  public id!: number;
  public terms!: string;
  public status!: 'new' | 'in_progress' | 'terminated';
  public ClientId!: number;
  public ContractorId!: number;
}

Contract.init({
  terms: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('new', 'in_progress', 'terminated')
  },
  ClientId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Profiles',
      key: 'id'
    }
  },
  ContractorId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Profiles',
      key: 'id'
    }
  }
}, {
  sequelize,
  modelName: 'Contract',
  indexes: [
    {
      name: 'idx_contract_status',
      fields: ['status']
    },
    {
      name: 'idx_contract_client_id',
      fields: ['ClientId']
    },
    {
      name: 'idx_contract_contractor_id',
      fields: ['ContractorId']
    }
  ]
});


class Job extends Model {
  public id!: number;
  public description!: string;
  public price!: number;
  public paid!: boolean;
  public paymentDate?: Date;
  public ContractId!: number;

   // Declare navigation properties.
   public readonly Contract?: Contract;

   public static associations: {
     Contract: Association<Job, Contract>;
   };
}

Job.init({
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  price: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false
  },
  paid: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  paymentDate: {
    type: DataTypes.DATE,
    validate: {
      isDate: true
    }
  },
  ContractId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Contracts',
      key: 'id'
    }
  }
}, {
  sequelize,
  modelName: 'Job',
  indexes: [
    {
      name: 'idx_payment_date',
      fields: ['paymentDate']
    },
    {
      name: 'idx_paid',
      fields: ['paid']
    }
  ]
});


Profile.hasMany(Contract, { as: 'Contractor', foreignKey: 'ContractorId' });
Contract.belongsTo(Profile, { as: 'Contractor' });

Profile.hasMany(Contract, { as: 'Client', foreignKey: 'ClientId' });
Contract.belongsTo(Profile, { as: 'Client' });

Contract.hasMany(Job);
Job.belongsTo(Contract);


export { sequelize, Profile, Contract, Job };
