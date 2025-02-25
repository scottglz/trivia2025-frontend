import { GuessWire, QuestionWire } from '@scottglz/trivia2025-shared';

export interface guessesMap {
   [guessId: string]: GuessWire
}

export interface questionPlus extends Omit<QuestionWire, 'guesses'> {
   allGraded: boolean,
   guessesMap: guessesMap
}
