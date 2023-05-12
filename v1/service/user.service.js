
const userModel = require("../../models/user");


module.exports = {

    userSave : data => new userModel(data).save() ,

    getUser: async (idOrEmail, fieldName = '_id') => {
        const data = await userModel.findOne({[fieldName]: `${idOrEmail}`})
        return data;
      },

      getAllUser: async () => {
        const data = await userModel.find();
        return data;
      },
      
      updateUser: async (conditionData, updateData) => {
        try {
          const {
            nModified
          } = await userModel.updateOne(
            conditionData, {
            $set: updateData
          }, {
            runValidators: true
          }
          );
    
          return nModified;
          
        } catch (err) {
          throw err
        }
      },
}

