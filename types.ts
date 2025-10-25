export interface Stock {
  ticker: string;
  companyName: string;
  reasoning: string;
  marketCap: string;
  peRatio: number;
  dividendYield: number;
  roe: number;
  revenueGrowth: string;
  country: string;
  wkn: string;
}

export type FisherScore = 'Ja' | 'Nein' | 'Teilweise';

export interface FisherPointAnalysis {
  point: number;
  question: string;
  analysis: string;
  score: FisherScore;
}

export type FisherAnalysisResult =
  | {
      companyExists: true;
      companyName: string;
      ticker: string;
      country: string;
      overallAssessment: string;
      points: FisherPointAnalysis[];
    }
  | {
      companyExists: false;
    };


export interface TournamentParticipant {
  ticker: string;
  companyName: string;
  country: string;
  peRatio: number;
  currentPrice: string;
}

export interface TournamentWinner extends TournamentParticipant {
  justification: string;
}

export type TournamentResult =
  | {
      companyExists: true;
      winner: TournamentWinner;
      participants: TournamentParticipant[];
    }
  | {
      companyExists: false;
    };