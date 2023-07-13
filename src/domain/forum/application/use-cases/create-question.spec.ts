import { CreateQuestionUseCase } from './create-question'
import { Question } from '../../enterprise/entities/question'
import { QuestionsRepository } from '../repositories/question-repository'

const fakeQuestionsRepository: QuestionsRepository = {
  create: async (question: Question): Promise<void> => {
    console.log(question)
  },
}

test('create a question', async () => {
  const answerQuestion = new CreateQuestionUseCase(fakeQuestionsRepository)

  const { question } = await answerQuestion.execute({
    title: 'Nova pergunta',
    content: 'Nova resposta',
    authorId: '1',
  })

  expect(question.title).toEqual('Nova pergunta')
  expect(question.id).toBeTruthy()
})
