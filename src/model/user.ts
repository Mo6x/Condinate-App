import mongoose from 'mongoose';





// export interface UserType extends mongoose.Document{
//     id:string,
//     AuthorName: string,
//     email:string,
//     password:string,
//     PhoneNumber: Number
// }


const userSchema = new mongoose.Schema({
  AuthorName:{type: String, required:true},
  email: {type: String, required:true, unique:true},
  password:{type:String, required:true},
  PhoneNumber: {type: String, required : true}
},{
    timestamps:true
});

// export const User = mongoose.model<UserType>('User', userSchema)
const User = mongoose.model('User', userSchema)
module.exports = User

















// interface AuthorAttributes {
//   id: string;
//   AuthorName: string;
//   email: string;
//   password: string;
//   PhoneNumber: string;
// }

// export class AuthorInstance extends Model<AuthorAttributes> {}

// AuthorInstance.init(
//   {
//     id: {
//       type: DataTypes.UUIDV4,
//       primaryKey: true,
//       allowNull: false,
//     },
//     AuthorName: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//     email: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },

//     password: {
//       type: DataTypes.STRING,
//       allowNull: false,
//       defaultValue: false,
//     },
//     PhoneNumber: {
//       type: DataTypes.STRING,
//       allowNull: false,
//       defaultValue: false,
//     },
//   },
//   {
//     sequelize: db,
//     tableName: "Authors",
//   }
// );

// AuthorInstance.hasMany(BookInstance, { foreignKey: "authorsID", as: "Books" });

// BookInstance.belongsTo(AuthorInstance, {
//   foreignKey: "authorsID",
//   as: "Authors",
// });
