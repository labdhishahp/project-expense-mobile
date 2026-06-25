import { useCallback, useEffect, useState } from 'react';

import type { MonthKey, MonthlySummary, Summary } from '../models';
import { toUserMessage } from '../database/errors';
import { summaryService } from '../services/summaryService';

type UseSummaryState = {
  summary: Summary | null;
  loading: boolean;
  error: string | null;
};

export function useSummary(recentLimit = 10) {
  const [state, setState] = useState<UseSummaryState>({
    summary: null,
    loading: true,
    error: null,
  });

  const refresh = useCallback(async () => {
    setState((current) => ({ ...current, loading: true, error: null }));

    try {
      const summary = await summaryService.getSummary(recentLimit);
      setState({ summary, loading: false, error: null });
    } catch (error) {
      setState((current) => ({
        ...current,
        loading: false,
        error: toUserMessage(error),
      }));
    }
  }, [recentLimit]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const getMonthlySummary = useCallback(
    async (month: MonthKey): Promise<MonthlySummary> =>
      summaryService.getMonthlySummary(month),
    [],
  );

  return {
    summary: state.summary,
    loading: state.loading,
    error: state.error,
    refresh,
    getMonthlySummary,
  };
}
