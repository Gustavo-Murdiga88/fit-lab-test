import { useMemo } from "react";
import type { AgendaProps } from "../http/get-agenda-by-id";


export type PayloadConsultProps = {
  patient: string;
  date: Date;
  hour: string;
  agendaId?: string;
  nutritionistId: string;
};

export function useHoursAvailable({
  data,
  options,
  consultsData,
  hour,
}: {
  data?: AgendaProps;
  consultsData?: Array<PayloadConsultProps & { id: string }>;
  hour?: string;
  options: {
    value: string;
    label: string;
  }[];
}) {
  const hoursAvailableToday = useMemo(() => {
    let rangeOptions: Array<{ label: string; value: string }> = [];
    if (data) {
      data.times.forEach(({ hours }) =>
        hours.forEach(({ end, start }) => {
          const initIndex = options.findIndex((hour) => hour.value === start);
          const endIndex = options.findIndex((hour) => hour.value === end);

          const optionsIndex = options.slice(initIndex, endIndex + 1);

          rangeOptions.push(...optionsIndex);
        }),
      );
    }

    if (consultsData?.length) {
      rangeOptions = rangeOptions.filter(
        ({ value }) =>
          !consultsData.some((consult) => consult.hour === value) ||
          value === hour,
      );
    }

    return rangeOptions;
  }, [data, consultsData]);

  return {
    hoursAvailableToday,
  };
}
