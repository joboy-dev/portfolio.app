import authReducer from "./auth/auth";
import generalReducer from "./general/general";
import profileReducer from "./profile/profile";
import fileReducer from "./file/file";
import serviceReducer from "./service/service";
import skillReducer from "./skill/skill";
import certificationReducer from "./certification/certification";
import awardReducer from "./award/award";
import educationReducer from "./education/education";
import experienceReducer from "./experience/experience";
import projectReducer from "./project/project";
import tagReducer from "./tag/tag";
import categoryReducer from "./category/category";
import testimonialReducer from "./testimonial/testimonial";
import messageReducer from "./message/message";

export const rootReducer = {
    general: generalReducer,
    auth: authReducer,
    profile: profileReducer,
    file: fileReducer,
    service: serviceReducer,
    skill: skillReducer,
    certification: certificationReducer,
    award: awardReducer,
    education: educationReducer,
    experience: experienceReducer,
    project: projectReducer,
    tag: tagReducer,
    category: categoryReducer,
    testimonial: testimonialReducer,
    message: messageReducer,
}