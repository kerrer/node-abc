
var Hospital = {
    tableName: 'hospital',
    parent_hospital:function(){
        return this.belongsTo(_Hospital,"parent_id");
    },
    province:function(){
        return this.belongsTo(_YxwRegion,"shengfen");
    },
    city:function(){
        return this.belongsTo(_YxwRegion,"chengshi");
    }
};

var Doctor = {
    tableName: 'hospital_doctor',
    hospital:function(){
        return this.belongsTo(_Hospital,"hospital_id");
    },
    doctor_information:function(){
        return this.belongsTo(_DoctorInformation,"doctor_information_id");
    }
};

var DoctorInformation = {
    tableName:'doctor_information',
};


var HospitalDoctorTitle = {
    tableName:'hospital_doctor_title',
};

var HospitalDoctorDepartment = {
    tableName:'hospital_doctor_department',
};

var HospitalTitle = {
    tableName:'hospital_title',
};

var HospitalDepartment = {
    tableName:'hospital_department',
};

var DoctorCertificate = {
    tableName:'doctor_certificate',
};

var YxwGeneralDepartment = {
    tableName:'yxw_general_department',
};

var YxwRegion = {
    tableName:'yxw_region',
    idAttribute:'region_id',
};

var YxwGeneralDisease = {
    tableName:'yxw_general_disease',
    department1:function(){
        return this.belongsTo(_YxwGeneralDepartment,"bcate_id");
    },
    department2:function(){
        return this.belongsTo(_YxwGeneralDepartment,"scate_id");
    }
};

var YxwGeneralDiseaseExtra = {
    tableName:'yxw_general_disease_extra',
};

var General_Symptom = {
    tableName:'yxw_general_symptom',
};

