import { Request, Response } from "express"
import { resolve } from 'path';
import { getCustomRepository } from "typeorm";
import { AppError } from "../errors/AppError";
import { SurveysRepository } from "../repositories/SurveysRepository";
import { SurveyUserRepository } from "../repositories/SurveysUsersRepository";
import { UsersRepository } from "../repositories/UsersRepository";
import SendMailService from "../services/SendMailService";


class SendMailController {

    async execute(request: Request, response: Response) {
        const { email, survey_id } = request.body;

        const usersRepository = getCustomRepository(UsersRepository)
        const surveyRepository = getCustomRepository(SurveysRepository)
        const surveyUserRepository = getCustomRepository(SurveyUserRepository)

        const user = await usersRepository.findOne({ email })

        if (!user) {
            throw new AppError("User does not exists!")
        }

        const survey = await surveyRepository.findOne({ id: survey_id })

        if (!survey) {            
            throw new AppError("Survey does not exists!")
        }

        const npsPath = resolve(__dirname, "..", "views", "emails", "npsMail.hbs")

        const surveyUserAlreadyExist = await surveyUserRepository.findOne({
            where: { user_id: user.id, value : null },
            relations: ["user", "survey"],
        })

        const variables = {
            name: user.name,
            title: survey.title,
            description: survey.description,
            id: "",
            link: process.env.URL_MAIL
        }

        if(surveyUserAlreadyExist){
            variables.id = surveyUserAlreadyExist.id
            await SendMailService.execute(email, survey.title, variables, npsPath );
            return response.json(surveyUserAlreadyExist);
        }

//salvar
        const surveyUser = surveyUserRepository.create({
            user_id: user.id,
            survey_id

        })
        
        await surveyUserRepository.save( surveyUser );
//enviar
        variables.id = surveyUser.id
        await SendMailService.execute(email, survey.title, variables, npsPath);

        return response.json( surveyUser )
    }
}

export { SendMailController }