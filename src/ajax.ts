import { EditAnswerData, EditGradeData, GetQuestionsData, QuestionWire, SendLoginEmailRequestData, SubmitGradesData, SubmitGuessData } from '@scottglz/trivia2025-shared';
import { userFull } from '@scottglz/trivia2025-shared';
import axios, { AxiosInstance } from 'axios';
export const ajax = axios.create();

let authenticationFailureHandler: (() => void) | null  = null;

// Listen for 401 Unathorized or 403 Forbidden AJAX responses
ajax.interceptors.response.use(
   function (response) {
      // Make data the promise payload
      return response.data;
   }, 
   function (error) {
      // Listen for 401 Unathorized or 403 Forbidden AJAX responses
      const status = error?.response?.status;
      if (status === 401 || status === 403) {
         if (authenticationFailureHandler) {
            authenticationFailureHandler();
         }
      }
      return Promise.reject(error);
   }
);

export function setAuthenticationFailureHandler(handler: () => void) {
   authenticationFailureHandler = handler;
}


export class DAO {
   readonly ajax: AxiosInstance;
   constructor(ajax: AxiosInstance) {
      this.ajax = ajax;
   }

   logout(): Promise<void> {
      return this.ajax.post('/api/logout');
   }

   submitEndVacation(): Promise<void> {
      return this.ajax.post('/api/endvacation');
   }

   getWhoAmI(): Promise<userFull|false> {
      return this.ajax.get('/api/whoami');
   }

   getUsers(): Promise<userFull[]> {
      return this.ajax.get('/api/users');
   }

   getQuestions(vars: GetQuestionsData): Promise<QuestionWire[]> {
      return this.ajax.post('/api/questions', vars);
   }  

   submitGuess(data: SubmitGuessData): Promise<QuestionWire> {
      return this.ajax.put('/api/guess', data);
   }

   submitGrades(vars: SubmitGradesData): Promise<QuestionWire> {
      return this.ajax.put('/api/grade', vars);
   }

   editAnswer(data: EditAnswerData): Promise<QuestionWire> {
      return this.ajax.put('/api/editanswer', data);
   }

   editGrade(data: EditGradeData): Promise<QuestionWire> {
      return this.ajax.put('/api/editgrade', data);
   }

   submitComment(day: string, comment: string): Promise<void> {
      return this.ajax.post('/api/comments/add', { day, comment });
   }

   sendLoginEmailRequest(vars: SendLoginEmailRequestData): Promise<void> {
      return this.ajax.post('/api/requestemailsignin', vars);
   }
}

export const dao = new DAO(ajax);