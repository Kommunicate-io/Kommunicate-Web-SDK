let customer = function (sequelize, DataTypes) {
  return sequelize.define("customer", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING(50)
    },
    userName: {
      // user name can be different than email for applozic users. 
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: 'user_name_UNIQUE',
      field: 'user_name'
    },
    email: {
      type: DataTypes.STRING(50),
      unique: 'email_UNIQUE',
    },
    role: {
      type: DataTypes.STRING(50)
    },
    contactNo: {
      type: DataTypes.STRING(20),
      field: 'contact_no'
    },
    industry: {
      type: DataTypes.STRING(20)
    },
    companyName: {
      type: DataTypes.STRING(50),
      field: 'company_name'
    },
    companySize: {
      type: DataTypes.STRING(15),
      field: 'company_size'
    },
    activeCampaignId: {
      type: DataTypes.INTEGER,
      field: 'active_campaign_id'
    },
    subscription: {
      type: DataTypes.STRING(50),
      field: "subscription" //STARTUP, LAUNCH, GROWTH, ENTERPRISE
    },
    billingCustomerId: {
      type: DataTypes.STRING(50),
      field: "billing_cus_id"
    }
  }, {
      underscored: true,
      paranoid: true,
      getterMethods: {
        isPaidCustomer: function () {
          return this.subscription != "startup";
        }
      }
    }
  );
}
module.exports = customer;