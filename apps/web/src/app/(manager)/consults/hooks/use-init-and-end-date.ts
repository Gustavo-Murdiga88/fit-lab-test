import { useMemo } from "react";

import type { AgendaProps } from "../../agendas/components/modal-agenda";

export function useInitAndEndDate({
  data,
}: {
  data?: Array<AgendaProps & { id: string }>;
}) {
  const initAndEndDate = useMemo(() => {
    const intervals: Array<{ start: Date; end: Date }> = [];
    if (data?.length) {
      data.forEach(({ times }) =>
        times.forEach(({ interval }) =>
          intervals.push({
            end: (interval.end as any).toDate(),
            start: (interval.start as any).toDate(),
          }),
        ),
      );
    }

    return intervals[0];
  }, [data]);

  return {
    initAndEndDate,
  };
}
