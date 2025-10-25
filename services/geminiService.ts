import { GoogleGenAI, Type } from "@google/genai";
import { Stock, FisherAnalysisResult, TournamentResult } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const stockSchema = {
  type: Type.OBJECT,
  properties: {
    ticker: {
      type: Type.STRING,
      description: 'Das Börsenkürzel der Aktie, z.B. AAPL.',
    },
    companyName: {
      type: Type.STRING,
      description: 'Der vollständige Name des Unternehmens.',
    },
    reasoning: {
      type: Type.STRING,
      description: 'Eine detaillierte Erklärung in deutscher Sprache, warum diese Aktie basierend auf den Benutzerkriterien eine Top-Wahl ist.',
    },
    marketCap: {
      type: Type.STRING,
      description: 'Die Marktkapitalisierung des Unternehmens, z.B. "2,5 Billionen USD".',
    },
    peRatio: {
      type: Type.NUMBER,
      description: 'Das Kurs-Gewinn-Verhältnis (KGV) der Aktie.',
    },
    dividendYield: {
      type: Type.NUMBER,
      description: 'Die Dividendenrendite in Prozent, z.B. 1.5 für 1.5%.',
    },
    roe: {
      type: Type.NUMBER,
      description: 'Die Eigenkapitalrendite (ROE) in Prozent, z.B. 25.5 für 25.5%.',
    },
    revenueGrowth: {
        type: Type.STRING,
        description: 'Das Umsatzwachstum im Vergleich zum Vorjahr, z.B. "15,2%".'
    },
    country: {
      type: Type.STRING,
      description: 'Das Land, in dem das Unternehmen seinen Hauptsitz hat, z.B. "USA".'
    },
    wkn: {
      type: Type.STRING,
      description: 'Die deutsche Wertpapierkennnummer (WKN) der Aktie, falls verfügbar.'
    }
  },
  required: ['ticker', 'companyName', 'reasoning', 'marketCap', 'peRatio', 'dividendYield', 'roe', 'revenueGrowth', 'country', 'wkn'],
};

export const getTopStocks = async (criteria: string, country: string, industry: string): Promise<Stock[]> => {
  try {
    let prompt = `Handle als Experte für Finanzaktienanalyse. `;
    
    const filterParts: string[] = [];
    if (country !== 'Weltweit') {
      filterParts.push(`aus dem Land '${country}'`);
    }
    if (industry !== 'Alle Branchen') {
      filterParts.push(`in der Branche '${industry}'`);
    }

    if (filterParts.length > 0) {
      prompt += `Finde zuerst börsennotierte Aktien ${filterParts.join(' und ')}. Aus dieser gefilterten Liste, `;
    } else {
      prompt += `Finde und analysiere relevante börsennotierte Aktien. `;
    }

    prompt += `analysiere und bewerte sie dann anhand der folgenden Kriterien: "${criteria}". Liefere eine detaillierte Begründung für deine Auswahl in deutscher Sprache und gib wichtige Finanzkennzahlen wie KGV (P/E Ratio), Dividendenrendite (Dividend Yield), ROE (Return on Equity) und Umsatzwachstum (Revenue Growth) an. Gib für jede Aktie auch das Land, in dem das Unternehmen seinen Hauptsitz hat, sowie die deutsche Wertpapierkennnummer (WKN) an. Gib die Top-5-Aktien zurück, die am besten zu den Kriterien passen.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: stockSchema,
        },
        temperature: 0.5,
      },
    });

    const jsonString = response.text.trim();
    const result = JSON.parse(jsonString);
    
    if (!Array.isArray(result)) {
        console.error("Gemini API did not return an array:", result);
        throw new Error("Invalid data format received from the API.");
    }

    return result as Stock[];

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to fetch stock analysis from Gemini API.");
  }
};


const fisherQuestions = [
    "1. Marktpotenzial: Hat das Unternehmen beträchtliches Potenzial für langfristiges Wachstum?",
    "2. Management der Forschung und Entwicklung: Verfügt das Unternehmen über ein starkes F&E-Management, um neue Produkte oder Prozesse zu entwickeln?",
    "3. Effektivität der Vertriebsorganisation: Wie gut ist die Vertriebsabteilung organisiert und effektiv?",
    "4. Gewinnmargen: Sind die Gewinnmargen des Unternehmens hoch, und ist es in der Lage, diese zu halten oder zu verbessern?",
    "5. Arbeitsklima und Mitarbeiterkultur: Gibt es ein exzellentes Verhältnis zwischen Management und Mitarbeitern?",
    "6. Mitarbeiterqualifikation: Verfügt das Unternehmen über herausragende Führungskräfte und technische Mitarbeiter?",
    "7. Kostenbewusstsein: Wie gut achtet das Management auf die Kosteneffizienz?",
    "8. Ertragstreiber: Verfügt das Unternehmen über einzigartige Produkte oder Dienstleistungen, die das Gewinnwachstum unterstützen?",
    "9. Zukunftsorientierte Planung: Plant das Unternehmen kontinuierlich für zukünftige Entwicklungen?",
    "10. Langfristige Gewinne: Vermeidet das Unternehmen übermäßige Fokusierung auf kurzfristige Gewinne zulasten langfristiger Ziele?",
    "11. Wachstumsstrategie: Hat das Unternehmen eine gute Strategie, um durch Wachstum neue Marktanteile zu gewinnen?",
    "12. Forschung und Entwicklung als Schlüssel: Ist das Unternehmen führend in Forschung und Innovation?",
    "13. Finanzielle Stärke: Ist das Unternehmen finanziell stark und unabhängig?",
    "14. Managementqualität und Integrität: Wird das Unternehmen von kompetenten und ehrlichen Führungskräften geführt?",
    "15. Anspruchsvolle Rechnungslegung: Schreibt das Unternehmen Transparenz und Klarheit in der Rechnungslegung groß?"
];


const fisherPointSchema = {
    type: Type.OBJECT,
    properties: {
        point: { type: Type.NUMBER, description: "Die Nummer des Prüfpunkts (1-15)." },
        question: { type: Type.STRING, description: "Die exakte Frage des Prüfpunkts." },
        score: {
            type: Type.STRING,
            description: "Die Bewertung: 'Ja', 'Nein' oder 'Teilweise'.",
            enum: ['Ja', 'Nein', 'Teilweise'],
        },
        analysis: { type: Type.STRING, description: "Die detaillierte Begründung für die Bewertung des Punkts in deutscher Sprache." },
    },
    required: ['point', 'question', 'score', 'analysis'],
};

const fisherAnalysisSchema = {
    type: Type.OBJECT,
    properties: {
        companyExists: { type: Type.BOOLEAN, description: "Gibt an, ob ein reales, börsennotiertes Unternehmen für den Ticker gefunden wurde." },
        companyName: { type: Type.STRING, description: "Der Name des analysierten Unternehmens. Nur ausfüllen, wenn companyExists true ist." },
        ticker: { type: Type.STRING, description: "Das Tickersymbol des analysierten Unternehmens. Nur ausfüllen, wenn companyExists true ist." },
        country: { type: Type.STRING, description: "Das Land, in dem das Unternehmen seinen Hauptsitz hat. Nur ausfüllen, wenn companyExists true ist." },
        overallAssessment: { type: Type.STRING, description: "Eine zusammenfassende Gesamteinschätzung des Unternehmens nach Fishers Kriterien. Nur ausfüllen, wenn companyExists true ist." },
        points: {
            type: Type.ARRAY,
            description: `Ein Array mit exakt 15 Analyse-Objekten. Nur ausfüllen, wenn companyExists true ist.`,
            items: fisherPointSchema
        }
    },
    required: ['companyExists']
};


export const getFisherAnalysis = async (ticker: string, context?: { companyName: string, country: string }): Promise<FisherAnalysisResult> => {
    try {
        let contextHint = '';
        if (context && context.companyName && context.country) {
            contextHint = ` Das angefragte Unternehmen ist '${context.companyName}' aus dem Land '${context.country}'. Nutze diese Information, um bei der Identifizierung des Unternehmens über das Tickersymbol '${ticker}' Mehrdeutigkeiten zu vermeiden.`
        }

        const prompt = `Handle als Experte für die Anlagestrategie von Philip A. Fisher.
Deine Aufgabe ist es, eine Analyse für das Unternehmen mit dem Tickersymbol '${ticker}' zu erstellen.${contextHint}

Schritt 1: Überprüfung
Überprüfe sorgfältig, ob '${ticker}' ein gültiges Tickersymbol für ein echtes, börsennotiertes Unternehmen ist. ${contextHint ? `Beachte dabei den Kontext:${contextHint}` : ''}

Schritt 2: Antwort generieren
- **FALLS UNGÜLTIG:** Wenn kein reales Unternehmen für den Ticker existiert, gib ein JSON-Objekt zurück, bei dem NUR das Feld 'companyExists' auf 'false' gesetzt ist. Erfinde KEINE Daten.
- **FALLS GÜLTIG:** Wenn das Unternehmen existiert, setze 'companyExists' auf 'true' und fahre mit der Analyse fort. Führe eine detaillierte 15-Punkte-Analyse nach Philip A. Fisher durch. Gib für jeden der 15 Punkte eine klare Bewertung ('Ja', 'Nein' oder 'Teilweise') und eine fundierte Begründung auf Deutsch. Gib eine zusammenfassende Gesamteinschätzung. Fülle alle Felder des JSON-Schemas aus, die für eine gültige Analyse benötigt werden (companyName, ticker, country, overallAssessment, points).

Die 15 Fragen lauten: ${fisherQuestions.join(' ')}`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: fisherAnalysisSchema,
                temperature: 0.3,
            },
        });

        const jsonString = response.text.trim();
        const result = JSON.parse(jsonString) as FisherAnalysisResult;

        if (!result || typeof result.companyExists !== 'boolean') {
            console.error("Gemini API did not return a valid Fisher analysis object:", result);
            throw new Error("Ungültiges Datenformat von der API empfangen.");
        }

        if (result.companyExists === true) {
            if (!result.companyName || !result.country || !Array.isArray(result.points) || result.points.length !== 15) {
                console.error("Gemini API returned incomplete data for existing company:", result);
                throw new Error("Unvollständige Daten von der API für ein existierendes Unternehmen empfangen. Bitte versuchen Sie es erneut.");
            }
        }

        return result;

    } catch (error) {
        console.error("Error calling Gemini API for Fisher analysis:", error);
         if (error instanceof Error) {
            throw error;
        }
        throw new Error("Fehler bei der Abfrage der Fisher-Analyse von der Gemini API.");
    }
};

const tournamentParticipantSchema = {
    type: Type.OBJECT,
    properties: {
        ticker: { type: Type.STRING, description: 'Das Börsenkürzel der Aktie.' },
        companyName: { type: Type.STRING, description: 'Der vollständige Name des Unternehmens.' },
        country: { type: Type.STRING, description: 'Das Land, in dem das Unternehmen seinen Hauptsitz hat.' },
        peRatio: { type: Type.NUMBER, description: 'Das aktuelle Kurs-Gewinn-Verhältnis (KGV) der Aktie.' },
        currentPrice: { type: Type.STRING, description: 'Der aktuelle Aktienkurs mit Währung, z.B. "175.50 USD".' },
    },
    required: ['ticker', 'companyName', 'country', 'peRatio', 'currentPrice'],
};

const tournamentWinnerSchema = {
    type: Type.OBJECT,
    properties: {
        ...tournamentParticipantSchema.properties,
        justification: { type: Type.STRING, description: 'Eine detaillierte Begründung in deutscher Sprache, warum diese Aktie das Turnier gewonnen hat.' },
    },
    required: ['ticker', 'companyName', 'country', 'peRatio', 'currentPrice', 'justification'],
};

const tournamentResultSchema = {
    type: Type.OBJECT,
    properties: {
        companyExists: { type: Type.BOOLEAN, description: "Gibt an, ob ein reales, börsennotiertes Unternehmen für den initialen Ticker gefunden wurde." },
        winner: tournamentWinnerSchema,
        participants: {
            type: Type.ARRAY,
            description: 'Eine Liste aller 6 teilnehmenden Aktien (die ursprüngliche und 5 Konkurrenten). Nur vorhanden, wenn companyExists true ist.',
            items: tournamentParticipantSchema,
        },
    },
    required: ['companyExists'],
};

export const getTournamentResult = async (ticker: string, context?: { companyName: string, country: string }): Promise<TournamentResult> => {
    try {
        let contextHint = '';
        if (context && context.companyName && context.country) {
            contextHint = ` Das Start-Unternehmen ist '${context.companyName}' aus dem Land '${context.country}'. Nutze diese Information, um bei der Identifizierung des Unternehmens über das Tickersymbol '${ticker}' Mehrdeutigkeiten zu vermeiden.`
        }

       const prompt = `Handle als Experte für vergleichende Finanzaktienanalyse.
Deine Aufgabe ist es, ein Aktienturnier für das Unternehmen mit dem Tickersymbol '${ticker}' durchzuführen.${contextHint}

Schritt 1: Überprüfung
Überprüfe sorgfältig, ob '${ticker}' ein gültiges Tickersymbol für ein echtes, börsennotiertes Unternehmen ist. ${contextHint ? `Beachte dabei den Kontext: ${contextHint}` : ''}

Schritt 2: Antwort generieren
- **FALLS UNGÜLTIG:** Wenn kein reales Unternehmen für den Ticker existiert, gib ein JSON-Objekt zurück, bei dem NUR das Feld 'companyExists' auf 'false' gesetzt ist. Erfinde KEINE Daten.
- **FALLS GÜLTIG:** Wenn das Unternehmen existiert, setze 'companyExists' auf 'true' und fahre mit dem Turnier fort.
    1. Identifiziiziere Kerngeschäft, Branche, Marktkapitalisierung und Herkunftsland der Aktie.
    2. Finde 5 relevante Konkurrenzaktien aus 5 VERSCHIEDENEN Ländern (und auch vom Land der ursprünglichen Aktie verschieden), die in Branche und Größe vergleichbar sind.
    3. Führe ein "Schweizer System"-Turnier mit allen 6 Aktien durch. Bewerte sie auf Basis von Rentabilität, Wachstum, Bewertung, finanzieller Gesundheit, Marktstellung und Innovation.
    4. Ermittle einen einzelnen Gesamtsieger.
    5. Liefere das Ergebnis im geforderten JSON-Format. Für jeden Teilnehmer, gib den aktuellen Aktienkurs und das KGV an. Die Begründung für den Sieg muss detailliert und auf Deutsch sein. Die Teilnehmerliste muss alle 6 Aktien enthalten. Fülle alle Felder des JSON-Schemas aus.`;


        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: tournamentResultSchema,
                temperature: 0.4,
            },
        });

        const jsonString = response.text.trim();
        const result = JSON.parse(jsonString) as TournamentResult;

        if (!result || typeof result.companyExists !== 'boolean') {
            console.error("Gemini API did not return a valid Tournament result object:", result);
            throw new Error("Ungültiges Datenformat von der API empfangen.");
        }
        
        if (result.companyExists === true) {
             if (!result.winner || !Array.isArray(result.participants)) {
                console.error("Gemini API returned incomplete data for existing company tournament:", result);
                throw new Error("Unvollständige Daten von der API für ein existierendes Unternehmen empfangen. Bitte versuchen Sie es erneut.");
            }
        }

        return result;

    } catch (error) {
        console.error("Error calling Gemini API for Tournament analysis:", error);
         if (error instanceof Error) {
            throw error;
        }
        throw new Error("Fehler bei der Abfrage der Turnier-Analyse von der Gemini API.");
    }
};

export const getTickerForCompany = async (companyName: string): Promise<string | null> => {
    // Heuristik, um zu prüfen, ob die Eingabe bereits ein Ticker sein könnte
    if (companyName.length <= 6 && companyName.toUpperCase() === companyName && !companyName.includes(' ')) {
        return companyName;
    }

    try {
        const prompt = `Was ist das primäre Börsenkürzel (Ticker-Symbol) für das Unternehmen "${companyName}"? Antworte NUR mit dem Ticker-Symbol (z.B. AAPL für Apple, MBG.DE für Mercedes-Benz). Wenn du kein eindeutiges Symbol findest, antworte mit dem Wort "UNKNOWN". Gib keine weitere Erklärung.`;
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                temperature: 0,
                stopSequences: ['\n']
            },
        });

        const ticker = response.text.trim();
        
        if (ticker && ticker !== 'UNKNOWN' && !ticker.includes(' ') && ticker.length < 15) {
            return ticker;
        }
        return null;

    } catch (error) {
        console.error(`Error fetching ticker for company name "${companyName}":`, error);
        return null;
    }
};