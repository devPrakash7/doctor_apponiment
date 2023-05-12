

const {doctorModel} = require("../../models/doctor.model");


module.exports = {

    doctorSave : data => new doctorModel(data).save() ,

    getdoctor: async (idOrEmail, fieldName = '_id') => {
        const data = await doctorModel.findOne({[fieldName]: `${idOrEmail}`})
        return data;
      },

      getAlldoctor: async () => {
        const data = await doctorModel.find();
        return data;
      },
      
      
}

