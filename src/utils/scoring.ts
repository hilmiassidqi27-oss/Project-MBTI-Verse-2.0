import { Question, MBTIResult, DimensionScore } from '../types';
import { INDUSTRIAL_QUESTIONS } from '../data/questions';
import { MBTI_PROFILES } from '../data/mbtiProfiles';

export function calculateMBTIResult(answers: Record<number, number>): MBTIResult {
  // Dimension accumulator: positive -> right pole (I, N, F, P), negative -> left pole (E, S, T, J)
  const rawScores = {
    EI: 0,
    SN: 0,
    TF: 0,
    JP: 0
  };

  const counts = {
    EI: 0,
    SN: 0,
    TF: 0,
    JP: 0
  };

  INDUSTRIAL_QUESTIONS.forEach((q: Question) => {
    const ans = answers[q.id] ?? 3; // default neutral if unanswered
    // (ans - 3) gives -2, -1, 0, 1, 2
    // Multiply by direction gives score toward right pole
    const delta = (ans - 3) * q.direction;
    rawScores[q.dimension] += delta;
    counts[q.dimension] += 1;
  });

  const calcDimension = (
    axis: 'EI' | 'SN' | 'TF' | 'JP',
    leftCode: string,
    rightCode: string,
    leftLabel: string,
    rightLabel: string
  ): DimensionScore => {
    const raw = rawScores[axis];
    const maxRaw = (counts[axis] || 8) * 2; // max possible raw spread (8 questions * 2 = 16)
    // Convert to percentage for right pole (0 to 100)
    // 0 raw = 50%
    const normalizedRatio = maxRaw > 0 ? Math.max(-1, Math.min(1, raw / maxRaw)) : 0;
    let rightPct = Math.round(50 + normalizedRatio * 50);
    rightPct = Math.max(0, Math.min(100, rightPct));
    let leftPct = 100 - rightPct;

    const dominantCode = rightPct >= leftPct ? (raw >= 0 ? rightCode : leftCode) : leftCode;
    const dominantLabel = dominantCode === rightCode ? rightLabel : leftLabel;

    const diff = Math.abs(rightPct - leftPct);
    let clarityScore: DimensionScore['clarityScore'] = 'Slight';
    if (diff >= 40) clarityScore = 'Very Clear';
    else if (diff >= 25) clarityScore = 'Clear';
    else if (diff >= 12) clarityScore = 'Moderate';

    return {
      leftCode,
      rightCode,
      leftLabel,
      rightLabel,
      leftPct,
      rightPct,
      dominantCode,
      dominantLabel,
      clarityScore
    };
  };

  const dimEI = calcDimension('EI', 'E', 'I', 'Ekstrovert (E)', 'Introvert (I)');
  const dimSN = calcDimension('SN', 'S', 'N', 'Sensing (S)', 'Intuition (N)');
  const dimTF = calcDimension('TF', 'T', 'F', 'Thinking (T)', 'Feeling (F)');
  const dimJP = calcDimension('JP', 'J', 'P', 'Judging (J)', 'Perceiving (P)');

  const mbtiCode = `${dimEI.dominantCode}${dimSN.dominantCode}${dimTF.dominantCode}${dimJP.dominantCode}`;
  const profile = MBTI_PROFILES[mbtiCode] || MBTI_PROFILES['ISTP'];

  return {
    code: mbtiCode,
    nickname: profile.nickname,
    profile,
    dimensions: {
      EI: dimEI,
      SN: dimSN,
      TF: dimTF,
      JP: dimJP
    },
    completionTime: new Date().toISOString()
  };
}
