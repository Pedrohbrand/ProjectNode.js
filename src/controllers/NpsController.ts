import { Request, Response } from "express"
import { getCustomRepository, Not, IsNull } from "typeorm"
import { Survey } from "../models/Survey";
import { SurveyUser } from "../models/SurveyUser";
import { SurveyUserRepository } from "../repositories/SurveysUsersRepository";

class NpsController {
    async execute(request: Request, response: Response) {
        
        const { survey_id } = request.params;

        const surveysUsersRepository =  getCustomRepository( SurveyUserRepository );

        const surveysUser = await surveysUsersRepository.find({
            survey_id, 
            value: Not(IsNull()),
        })

        const detractor = surveysUser.filter( (survey) => 
        survey.value >= 0 && survey.value <= 6
        ).length;

        const promoters = surveysUser.filter( (survey) => 
        survey.value >= 9 && survey.value <= 10
        ).length;

        const passive = surveysUser.filter( (survey) => 
        survey.value >= 7 && survey.value <= 8
        ).length;

        const totalAnswers = surveysUser.length;

        const calculate = (Number(
            ((promoters - detractor) / totalAnswers) * 100).toFixed(2)
            );

        return response.json({
            detractor,
            promoters,
            passive,
            totalAnswers,
            nps: calculate
        })
    }
}

export {NpsController}