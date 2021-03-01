import { EntityRepository, Repository } from "typeorm";
import { Survey } from "../models/Survey";
import { SurveyUser } from "../models/SurveyUser";

@EntityRepository(SurveyUser)
class SurveyUserRepository extends Repository<SurveyUser> {
    static create(arg0: {}) {
        throw new Error("Method not implemented.");
    }
}

export { SurveyUserRepository };